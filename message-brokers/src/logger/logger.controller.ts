import { Controller, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Notification } from '../notification/notification.entity';
import { RetryService } from '../retry/retry.service';
import { getErrorMessage } from '../utils';

@Controller()
export class LoggerController implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly retryService: RetryService) {}

  log(notification: Notification) {
    // throw new Error('Log error');
    console.log('📨 Notification received:', notification.event);
  }

  @MessagePattern('events.notifications')
  async logNotification(@Payload() notification: Notification) {
    try {
      // throw new Error('Test error');
      this.log(notification);
    } catch (error) {
      console.error(
        'Error while logging notification:',
        getErrorMessage(error),
      );
      await this.retryService.addNotificationForRetry(notification);
    }
  }

  onModuleInit() {
    this.retryService.startRetryWorker(this.log.bind(this));
  }

  onModuleDestroy() {
    this.retryService.stopRetryWorker();
  }
}
