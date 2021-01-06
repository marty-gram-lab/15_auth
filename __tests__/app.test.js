const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

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
});
