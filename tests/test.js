const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();
const User = require('../models/user');

chai.use(chaiHttp);

// Log in
const agent = chai.request.agent(app);
agent
  .post('/session')
  .send({ username: 'me', password: '123' })
  .then(function (res) {
    expect(res).to.have.cookie('sessionid');
    // The `agent` now has the sessionid cookie saved, and will send it
    // back to the server in the next request:
    return agent.get('/user/me')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });

chai.request(server)
  .put('/login')
  .send({ username: 'test1@test.com', password: 'test123', confirmPassword: 'test123' })
  .then(function (res) {
    expect(res).to.have.status(200);
  })
  .catch(function (err) {
    throw err;
  });
