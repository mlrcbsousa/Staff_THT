import express from 'express';
import bodyParser from 'body-parser';
import controller from './Controller';
import dotenv from 'dotenv';
import auth from './auth';

dotenv.config()

const jsonErrorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).send({ error: err });
}
const notFoundHandler: express.RequestHandler = (req, res, next) => {
  res.status(404).json({ message: "Sorry can't find that!" });
}

export class Application {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.run();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(jsonErrorHandler);
  }

  private routes(): void {
    let router = express.Router();
    router.post('/login', controller.login);
    router.post('/employees', auth, controller.addEmployee);
    router.delete('/employees/:id', auth, controller.deleteEmployee);
    router.get('/ss', auth, controller.fetchSS);
    router.get('*', notFoundHandler);
    router.head('*', notFoundHandler);
    router.post('*', notFoundHandler);
    router.put('*', notFoundHandler);
    router.delete('*', notFoundHandler);
    router.connect('*', notFoundHandler);
    router.options('*', notFoundHandler);
    router.trace('*', notFoundHandler);
    router.patch('*', notFoundHandler);
    this.express.use('/', router);
  }

  private run(): void {
    const port = process.env.PORT || 8000;

    this.express.listen(port, () => {
      console.log(`Server Started! Port: ${port}`);
    });
  }
}
