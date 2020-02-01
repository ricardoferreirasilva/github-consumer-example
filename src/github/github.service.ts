import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { request } from 'express';

@Injectable()
export class GithubService {
    
    apiURL : string
    constructor(private readonly httpService: HttpService){
        this.apiURL = "https://api.github.com";
        
    }

    async checkIfUserExists(username : string) : Promise<boolean> {
        const requestURL = this.apiURL + `/users/${username}`
        const response = await this.httpService.get(requestURL).pipe( 
            catchError(e => {
            throw new HttpException("Github user does not exist. ", 404)
          })).toPromise()
        if(response.status == 404) return false;
        else return true;
    }
    async getRepositories(username : string){
        const requestURL = this.apiURL + `/users/${username}/repos`
        const response = await this.httpService.get(requestURL).toPromise()
        const repositories : any[] = response.data;
        for (const repository of repositories) {
            const repositoryName = repository.full_name;
            const login = repository.owner.login;
        }
        return [];
    }
}
