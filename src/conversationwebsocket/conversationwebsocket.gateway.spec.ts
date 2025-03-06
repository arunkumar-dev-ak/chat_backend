import { Test, TestingModule } from '@nestjs/testing';
import { ConversationwebsocketGateway } from './conversationwebsocket.gateway';

describe('ConversationwebsocketGateway', () => {
  let gateway: ConversationwebsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationwebsocketGateway],
    }).compile();

    gateway = module.get<ConversationwebsocketGateway>(
      ConversationwebsocketGateway,
    );
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
