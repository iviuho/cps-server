import { Test, TestingModule } from '@nestjs/testing';
import { EventsubController } from './eventsub.controller';

describe('EventsubController', () => {
  let controller: EventsubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsubController],
    }).compile();

    controller = module.get<EventsubController>(EventsubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
