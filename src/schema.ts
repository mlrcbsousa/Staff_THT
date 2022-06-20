import Joi from 'joi';
import { Currency, Department, SubDepartment } from './globals';

export const toValues = (enumerator: Object) => Object.keys(enumerator).filter(k => isNaN(Number(k)));

const schema = Joi.object({
  name: Joi.string().required(),
  salary: Joi.number().integer().min(0).required(),
  currency: Joi.string().valid(...toValues(Currency)).required(),
  department: Joi.string().valid(...toValues(Department)).required(),
  on_contract: Joi.boolean(),
  sub_department: Joi.string().valid(...toValues(SubDepartment)).required(),
});

export const validateEmployee = (employee: Json) => schema.validate(employee);
