import { Currency , Department, SubDepartment } from './globals';

declare global {
  type Json = {
    [field: string]: string | Json | Json[]
  }

  type Employee = {
    id?: number
    name: string
    salary: number
    currency: Currency
    department: Department
    on_contract?: boolean
    sub_department: SubDepartment
  }

  type User = {
    id: string
    email: string
    password: string
    token: string | null
  }
}
