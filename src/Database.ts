import data from './dataset.json'
import { Currency, Department, SubDepartment } from './globals';

// preprocess
const strToNumber = (val: string): number => parseInt(val);
const strToBoolean = (val: string): boolean | null => val === 'true' ? true : val === 'false' ? false : null;

export class Database {
  employees: Employee[]

  constructor(data: Json[]){
    this.employees = data.map((d, index) => {
      const employee: Employee = {
        id: index + 1,
        name: d.name as string,
        salary: strToNumber(d.salary as string),
        currency: d.currency as Currency,
        department: d.department as Department,
        sub_department: d.sub_department as SubDepartment,
      };

      if (d.on_contract) {
        employee.on_contract = strToBoolean(d.on_contract as string);
      }

      return employee;
    })
  }

  add(employee: Employee): Employee {
    employee.id = this.employees.length + 1;
    this.employees.push(employee);
    return employee;
  }

  find(id: number): Employee {
    return this.employees.find(employee => employee.id === id);
  }

  remove(employee: Employee): void {
    const index = this.employees.indexOf(employee);
    this.employees.splice(index, 1);
  }

  salaries(employees: Employee[] = this.employees): number[] {
    return employees.map(({ salary }) => salary)
  }

  salariesOnContract(): number[] {
    return this.salaries(this.employees.filter(({ on_contract }) => on_contract));
  }

  salariesPerDepartment(department: Department): number[] {
    return this.salaries(this.employees.filter((employee) => {
      return employee.department === department;
    }));
  }

  salariesPerSubDepartment(department: Department, subDepartment: SubDepartment): number[] {
    return this.salaries(this.employees.filter((employee) => {
      return employee.department === department && employee.sub_department === subDepartment;
    }));
  }

}

export default new Database(data);
