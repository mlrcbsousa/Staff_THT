# Staff_THT

Clipboard hiring process Exercise

## Setup

To run the project download th repo, add a .env file with a **TOKEN_KEY** variable and run the following in the terminal. This will run `docker-compose up`

```bash
make
```

To run the integration tests and shutdown containers after

```bash
make test
```

To re-build after making changes

```bash
make re
```

## Usage

Run the app with `make` and access the app via `http://localhost:8000`

#### Example:

```
curl http://localhost:8000
```

### Login

Used to create a token to authenticate a user.

**ATTENTION** all the other endpoints require this token in the headers to authorize the request

#### Endpoint

```
POST /login
```

#### Params

```json
{
	"email": "email",
	"password": "password"
}
```

**IMPORTANT** you can use the above `DUMMY_USER` credentials to authenticate and authorize your requests

#### Example

```bash
curl -X POST http://localhost:8000/login \
   -H 'Content-Type: application/json' \
   -d '{"email":"email","password":"password"}'
```

#### Return

```bash
{"email":"email","id":"id","token":"... generated token ..."}
```

### Create Employee

Used to create an employee

#### Endpoint

```
POST /employees
```

#### Params

Accepts employee info of the following type:

```ts
type Employee = {
	name: string
	salary: number
	currency: Currency
	department: Department
	on_contract?: boolean
	sub_department: SubDepartment
}
```

Where `currency`, `department` and `sub_department` are the following possible values:

```ts
enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  INR = 'INR',
}

enum Department {
  Engineering = 'Engineering',
  Banking = 'Banking',
  Operations = 'Operations',
  Administration = 'Administration',
}

enum SubDepartment {
  Platform = 'Platform',
  Loan = 'Loan',
  CustomerOnboarding = 'CustomerOnboarding',
  Agriculture = 'Agriculture',
}
```

#### Example

```bash
curl -X POST http://localhost:8000/employees \
   -H 'Content-Type: application/json' \
   -H 'x-access-token: $GENERATED_TOKEN' \
   -d '{"name":"Jeremy","salary":30000,"currency":"EUR","department":"Banking","sub_department":"Loan"}'
```

#### Return

```bash
{"name":"Jeremy","salary":30000,"currency":"EUR","department":"Banking","sub_department":"Loan","id":10}
```

### Delete Employee

Used to delete an employee

#### Endpoint

```
DELETE /employees/:id
```

#### Params

Path `id` is the ID of the employee.

#### Example

```bash
curl -X DELETE http://localhost:8000/employees/$EMPLOYEE_ID \
   -H 'x-access-token: $GENERATED_TOKEN'
```

#### Return

```bash
{"name":"Jeremy","salary":30000,"currency":"EUR","department":"Banking","sub_department":"Loan","id":10}
```

or

```bash
{"message":"The employee with the provided ID does not exist."}
```

### Summary Statistics for Employees

Get Summary Statistics for all the employees

#### Endpoint

```
GET /ss
```

#### Example

```bash
curl http://localhost:8000/ss -H 'x-access-token: $GENERATED_TOKEN'
```

#### Return

Returns an array of Summary Statistics of the type:

```ts
type SummaryStatistic = {
	department?: Department
	sub_department?: SubDepartment
	mean: number
	min: number
	max: number
}
```

```bash
[{"mean":22295010,"min":30,"max":200000000}]
```

### Summary Statistics for On Contract Employees

Get Summary Statistics for all the on contract employees

#### Endpoint

```
GET /ss?filter=on_contract
```

#### Params

The `filter` query param is of the following type:

```ts
enum Filter {
  on_contract = 'on_contract',
  department = 'department',
  sub_department = 'sub_department',
}
```

#### Example

```bash
curl http://localhost:8000/ss\?filter=on_contract -H 'x-access-token: $GENERATED_TOKEN'
```

### Summary Statistics per Department

Get Summary Statistics per Department

#### Endpoint

```
GET /ss?filter=department
```

#### Example

```bash
curl http://localhost:8000/ss\?filter=department -H 'x-access-token: $GENERATED_TOKEN'
```

#### Return

```bash
[{"mean":40099006,"min":30,"max":200000000,"department":"Engineering"},{"mean":90000,"min":90000,"max":90000,"department":"Banking"},{"mean":35015,"min":30,"max":70000,"department":"Operations"},{"mean":30,"min":30,"max":30,"department":"Administration"}]
```

### Summary Statistics per Sub-Department

Get Summary Statistics per Sub-Department

#### Endpoint

```
GET /ss?filter=sub_department
```

#### Example

```bash
curl http://localhost:8000/ss\?filter=sub_department -H 'x-access-token: $GENERATED_TOKEN'
```

#### Return

```bash
[{"mean":40099006,"min":30,"max":200000000,"department":"Engineering","sub_department":"Platform"},{"mean":90000,"min":90000,"max":90000,"department":"Banking","sub_department":"Loan"},{"mean":35015,"min":30,"max":70000,"department":"Operations","sub_department":"CustomerOnboarding"},{"mean":30,"min":30,"max":30,"department":"Administration","sub_department":"Agriculture"}]
```
