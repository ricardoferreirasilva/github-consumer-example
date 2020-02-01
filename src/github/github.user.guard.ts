import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { GithubService } from './github.service';

@Injectable()
export class GithubUserGuard implements CanActivate {
    constructor(private readonly githubService : GithubService){}

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request : Request = context.switchToHttp().getRequest();
        const accept = request.header("accept");
        const username = request.query.username;
        if(accept.match("application/json")){
            
            const userExists = await this.githubService.checkIfUserExists(username)
            if(userExists) return true;
            else throw new HttpException("Github user does not exist. ", 404)
        }
        else throw new HttpException("Invalid application type.",406)
    }
}