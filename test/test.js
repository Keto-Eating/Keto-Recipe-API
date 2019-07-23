/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
const agent = chai.request.agent(server);

describe('Users', () => {
  // Sign-up
  it('should signup a single user POST', (done) => {
    const min = 100;
    const max = 10000000;
    const random = Math.floor(Math.random() * max) + min;
    const random2 = Math.floor(Math.random() * max) + min;
    agent.post('/signup')
      .send({
        username: `test${random}@test${random2}.com`,
        password: 'test123',
      })
      .end((err, res) => {
        if (err) {
          console.log('Error: ', err.message);
        }
        // expect to get re-directed to home on success
        expect(res).to.have.status(200); // re-direct http code
        expect(res.req.path).to.equal('/'); // expected URL path
        done();
      });
  });
});