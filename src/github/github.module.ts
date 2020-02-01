import { Module, HttpModule } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { GithubUserGuard } from './github.user.guard';

@Module({
  imports: [HttpModule],
  controllers: [GithubController],
  providers: [GithubService, GithubUserGuard]
})
export class GithubModule {}
