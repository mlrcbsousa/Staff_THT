import chai from "chai";
import chaiHttp from "chai-http";
import { generatedToken } from './auth'

chai.should();

const SERVER_URL = process.env.APP_URL || "http://localhost:8000";

chai.use(chaiHttp);

const TEST_EMPLOYEE = {
  name: "Jeremy",
  salary: 456789,
  currency: "USD",
  department: "Operations",
  sub_department: "CustomerOnboarding"
};

describe("Records APIs", () => {

  describe("POST /employees", () => {

    it("should create a new employee", done => {
      chai
        .request(SERVER_URL)
        .post("/employees")
        .set('x-access-token', generatedToken)
        .send(TEST_EMPLOYEE)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(201);
          res.should.be.json;
          const employee = res.body;
          employee.should.be.a("object");
          employee.should.have.property("id");
          Object.keys(TEST_EMPLOYEE).forEach(key => {
            employee.should.have.property(key);
          })
          employee.name.should.equal(TEST_EMPLOYEE.name);
          employee.salary.should.equal(TEST_EMPLOYEE.salary);
          employee.currency.should.equal(TEST_EMPLOYEE.currency);
          employee.department.should.equal(TEST_EMPLOYEE.department);
          employee.sub_department.should.equal(TEST_EMPLOYEE.sub_department);
          done();
        });
    });

    it("should not create an invalid employee", done => {
      TEST_EMPLOYEE.department = "invalid"

      chai
        .request(SERVER_URL)
        .post("/employees")
        .set('x-access-token', generatedToken)
        .send(TEST_EMPLOYEE)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          const error = res.body;
          error.should.have.property("_original");
          error.details.should.be.a("array");
          error.details[0].should.have.property("message");
          error.details[0].message.should.equal(
            '"department" must be one of [Engineering, Banking, Operations, Administration]'
          );
          done();
        });
    });
  });

  /**
   * Test the DELETE route
   */
  describe("DELETE /employees/:id", () => {
    it("It should DELETE an existing employee", (done) => {
      const id = 1;
      chai
        .request(SERVER_URL)
        .delete("/employees/" + id)
        .set('x-access-token', generatedToken)
        .end((err, response) => {
          response.should.be.json;
          response.should.have.status(200);
          done();
        });
    });

    it("It should NOT DELETE a employee that is not in the database", (done) => {
      const id = 145;
      chai
        .request(SERVER_URL)
        .delete("/employees/" + id)
        .set('x-access-token', generatedToken)
        .end((err, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.message.should.be.eq("The employee with the provided ID does not exist.");
          done();
        });
    });
  });


})
