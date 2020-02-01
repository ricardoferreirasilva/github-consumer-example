import { Controller,Get, Query, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubUserGuard } from './github.user.guard';
import {ApiHeader} from '@nestjs/swagger';

@Controller('github')
export class GithubController {


    constructor(private readonly githubService : GithubService){}

    @UseGuards(GithubUserGuard)
    @Get("repositories")
    repositories(@Query("username") username : string): any {
        return this.githubService.getRepositories(username);
    }

}
