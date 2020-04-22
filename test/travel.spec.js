process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let mongoose = require("mongoose");
let should = chai.should();
let route = 'travels'

const dataProvider = [
  "createdAt",
  "status",
  "_id",
  "departureDate",
  "arrivalDate",
  "name",
  "type"
];

var bearerToken = ''
var idUser = ''

chai.use(chaiHttp);
//Our parent block
/*
 * Test the /GET route
 */

describe("/POST user", () => {
  let travelCreated = "";
  it("it should POST a user", done => {
    let user = {
      username: "vitakus@travelTest.com",
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
        done();
      });
  });

  describe("/LOGIN user", function () {
    it(`it should LOGIN a one user`, function (done) {
      let userLogin = {
        username: "vitakus@travelTest.com",
        password: "123"
      };
      chai
        .request(server)
        .post(`/auth`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .send(userLogin)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.auth.should.have.own.property('token');
          bearerToken = res.body.data.auth.token
          idUser = res.body.data._id
          done();
        });
    });
  });
});

describe("/POST travel", () => {
  let travelCreated = "";
  it("it should POST travel", done => {
    let user = {
      owner: idUser,
      departureDate: "123",
      arrivalDate: "123",
      name: "VIAGEM TOP"
    };
    chai
      .request(server)
      .post(`/v1/${route}`)
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        dataProvider.forEach(element => {
          travelCreated = res.body.data;
          res.body.data.should.have.own.property(element);
        });
        done();
      });
  });

  describe("/GET travel", function () {
    it(`it should TRAVEL a one travel`, function (done) {
      chai
        .request(server)
        .get(`/v1/${route}/${travelCreated._id}`)
        .set('Authorization', `Bearer ${bearerToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          done();
        });
    });
    describe("/PATCH travel", function () {
      it(`it should PATCH a one travel`, function (done) {
        let travelUpdated = {
          name: "Viagem Mais que top",
        };
        chai
          .request(server)
          .patch(`/v1/${route}/${travelCreated._id}`)
          .set('Authorization', `Bearer ${bearerToken}`)
          .send(travelUpdated)
          .end((err, res) => {
            res.should.have.status(200);
            dataProvider.forEach(element => {
              res.body.data.should.have.own.property(element);
            });
            for (const key in travelUpdated) {
              if (travelUpdated.hasOwnProperty(key)) {
                res.body.data[key].should.to.equal(travelUpdated[key]);
              }
            }
            done();
          });
      });
      describe("/PUT travel", function () {
        it(`it should UPDATE a one travel`, function (done) {
          let travelUpdated = {
            name: "VIAGEM TOP UPDATED 3",
            type: "city"
          };
          chai
            .request(server)
            .put(`/v1/${route}/${travelCreated._id}`)
            .set('Authorization', `Bearer ${bearerToken}`)
            .send(travelUpdated)
            .end((err, res) => {
              res.should.have.status(200);
              dataProvider.forEach(element => {
                res.body.data.should.have.own.property(element);
              });
              for (const key in travelUpdated) {
                if (travelUpdated.hasOwnProperty(key)) {
                  res.body.data[key].should.to.equal(travelUpdated[key]);
                }
              }
              done();
            });
        });

        describe("/GET travels", () => {
          it("it should GET all the travels", done => {
            chai
              .request(server)
              .get(`/v1/${route}`)
              .set('Authorization', `Bearer ${bearerToken}`)
              .end((err, res) => {
                res.should.have.status(200);
                dataProvider.forEach(element => {
                  res.body.data[0].should.have.own.property(element);
                });
                done();
              });
          });

          describe("/DELETE travel", function () {
            it(`it should DELETE a one travel`, function (done) {
              chai
                .request(server)
                .del(`/v1/${route}/${travelCreated._id}`)
                .set('Authorization', `Bearer ${bearerToken}`)
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
});

before(function (done) {
  mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }, function () {
    mongoose.connection.db.dropDatabase(function () {
      done()
    })
  })
})
