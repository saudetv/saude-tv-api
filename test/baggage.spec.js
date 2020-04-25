process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let mongoose = require("mongoose");
let should = chai.should();
let route = 'travels'

const dataProvider = [
  "status",
  "_id",
  "name",
  "type"
];

let travelCreated = "";
let baggageCreated = "";

chai.use(chaiHttp);

describe("🧳 ALL Test baggages.", () => {
  describe("☺ Test good scenery.", function () {
    it("it should POST baggage", done => {
      let baggage = {
        name: "Pente",
        type: "Higiene"
      };
      chai
        .request(server)
        .post(`/v1/travels/${travelCreated}/baggages`)
        .send(baggage)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            baggageCreated = res.body.data.baggage[0];
            res.body.data.baggage[0].should.have.own.property(element);
          });
          done();
        });
    });
    it(`it should TRAVEL a one Baggage`, function (done) {
      chai
        .request(server)
        .get(`/v1/travels/${travelCreated}/baggages/${baggageCreated._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          done();
        });
    });
    it(`it should PATCH a one travel`, function (done) {
      let baggageUpdated = {
        status: false,
      };
      chai
        .request(server)
        .patch(`/v1/travels/${travelCreated}/baggages/${baggageCreated._id}`)
        .send(baggageUpdated)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          for (const key in baggageUpdated) {
            if (baggageUpdated.hasOwnProperty(key)) {
              res.body.data[key].should.to.equal(baggageUpdated[key]);
            }
          }
          done();
        });
    });
    it(`it should UPDATE a one BAGGAGE`, function (done) {
      let baggageUpdated = {
        name: "nova att",
        status: true
      };
      chai
        .request(server)
        .put(`/v1/travels/${travelCreated}/baggages/${baggageCreated._id}`)
        .send(baggageUpdated)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          for (const key in baggageUpdated) {
            if (baggageUpdated.hasOwnProperty(key)) {
              res.body.data[key].should.to.equal(baggageUpdated[key]);
            }
          }
          done();
        });
    });
    it("it should GET all the baggages", done => {
      chai
        .request(server)
        .get(`/v1/travels/${travelCreated}/baggages/${baggageCreated._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          dataProvider.forEach(element => {
            res.body.data.should.have.own.property(element);
          });
          done();
        });
    });
    it(`it should DELETE a one travel`, function (done) {
      chai
        .request(server)
        .del(`/v1/travels/${travelCreated}/baggages/${baggageCreated._id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.baggage.should.have.lengthOf(0);
          done();
        });
    });
  });

  before(function (done) {
    var travel = {
      departureDate: "123",
      arrivalDate: "123",
      name: "VIAGEM TOP"
    };
    chai
      .request(server)
      .post(`/v1/travels`)
      .send(travel)
      .end((err, res) => {
        travelCreated = res.body.data._id
        done();
      });
  })

  after(function (done) {
    chai
      .request(server)
      .del(`/v1/travel/${travelCreated}`)
      .end((err, res) => {
        done();
      });
  })
});