import chai from "chai";
import chaiHttp from "chai-http";

chai.should();
const SERVER_URL = process.env.APP_URL || "http://localhost:8000";
chai.use(chaiHttp);

const DUMMY_USER = {
  email: "email",
  password: "password",
};

let generatedToken: string;

describe("Auth APIs", () => {

  describe("POST /login", () => {
    it("should block when no token passed", done => {
      chai
        .request(SERVER_URL)
        .get("/ss")
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(403);
          res.should.be.json;
          res.body.message.should.equal('A token is required for authentication');
          done();
        });
    });

    it("should block unauthorized user", done => {
      chai
        .request(SERVER_URL)
        .get("/ss")
        .set('x-access-token', 'some_value')
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(401);
          res.should.be.json;
          res.body.message.should.equal('Invalid Token');
          done();
        });
    });

    it("should return user auth token", done => {
      chai
        .request(SERVER_URL)
        .post("/login")
        .send(DUMMY_USER)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.should.be.json;
          const user = res.body;
          user.should.be.a("object");
          user.should.have.property("email");
          user.should.have.property("token");
          user.should.have.property("id");
          generatedToken = user.token;
          done();
        });
    });

    it("should allow user with valid token", done => {
      chai
        .request(SERVER_URL)
        .get("/ss")
        .set('x-access-token', generatedToken)
        .end((err, res) => {
          if (err) done(err)
          res.should.have.status(200);
          res.should.be.json;
          done();
        });
    });
  });

})

export { generatedToken }
