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
    agent.post('/sign-up')
      .send({
        username: 'test2@test.com',
        password: 'test123',
      })
      .end((err) => {
        if (err) {
          console.log('Error: ', err.message);
        }
        expect(agent).to.have.cookie('nToken');
        done();
      });
  });
});
