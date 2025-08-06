import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      brokers: ['localhost:9092'],
    });

    this.producer = this.kafka.producer();
  }

  async send({ event }: Notification) {
    try {
      await this.producer.send({
        topic: 'events.notifications',
        messages: [
          {
            value: JSON.stringify({ event }),
          },
        ],
      });
    } catch (error) {
      console.error('Send message failed via error:', error);
    }
  }

  async onModuleInit() {
    await this.producer.connect();
    console.log('Kafka connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    console.log('Kafka disconnected');
  }
}
