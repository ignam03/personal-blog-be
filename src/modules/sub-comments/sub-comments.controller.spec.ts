import { Test, TestingModule } from '@nestjs/testing';
import { SubCommentsController } from './sub-comments.controller';
import { SubCommentsService } from './sub-comments.service';

describe('SubCommentsController', () => {
  let controller: SubCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCommentsController],
      providers: [SubCommentsService],
    }).compile();

    controller = module.get<SubCommentsController>(SubCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
