import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { filter, Subject } from 'rxjs';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import { OnModuleDestroy } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { MessageDTO } from '../dto/message.dto';

const INSTANCE_ID = uuid(); // 🎯 унікальний для кожної репліки

type ChatEvent<T> = T & { src: typeof INSTANCE_ID };

type MessageEvent = ChatEvent<{
  ev: 'message';
  data: MessageDTO;
}>;

type TypingEvent = ChatEvent<{
  ev: 'typing';
  data: {
    isTyping: boolean;
    chatId: string;
    user: string;
  };
}>;

type GateWayEvent = MessageEvent | TypingEvent;

const isLocalEvent = (ev: GateWayEvent) => ev.src === INSTANCE_ID;

@WebSocketGateway({ path: '/ws', cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  private readonly sub: Redis;
  private event$ = new Subject<GateWayEvent>();

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly redis: Redis,
    private messagesService: MessagesService,
  ) {
    this.sub = this.redis.duplicate();

    this.sub.subscribe('chat-events');

    this.sub.on('message', (_, raw) => {
      const event: GateWayEvent = JSON.parse(raw);

      if (isLocalEvent(event)) return;

      this.event$.next(event);
    });

    this.event$.subscribe((e) => {
      this.server.to(e.data.chatId).emit(e.ev, e.data);
    });

    const localEvent$ = this.event$.pipe(filter(isLocalEvent));

    localEvent$.subscribe((e: GateWayEvent) =>
      this.redis.publish('chat-events', JSON.stringify(e)),
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

    this.event$.next({
      ev: 'message',
      data: message,
      src: INSTANCE_ID,
    });
  }

  @SubscribeMessage('typing')
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; isTyping: boolean },
  ) {
    this.event$.next({
      ev: 'typing',
      data: {
        chatId: body.chatId,
        user: client.data.user,
        isTyping: body.isTyping,
      },
      src: INSTANCE_ID,
    });
  }
}
