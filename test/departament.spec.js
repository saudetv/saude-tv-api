// process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");
// let Departament = require('../src/models/Departament');

// //Require the dev-dependencies
// let chai = require('chai');
// let chaiHttp = require('chai-http');
// let server = require('../server');
// let should = chai.should();

// const dataProvider = ["name", "initials", "createdAt", "status", "_id"];

// const baseUrl = "departaments"

// chai.use(chaiHttp);

// describe('/POST departament', () => {
//     let created = "";
//     it('it should POST a departament', (done) => {
//         let requestBody = {
//             initials: "ADS",
//             name: "Análise e desenvolvimento de sistemas"
//         }
//         chai.request(server)
//             .post(`/v1/${baseUrl}`)
//             .send(requestBody)
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 dataProvider.forEach(element => {
//                     created = res.body.data;
//                     created.should.have.own.property(element);
//                 });

//                 done();
//             });
//     }).timeout(4000)
//     describe('/GET course', function () {
//         it(`it should GET a one course`, function (done) {
//             chai.request(server)
//                 .get(`/v1/${baseUrl}/${created._id}`)
//                 .end((err, res) => {
//                     res.should.have.status(200);
//                     dataProvider.forEach(element => {
//                         res.body.data.should.have.own.property(element);
//                     });
//                     done();
//                 });
//         }).timeout(4000);
//         describe('/PUT course', function () {
//             it(`it should UPDATE a one course`, function (done) {
//                 let courseUpdated = {
//                     initials: "FAR",
//                     name: "Farmácia"
//                 }
//                 chai.request(server)
//                     .put(`/v1/${baseUrl}/${created._id}`)
//                     .send(courseUpdated)
//                     .end((err, res) => {
//                         res.should.have.status(200);
//                         dataProvider.forEach(element => {
//                             res.body.data.should.have.own.property(element);
//                         });
//                         for (const key in courseUpdated) {
//                             if (courseUpdated.hasOwnProperty(key)) {
//                                 res.body.data[key].should.to.equal(courseUpdated[key])
//                             }
//                         }
//                         done();
//                     });
//             });


//             describe('/GET courses', () => {
//                 it('it should GET all the courses', (done) => {
//                     chai.request(server)
//                         .get(`/v1/${baseUrl}`)
//                         .end((err, res) => {
//                             res.should.have.status(200);
//                             dataProvider.forEach(element => {
//                                 res.body.data[0].should.have.own.property(element);
//                             });
//                             done();
//                         });
//                 }).timeout(4000);
//                 describe('/DELETE course', function () {
//                     it(`it should DELETE a one course`, function (done) {
//                         chai.request(server)
//                             .del(`/v1/${baseUrl}/${created._id}`)
//                             .end((err, res) => {
//                                 res.should.have.status(200);
//                                 dataProvider.forEach(element => {
//                                     res.body.data.should.have.own.property(element);
//                                 });
//                                 done();
//                             });
//                     });
//                 });
//             });

//         });
//     });
// });