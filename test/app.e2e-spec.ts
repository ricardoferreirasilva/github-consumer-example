import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { GithubService } from 'src/github/github.service';

describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/github/repositories', () => {
    return request(app.getHttpServer())
      .get('/github/repositories').set("Accept", "application/json").query({username:"ricardoferreirasilva"})
      .expect(200)
  });

  it('/github/repositories', () => {
    return request(app.getHttpServer())
      .get('/github/repositories').set("Accept", "application/xml").query({username:"ricardoferreirasilva"})
      .expect(406)
  });

  it('/github/repositories', () => {
    return request(app.getHttpServer())
      .get('/github/repositories').set("Accept", "application/json").query({username:"12313forsurethisusernamedoesnotexist123123"})
      .expect(404)
  });

});
