import { Test, TestingModule } from '@nestjs/testing';
import { ChatsseController } from './chatsse.controller';

describe('ChatsseController', () => {
  let controller: ChatsseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatsseController],
    }).compile();

    controller = module.get<ChatsseController>(ChatsseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
