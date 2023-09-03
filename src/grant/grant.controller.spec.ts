import { Test, TestingModule } from '@nestjs/testing';
import { GrantController } from './grant.controller';

describe('GrantController', () => {
  let controller: GrantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrantController],
    }).compile();

    controller = module.get<GrantController>(GrantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
