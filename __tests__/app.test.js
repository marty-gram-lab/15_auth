const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('15_auth routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('should sign up a user via POST', async() => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'myemail@email.com', password: 'password', profilePhotoURL: 'myphotourl.com' })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          email: 'myemail@email.com',
          profilePhotoURL: 'myphotourl.com'
        });
      });
  });

  it('lets a user login', async() => {
    const user = await UserService.create({
      email: 'myemail@email.com', 
      password: 'password', 
      profilePhotoURL: 'myphotourl.com'
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    expect(res.body).toEqual({
      id: user.id,
      email: 'password'
    });
  });
});
