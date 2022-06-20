import { Request, Response, NextFunction } from 'express'
import db from './Database'
import { validateEmployee } from './schema'
import jwt from 'jsonwebtoken';

const DUMMY_USER: User = {
  id: "id",
  email: "email",
  password: "password",
  token: null,
};

export default {
  login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      let user: User = null;
      if (email === DUMMY_USER.email) {
        user = DUMMY_USER;
      }

      if (user && (password === user.password)) {
        const token = jwt.sign(
          { user_id: user.id, email },
          process.env.TOKEN_KEY,
          { expiresIn: "2h" }
        );
        res.status(200).json({ email: user.email, id: user.id, token });
      }
    } catch (error) {
      console.log(error)
    }
  },
  addEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = validateEmployee(req.body);
      if (error) return res.status(400).send(error)

      const employee = db.add(req.body);
      res.status(201).send(employee);
    } catch (error) {
      console.log(error)
    }
  },
  deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const employee = db.find(parseInt(id));
      if (!employee) return res.status(404).json({
        message: "The employee with the provided ID does not exist."
      });

      db.remove(employee);
      res.send(employee);
    } catch (error) {
      console.log(error)
    }
  },
}
