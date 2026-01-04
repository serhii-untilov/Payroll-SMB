import { Test, TestingModule } from '@nestjs/testing';
import { UserAccessController } from './user-access.controller';
import { UserAccessService } from './user-access.service';

describe('UserAccessController', () => {
  let controller: UserAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAccessController],
      providers: [UserAccessService],
    }).compile();

    controller = module.get<UserAccessController>(UserAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
