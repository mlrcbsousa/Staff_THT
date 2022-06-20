import { Database } from './Database'
import { Filter } from './globals';
import { toValues } from './schema';
import { Department, SubDepartment } from './globals';

export class Service {
  db: Database;
  options: Options;

  filters = {
    [Filter.on_contract]: this.onContract,
    [Filter.department]: this.perDepartment,
    [Filter.sub_department]: this.perSubDepartment,
  }

  constructor(db: Database, options: Options = {}) {
    this.db = db;
    this.options = options;
  }

  run(): SummaryStatistic[] {
    const { filter } = this.options;
    if (filter && filter in Filter) {
      return this.filters[filter].call(this);
    }
    return [this.calculate(this.db.salaries())];
  }

  private onContract(): SummaryStatistic[] {
    const salaries = this.db.salariesOnContract();
    return salaries.length ? [this.calculate(salaries)] : [];
  }

  private perDepartment(): SummaryStatistic[] {
    const result: SummaryStatistic[] = [];
    toValues(Department).forEach((department: Department) => {
      const salaries = this.db.salariesPerDepartment(department);
      if (salaries.length) {
        result.push({
          ...this.calculate(salaries),
          department
        })
      }
    })
    return result;
  }

  private perSubDepartment(): SummaryStatistic[] {
    const result: SummaryStatistic[] = [];
    toValues(Department).forEach((department: Department) => {
      toValues(SubDepartment).forEach((sub_department: SubDepartment) => {
        const salaries = this.db.salariesPerSubDepartment(department, sub_department);
        if (salaries.length) {
          result.push({
            ...this.calculate(salaries),
            department,
            sub_department,
          })
        }
      })
    })
    return result;
  }

  private calculate(salaries: number[]): SummaryStatistic {
    return {
      mean: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
      min: Math.round(Math.min(...salaries)),
      max: Math.round(Math.max(...salaries)),
    }
  }
}
