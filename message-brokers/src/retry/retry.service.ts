import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Notification } from '../notification/notification.entity';
import { getErrorMessage } from '../utils';
import { catchError, EMPTY, expand, from, Subscription } from 'rxjs';

const STREAM = 'retries.notifications';
const GROUP = 'retries.notifications.group';
const CONSUMER = `worker-${process.pid}`;

type RetryNotificationMessage = {
  retryCount: number;
  notification: Notification;
};

@Injectable()
export class RetryService {
  retrySubscription?: Subscription;

  constructor(private readonly redisService: RedisService) {}

  async addNotificationForRetry(notification: Notification) {
    await this.redisService.addStreamMessage(STREAM, {
      retryCount: 5,
      notification,
    });
  }

  async startRetryWorker(log: (notification: Notification) => void) {
    await this.redisService.createStream(STREAM, GROUP);

    this.retrySubscription = from(this.readMessagesOnce(log))
      .pipe(expand(() => from(this.readMessagesOnce(log))))
      .subscribe();
  }

  stopRetryWorker() {
    this.retrySubscription?.unsubscribe();
  }

  async readMessagesOnce(log: (notification: Notification) => void) {
    const messages =
      await this.redisService.readStreamMessages<RetryNotificationMessage>(
        STREAM,
        GROUP,
        CONSUMER,
      );

    for (const { message, id } of messages) {
      try {
        log(message.notification);
      } catch (err) {
        const retryCount = Number(message.retryCount);
        console.error(`Retry error (${retryCount}):`, getErrorMessage(err));

        if (retryCount > 1) {
          await this.redisService.addStreamMessage(STREAM, {
            retryCount: retryCount - 1,
            notification: message.notification,
          });
        } else {
          console.error('Max retries reached');
        }
      } finally {
        await this.redisService.commitStreamMessage(STREAM, GROUP, id);
      }
    }
  }
}
