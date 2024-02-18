import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should authenticate user and return JWT token', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'iyal@gmail.com', password: '12345678' });

    expect(response.status).toBe(200);
    expect(response.body.access_token).toBeDefined();
    authToken = response.body.access_token;
  });

  it('should return 401 Unauthorized without JWT token', async () => {
    await request(app.getHttpServer()).get('/protected-route').expect(401);
  });

  it('should return 200 OK with valid JWT token', async () => {
    await request(app.getHttpServer())
      .get('/protected-route')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });
});
