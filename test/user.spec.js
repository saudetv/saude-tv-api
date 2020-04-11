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
  "password"
];

chai.use(chaiHttp);
//Our parent block
/*
 * Test the /GET route
 */

describe("/POST user", () => {
  let userCreated = "";
  it("it should POST a user", done => {
    let user = {
      username: "Vitor Arualiado",
      name: "Vitor",
      password: "123"
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

  describe("/GET user", function () {
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
    describe("/PUT user", function () {
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

      describe("/GET users", () => {
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

        describe("/DELETE user", function () {
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
    });
  });
});
