process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();

const dataProvider = [
  "createdAt",
  "status",
  "_id",
  "username",
  "name",
  "password",
  "type"
];

var bearerToken = ''

chai.use(chaiHttp);

describe("\🙋‍♂️ ALL Test users.", () => {
  describe("☺ Test good scenery.", function () {
    let userCreated = "";
    it("it should POST a user", done => {
      let user = {
        username: "vitakus@gmail.com",
        name: "Vitor",
        password: "123",
        type: "local"
      };
      chai
        .request(server)
        .post("/v1/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            userCreated = res.body.data;
            res.body.data.should.have.own.property(element);
          });
          done();
        });
    });
    it(`it should LOGIN a one user`, function (done) {
      let userLogin = {
        username: "vitakus@gmail.com",
        password: "123"
      };
      chai
        .request(server)
        .post(`/auth`)
        .send(userLogin)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          res.body.data.auth.should.have.own.property('token');
          bearerToken = res.body.data.auth.token
          done();
        });
    });
    it(`it should GET a one user`, function (done) {
      chai
        .request(server)
        .get(`/v1/users/${userCreated._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          done();
        });
    });
    it(`it should PATCH a one user`, function (done) {
      let userUpdated = {
        username: "sadasdasdasdasd5454545",
      };
      chai
        .request(server)
        .patch(`/v1/users/${userCreated._id}`)
        .send(userUpdated)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          for (const key in userUpdated) {
            if (userUpdated.hasOwnProperty(key)) {
              res.body.data[key].should.to.equal(userUpdated[key]);
            }
          }
          done();
        });
    });
    it(`it should UPDATE a one user`, function (done) {
      let userUpdated = {
        username: "sadasdasdasdasd",
        name: "Vitor2",
        password: "1232"
      };
      chai
        .request(server)
        .put(`/v1/users/${userCreated._id}`)
        .send(userUpdated)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          for (const key in userUpdated) {
            if (userUpdated.hasOwnProperty(key)) {
              res.body.data[key].should.to.equal(userUpdated[key]);
            }
          }
          done();
        });
    });
    it("it should GET all the Users", done => {
      chai
        .request(server)
        .get("/v1/users")
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data[0].should.have.own.property(element);
          });
          done();
        });
    });
    it(`it should DELETE a one user`, function (done) {
      chai
        .request(server)
        .del(`/v1/users/${userCreated._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          done();
        });
    });
  });
});