import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { request } from 'express';

@Injectable()
export class GithubService {
    
    apiURL : string
    requestSettings : any
    requestHeaders : any
    constructor(private readonly httpService: HttpService){
        this.apiURL = "https://api.github.com";
        this.requestHeaders = {"Authorization" : "token 22cd2c109eb8b0f06b97cf36c76e3bf40d94a18b"};
        this.requestSettings = {
            headers : {
                "Authorization" : "token 22cd2c109eb8b0f06b97cf36c76e3bf40d94a18b"
            }
        }
        
    }

    async getUsername(username : string) : Promise<boolean> {
        const requestURL = this.apiURL + `/users/${username}`
        const response = await this.httpService.get(requestURL, this.requestSettings).pipe( 
            catchError(e => {
            throw new HttpException("Github user does not exist. ", 404)
          })).toPromise()
        if(response.status == 404) return false;
        else return response.data;
    }
    async getRepositories(username : string){

        // Getting user repositories.
        const requestURL = this.apiURL + `/users/${username}/repos`
        const response = await this.httpService.get(requestURL, {headers : this.requestHeaders, params : {type : "owner"}}).toPromise()
        const repositories : any[] = response.data;

        
        const filteredRepositories = []

        // Foreach repository, get branches.
        for (const repository of repositories) {
            const repositoryName = repository.full_name;
            const fork = repository.fork;
            if(!fork){
                const filteredRepository = {repository: repositoryName, login: repository.owner.login, branches:[]}
                const branches = await this.getBranches(repositoryName)
                for (const branch of branches) {
                    const sha = branch.commit.sha;
                    const name = branch.name;
                    filteredRepository.branches.push({branch:name , sha:sha })
                }
                filteredRepositories.push(filteredRepository)
            }
        }
        return filteredRepositories;
    }

    // Get branches function.
    async getBranches(repositoryName : string){
        const requestURL = this.apiURL + `/repos/${repositoryName}/branches`
        const response = await this.httpService.get(requestURL,{headers : this.requestHeaders}).toPromise()
        return response.data
    }
}
