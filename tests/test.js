const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();
const expect = chai.expect;
const User = require('../models/user');

chai.use(chaiHttp);
const agent = chai.request.agent(server);

describe('Users', () => {
  // Sign-up
  it('should signup a single user POST', (done) => {
    agent.post('/sign-up')
      .send({
        username: 'test2@test.com',
        password: 'test123'
      })
      .end((err, res) => {
        expect(agent).to.have.cookie('nToken');
        done();
      });
  });
  // Login
  // agent
  //   .post('/session')
  //   .send({ username: 'test2@test.com', password: 'test123' })
  //   .then(function (res) {
  //     expect(res).to.have.cookie('sessionid');
  //     // The `agent` now has the sessionid cookie saved, and will send it
  //     // back to the server in the next request:
  //     return agent.get('/')
  //       .then(function (res) {
  //         expect(res).to.have.status(200);
  //       });
  //   });
  //
  // chai.request(server)
  //   .put('/login')
  //   .send({ username: 'test1@test.com', password: 'test123', confirmPassword: 'test123' })
  //   .then(function (res) {
  //     expect(res).to.have.status(200);
  //   })
  //   .catch(function (err) {
  //     throw err;
  //   });
});
