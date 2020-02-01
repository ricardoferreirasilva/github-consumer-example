import { Controller,Get, Query, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubUserGuard } from './github.user.guard';
import {ApiHeader} from '@nestjs/swagger';

@Controller('github')
export class GithubController {


    constructor(private readonly githubService : GithubService){}

    @UseGuards(GithubUserGuard)
    @Get("repositories")
    async repositories(@Query("username") username : string) {
        const user = await this.githubService.getUsername(username)
        const repositories = await this.githubService.getRepositories(username);
        return repositories

    }

}
