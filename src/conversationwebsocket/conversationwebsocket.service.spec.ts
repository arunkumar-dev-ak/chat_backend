import { Test, TestingModule } from '@nestjs/testing';
import { ConversationwebsocketService } from './conversationwebsocket.service';

describe('ConversationwebsocketService', () => {
  let service: ConversationwebsocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationwebsocketService],
    }).compile();

    service = module.get<ConversationwebsocketService>(
      ConversationwebsocketService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
