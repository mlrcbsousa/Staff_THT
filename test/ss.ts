import chai from "chai";
import chaiHttp from "chai-http";
import { generatedToken } from './auth'

chai.should();
const SERVER_URL = process.env.APP_URL || "http://localhost:8000";
chai.use(chaiHttp);

export enum Department {
  Engineering = 'Engineering',
  Banking = 'Banking',
  Operations = 'Operations',
  Administration = 'Administration',
}

export enum SubDepartment {
  Platform = 'Platform',
  Loan = 'Loan',
  CustomerOnboarding = 'CustomerOnboarding',
  Agriculture = 'Agriculture',
}

type SummaryStatistic = {
  department?: Department
  sub_department?: SubDepartment
  mean: number
  min: number
  max: number
}

describe("SS APIs", () => {

  describe("GET /ss", () => {
    it("should return summary statistics", done => {
      chai
        .request(SERVER_URL)
        .get("/ss")
        .set('x-access-token', generatedToken)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.should.be.json;
          const result = res.body;
          result.should.be.a("array");
          result.forEach((ss: SummaryStatistic) => {
            ss.should.have.property("mean");
            ss.should.have.property("min");
            ss.should.have.property("max");
          });
          done();
        });
    });
  });

  describe("GET /ss?filter=on_contract", () => {
    it("should return summary statistics for on contract employees", done => {
      chai
        .request(SERVER_URL)
        .get("/ss")
        .query({ filter: 'on_contract' })
        .set('x-access-token', generatedToken)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.should.be.json;
          const result = res.body;
          result.should.be.a("array");
          result.forEach((ss: SummaryStatistic) => {
            ss.should.have.property("mean");
            ss.should.have.property("min");
            ss.should.have.property("max");
          });
          done();
        });
    });
  });

  describe("GET /ss?filter=department", () => {
    it("should return summary statistics per department", done => {
      chai
        .request(SERVER_URL)
        .get("/ss")
        .query({ filter: 'department' })
        .set('x-access-token', generatedToken)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.should.be.json;
          const result = res.body;
          result.should.be.a("array");
          result.forEach((ss: SummaryStatistic) => {
            ss.should.have.property("department");
            ss.should.have.property("mean");
            ss.should.have.property("min");
            ss.should.have.property("max");
          });
          done();
        });
    });
  });

  describe("GET /ss?filter=sub_department", () => {
    it("should return summary statistics per sub-department", done => {
      chai
        .request(SERVER_URL)
        .get("/ss")
        .query({ filter: 'sub_department' })
        .set('x-access-token', generatedToken)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.should.be.json;
          const result = res.body;
          result.should.be.a("array");
          result.forEach((ss: SummaryStatistic) => {
            ss.should.have.property("department");
            ss.should.have.property("sub_department");
            ss.should.have.property("mean");
            ss.should.have.property("min");
            ss.should.have.property("max");
          });
          done();
        });
    });
  });

})
