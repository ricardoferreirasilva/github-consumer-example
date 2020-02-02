import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { HttpModule } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubUserGuard } from './github.user.guard';

describe('GithubService', () => {
  let service: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [GithubController],
      providers: [GithubService, GithubUserGuard]
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
