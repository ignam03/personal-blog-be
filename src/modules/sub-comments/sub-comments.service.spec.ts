import { Test, TestingModule } from '@nestjs/testing';
import { SubCommentsService } from './sub-comments.service';

describe('SubCommentsService', () => {
  let service: SubCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubCommentsService],
    }).compile();

    service = module.get<SubCommentsService>(SubCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
