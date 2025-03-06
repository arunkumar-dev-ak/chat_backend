import { Test, TestingModule } from '@nestjs/testing';
import { ChatsseService } from './chatsse.service';

describe('ChatsseService', () => {
  let service: ChatsseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatsseService],
    }).compile();

    service = module.get<ChatsseService>(ChatsseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
