import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import { OnModuleDestroy } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';

const INSTANCE_ID = uuid(); // 🎯 унікальний для кожної репліки
@WebSocketGateway({ path: '/ws', cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  private readonly sub: Redis;
  private event$ = new Subject<{ ev: string; data: any; meta?: any }>();

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly redis: Redis,
    private messagesService: MessagesService,
  ) {
    this.sub = this.redis.duplicate();

    this.sub.subscribe('chat-events');

    this.sub.on('message', (_, raw) => {
      const parsed = JSON.parse(raw);

      if (parsed.src === INSTANCE_ID) return; // ⬅️ skip own

      this.server.to(parsed.data.chatId).emit(parsed.ev, parsed.data);
    });

    this.event$
      .pipe(filter((e) => e.meta?.local))
      .subscribe((e) =>
        this.redis.publish(
          'chat-events',
          JSON.stringify({ ...e, meta: undefined, src: INSTANCE_ID }),
        ),
      );
  }

  onModuleDestroy() {
    this.sub.disconnect();
    this.redis.disconnect();
  }

  handleConnection(client: Socket) {
    const user = client.handshake.auth?.user as string;

    if (!user) return client.disconnect(true);
    client.data.user = user;

    console.log(`[${INSTANCE_ID}]: ${user} connected`);
    // forward broadcast events belonging to this user
  }

  @SubscribeMessage('join')
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string },
  ) {
    client.join(body.chatId);
  }

  @SubscribeMessage('leave')
  onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string },
  ) {
    client.leave(body.chatId);
  }

  @SubscribeMessage('send')
  async onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string },
  ) {
    const message = await this.messagesService.addChatMessage(
      client.data.user,
      body.chatId,
      body.text,
    );

    this.server.to(body.chatId).emit('message', message);

    this.event$.next({
      ev: 'message',
      data: message,
      meta: { local: true },
    });
  }

  @SubscribeMessage('typing')
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; isTyping: boolean },
  ) {
    const event = {
      chatId: body.chatId,
      user: client.data.user,
      isTyping: body.isTyping,
    };

    this.server.to(event.chatId).emit('typing', event);

    this.event$.next({
      ev: 'typing',
      data: event,
      meta: { local: true },
    });
  }
}
