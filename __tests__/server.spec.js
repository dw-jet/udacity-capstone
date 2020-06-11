const supertest = require('supertest')
const app = require('../src/server/server')
const request = supertest(app)

it('Server responds to get request', async done => {
    const res = await request.get('/');
    expect(res.status).toBe(200)
    done();
})