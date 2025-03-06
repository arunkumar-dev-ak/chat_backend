import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

interface MessageEventType {
  type: string;
  data: unknown;
}

@Injectable()
export class ChatsseService {
  private readonly clients = new Map<string, Subject<MessageEventType>>();

  /*
     Subject<MessageEvent> acts as an observer and observable
    Observable -> only used to subscribe to client(listen for changes)
    Observer -> emits data to the clients which measn sends to the listener
    MessageEvent -> {type: string; data: any;}
    */
  subscribeToUser({
    userId,
  }: {
    userId: string;
  }): Observable<MessageEventType> {
    if (!this.clients.get(userId)) {
      this.clients.set(userId, new Subject<MessageEventType>());
    }
    return this.clients.get(userId)!.asObservable();
  }

  sendEventToUser({
    userId,
    event,
    data,
  }: {
    userId: string;
    event: string;
    data: unknown;
  }) {
    const client = this.clients.get(userId);
    const eventData: MessageEventType = {
      type: event,
      data,
    };
    if (client) {
      client.next(eventData);
    }
  }

  unsubscribeUser(userId: string) {
    if (this.clients.has(userId)) {
      this.clients.get(userId)?.complete();
      this.clients.delete(userId);
    }
  }

  isUserSubscribed({ userId }: { userId: string }): boolean {
    return this.clients.has(userId);
  }
}
