import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { request } from 'express';
import * as Environment from "dotenv"
Environment.config()

@Injectable()
export class GithubService {
    
    apiURL : string
    requestSettings : any
    requestHeaders : any
    constructor(private readonly httpService: HttpService){
        this.apiURL = "https://api.github.com";
        this.requestHeaders = {"Authorization" : `token ${process.env.TOKEN}`};
        this.requestSettings = {
            headers : {
                "Authorization" : `token ${process.env.TOKEN}`
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
        const branchRequests = []

        // Create a promise for each get branches request and load up a promise array.
        for (const repository of repositories) {
            const repositoryName = repository.full_name;
            const fork = repository.fork;
            if(!fork){
                filteredRepositories.push({repository: repositoryName, login: repository.owner.login, branches:[]})
                branchRequests.push(this.getBranches(repositoryName));
               
            }
        }

        // Wait all branch requests for performance. Order is mantained.
        const branchResponses = await Promise.all(branchRequests);

        //Assign all branches to the respective repository.
        for (let i = 0; i < filteredRepositories.length; i++) {
            const branches = branchResponses[i].data
            for (const branch of branches) {
                const sha = branch.commit.sha;
                const name = branch.name;
                filteredRepositories[i].branches.push({branch:name , sha:sha })
            }
        }
        return filteredRepositories;
    }

    // Get branches function.
    async getBranches(repositoryName : string){
        const requestURL = this.apiURL + `/repos/${repositoryName}/branches`
        return this.httpService.get(requestURL,{headers : this.requestHeaders}).toPromise()
    }
}
