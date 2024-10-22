# Payroll SMB

**Payroll SMB** is a web application that:

- helps employers and employees calculate salaries and taxes according to the chosen country's laws.
- features a responsive UI design, multi-tenant architecture, auto-generated REST API, role-based access with JWT authorization, event-driven calculation processing, automatic document preparation according to business process schedules, and SSE enabling the client to receive automatic updates from the server.

## Key features

- UI Responsive Design
- Multi-tenant architecture
- Auto-generated REST API
- REST API documented in Open API by Swagger
- Mono-repository, shared types libs between back-end and front-end apps
- Role-based access, JWT authorization
- Event-driven calculate processing
- Automatic documents prepared according to the business process schedule
- Automatic update of data on the client after the completion of the batch calculation on the server (SSE)

## Live Demo

Link to [Live Demo](https://payroll.untilov.com.ua)

## Quick Start

For a quick start, run this command on a Linux server:

``` bash
curl -s https://raw.githubusercontent.com/serhii-untilov/Payroll-SMB/master/scripts/download-and-run | bash
```

Note: Docker required.

- [Get Docker Desktop](https://docs.docker.com/guides/getting-started/get-docker-desktop/)
- [How To Install and Use Docker on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)

## Safe Start

``` bash
curl -s https://raw.githubusercontent.com/serhii-untilov/Payroll-SMB/master/scripts/download | bash

cd ~/payroll-smb
```

In the .env.docker file replace the variables with desired values: DATABASE_USERNAME, DATABASE_PASSWORD, POSTGRES_USER, POSTGRES_PASSWORD, PGUSER.

Perform script to create database and start the application:

``` bash
./start
```

In Production mode frontend and backend applications works on the same port:

- Backend URL <http://localhost:3000/api>
- Frontend URL <http://localhost:3000>

## Requirements

### Operating system

Payroll SMB should run on most Unix, Linux, macOS and Windows systems as long as Docker is available on this platform.

### Technical Parameters for Server or Workstation

- 1 GB of memory
- 1 CPU, 1 core
- 10 GB of disk space

*The program has been tested with the specified configuration on a [DigitalOcean](https://www.digitalocean.com/products/droplets) VPS. See the [live demo](https://payroll.untilov.com.ua).*

## Development

### Installing tools

Install Java for the OpenAPI Generator

``` bash
sudo apt install default-jre
```

Install Docker & Docker Compose

``` bash
sudo apt install docker docker-compose
sudo systemctl start docker.socket
sudo systemctl enable docker.socket
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
# Reboot if still got error
reboot
```

### Clone project and run the app in dev mode

Before initial build:

- Install Docker and Docker Compose
- Install Java openjdk LTS version for codegen

Initial build and run app in dev mode:

``` bash
git clone https://github.com/serhii-untilov/Payroll-SMB.git
cd Payroll-SMB
npm i -g turbo
npm i -g typeorm
npm i
npm run codegen
npm run build
npm run dev
```

In development mode, the frontend and backend applications work on different ports:

- Backend URL <http://localhost:3000/api>
- Frontend URL <http://localhost:5173>

Build docker images and push them on Docker Hub

``` bash
docker compose build && docker compose push
```

## Production

Pull Docker images and start the application

``` bash
curl -s https://raw.githubusercontent.com/serhii-untilov/Payroll-SMB/master/scripts/download-and-run | bash
```

Start the application

``` bash
./start
```

Stop the application

``` bash
./stop
```

Update the application, script files, and migrate database

``` bash
./update
```

Display the log file

``` bash
./logs
```

Display the resource usage statistics

``` bash
./stats
```

Creating a backup of a database

``` bash
./scripts/db_backup
```

This will create a ./postgres-backup/payroll.dump file.

Restoring a database from a backup file

``` bash
./scripts/db_restore
```

## Configuration

On a **production** server:

- replace environment variables in the .env.docker file
- start application

In **development** mode:

- copy apps/api/.env to apps/api/.env.locale
- copy apps/web/.env.development to apps/web/.env.locale
- replace environment variables in *.locale files
- run application

## Domain-specific language (DSL)

| English                   |Ukrainian                 | Short form        | Description                                                                    |
|-----------------------    |--------------------------|-------------------|--------------------------------------------------------------------------------|
|Admin                      |Адміністратор             |admin              |                                                                                |
|User                       |Користувач                |user               |                                                                                |
|Owner                      |Власник                   |owner              |                                                                                |
|Employer                   |Роботодавець              |employer           |                                                                                |
|Supervisor                 |Керівник                  |supervisor         |                                                                                |
|Accountant                 |Бухгалтер                 |accountant         |                                                                                |
|Collaborator               |Співробітник              |collaborator       |Помічник, асистент (assistant)                                                  |
|Employee                   |Працівник                 |employee           |Штатний працівник підприємства, співробітник                                    |
|Contractor                 |Підрядник                 |contractor         |Позаштатний працівник, тимчасовий, не постійний, на разову роботу               |
|Advisor                    |Консультант               |advisor            |                                                                                |
|Observer                   |Спостерігач               |observer           |                                                                                |
|Guest                      |Гість                     |guest              |                                                                                |
|Company                    |Підприємство              |company            |                                                                                |
|Tax ID                     |Податковий номер          |taxId              |                                                                                |
|Law                        |Законодавство             |law                |                                                                                |
|Accounting type            |Вид обліку                |accounting         |                                                                                |
|Payment schedule           |Розклад виплат            |paymentSchedule    |Every 15th and last day of month, Last day of month, First day of the next month|
|Accounting period          |Обліковий період          |accPeriod          |Період за який нараховано  (1С)                                                 |
|Payment period             |Розрахунковий період      |payPeriod          |Період в якому розраховано (1С)                                                 |
|Check date                 |Дата виплати              |checkDate          |                                                                                |
|Position                   |Штатна одиниця            |position           |                                                                                |
|Placement                  |Призначення               |placement          |Призначення на посаду, окладу, і т.і.                                           |
|Card Number                |Табельний номер           |cardNumber         |Номер картки у зовнішніх системах (кадровий облік, тощо) зберігати окремо       |
|Sequence Number            |Порядковий номер          |sequenceNumber     |The sequence number in payroll reports to place managers on top                 |
|Department                 |Підрозділ                 |department         |                                                                                |
|Job                        |Посада                    |job                |                                                                                |
|Vacancy                    |Вакансія                  |vacancy            |                                                                                |
|Working time norm          |Норма робочого часу       |workNorm           |                                                                                |
|Working time calendar      |Виробничий календар       |workCalendar       |                                                                                |
|Work Schedule              |Розклад роботи            |workSchedule       |                                                                                |
|Work Sheet                 |Табель робочого часу      |workSheet          |                                                                                |
|Work Sheet                 |Табель робочого часу      |workSheet          |                                                                                |
|Incoming balance           |Вхідний залишок           |inBalance          |                                                                                |
|Accrual                    |Нарахування               |accrual            |                                                                                |
|Deduction                  |Утримання                 |deduction          |                                                                                |
|Tax                        |Податок                   |tax                |                                                                                |
|Net pay                    |До виплати                |netPay             |                                                                                |
|Payment                    |Виплата                   |payment            |                                                                                |
|Outgoing balance           |Вихідний залишок          |outBalance         |                                                                                |
|Compensation               |Основна зарплата          |compensation       |                                                                                |
|Additional Earnings        |Додаткова зарплата        |additionalEarnings |                                                                                |
|Bonus                      |Премія                    |bonus              |                                                                                |
|Commission                 |Винагорода                |commission         |Винагорода по завершенню робіт                                                  |
|Payment Type               |Вид оплати                |paymentType        |                                                                                |
|Calculate Method           |Метод розрахунку          |calcMethod         |                                                                                |
|Payment Method             |Метод виплати             |paymentMethod      | Direct Deposit (Банк)                                                          |
|Recurring Reimbursement    |Періодичне відшкодування  |reimbursement      |Компенсація податку, мобільного зв'язку, проживання, тощо.                      |
|Garnishment                |Штраф, арешт на зарплату  |garnishment        |Обов'язкове відшкодування за рішенням суду, тощо.                               |
|Custom deduction           |Відрахування              |customDeduction    |Відрахування із заробітної плати за бажанням працівника                         |
|Withholding                |Утримання                 |withholding        |Утримання із зарплати за рішенням або за умовами роботодавця, додатковий податок|
|Additional Earnings        |Додатковий заробіток      |additionalEarnings |Надбавки, премії, доплати, приробіток                                           |
|Job & Pay                  |Робота і оплата           |jobAndPay          |                                                                                |
|Start Date                 |Дата прийому на роботу    |dateFrom           |                                                                                |
|Dismissal Date             |Дата звільнення           |dateTo             |                                                                                |
|Assignment                 |Призначення               |assignment         |Призначення працівника на посаду, призначення окладу, тощо.                     |
|Assignments History        |Історія призначень        |assignmentsHistory |                                                                                |
|Additional Earning         |Додаткове нарахування     |additionalEarning  |                                                                                |
|Additional Deduction       |Додаткове утримання       |additionalDeduction|                                                                                |
|Tax exemption              |Податкова пільга          |taxExemption       |                                                                                |
|Deferred income            |Доходи майбутніх періодів |deferredIncome     |                                                                                |
|Account Number             |Розрахунковий рахунок     |accountNumber      |Розрахунковий рахунок у банку                                                   |
|Routing Number             |Код банку                 |routingNumber      |Код банку                                                                       |
|Account Type               |Тип розрахункового рахунку|accountType        |Поточний                                                                        |
|Checking account           |Поточний рахунок          |checkingAccount    |Поточний розрахунковий рахунок                                                  |
|Total Earned               |Разом нараховано          |totalEarned        |                                                                                |
|Total Deducted             |Разом утримано            |totalDeducted      |                                                                                |
|Unified Social Contribution|Єдиний соціальний внесок  |fundECB            |                                                                                |
|Cancel                     |Сторно                    |cancel, cancelId   |Cancelled - сторновано, скасовано                                               |
|Company Debt               |Борг підприємства         |companyDebt        |                                                                                |
|Employee Debt              |Борг працівника           |employeeDebt       |                                                                                |
|USC                        |ЄСВ                       |ECB                |Unified Social Contribution - Єдиний соціальний внесок                          |
|Min Wage                   |Мінімальна зарплата       |minWage            |Мінімальна зарплата                                                             |
|USC to the minimum wage    |ЄСВ доплата до мін ЗП     |minWageECB         |Supplement to the minimum wage - Доплата до мінімальної зарплати                |
|Max base USC               |Максимальна баз ЄСВ       |maxBaseECB         |Максимальна сума оподаткування ЄСВ                                              |
|Advance Payment            |Виплата авансу            |advancePayment     |                                                                                |
|Regular Payment            |Виплата зарплати          |regularPayment     |                                                                                |
|Fast Payment               |Виплата у міжрозрахунок   |fastPayment        |Виплата у міжрозрахунковий період: оплата відпустки, розрахунок при звільненні  |
|Overdue Tasks              |Прострочені задачі        |overdueTasks       |                                                                                |
|Application-calculation    |Заява-розрахунок          |appCalcSif         |Application-calculation to the Social Insurance Fund - Заява-розрахунок до ФСС  |
|SIF                        |ФСС                       |sif                |The Social Insurance Fund - Фонд Соціального Страхування                        |
|Mandatory Payments         |Обов'язкові платежі       |mandatoryPayments  |Обов'язкові платежі при виплаті                                                 |
|Gross Pay                  |Разом нараховано          |grossPay           |Total amount of money an employee earns before any deductions are taken out     |
|Net Pay                    |До виплати                |netPay             |                                                                                |

## Project Development History

### Initial script

``` bash
# Create project
mkdir nest-react
cd nest-react
npm i -D turbo
npm i -g @nestjs/cli@latest
cd apps
nest new api
npm create vite@latest web
cd ..
npm install
npm run dev
npm run build

# Init "api" application for back-end
npm i --workspace @repo/api --save @nestjs/serve-static
npm i --workspace @repo/api --save-dev bcrypt
npm i --workspace @repo/api --save @nestjs/passport @nestjs/jwt passport-jwt
npm i --workspace @repo/api --save-dev @types/passport-jwt
npm i --workspace @repo/api --save dotenv
npm i --workspace @repo/api --save-dev typescript jest ts-jest @types/jest
npm i --workspace @repo/api --save date-fns
npm i --workspace @repo/api --save-dev @golevelup/ts-jest
npm i --workspace @repo/api --save-dev webpack-node-externals run-script-webpack-plugin webpack
npm i --workspace @repo/api --save-dev webpack webpack-cli
npm i --workspace @repo/api --save @nestjs/event-emitter
npm i --workspace @repo/api --save-dev @swc/cli @swc/core
npm i --workspace @repo/api --save-dev tsconfig-paths
npm i --workspace @repo/api --save typeorm
npm i --workspace @repo/api --save reflect-metadata
npm i --workspace @repo/api --save-dev @types/node
npm i --workspace @repo/api --save-dev supertest
npm i --workspace @repo/api --save helmet
npm i --workspace @repo/api --save @ngneat/falso

# Init "web" application for front-end
npm i --workspace @repo/web @tanstack/react-query
npm i --workspace @repo/web --save axios
npm i --workspace @repo/web --save react-router-dom
npm i --workspace @repo/web --save react-hook-form
npm i --workspace @repo/web --save @mui/material @emotion/react @emotion/styled
npm i --workspace @repo/web --save @fontsource/roboto
npm i --workspace @repo/web --save @mui/icons-material
npm i --workspace @repo/web --save @mui/x-data-grid
npm i --workspace @repo/web --save notistack
npm i --workspace @repo/web --save-dev typescript jest ts-jest @types/jest
npm i --workspace @repo/web --save avvvatars-react
npm i --workspace @repo/web --save react-i18next i18next
npm i --workspace @repo/web --save i18next-browser-languagedetector
npm i --workspace @repo/web --save @hookform/resolvers yup
npm i --workspace @repo/web --save material-ui-popup-state
npm i --workspace @repo/web --save i18next-http-backend
npm i --workspace @repo/web --save-dev rollup-plugin-visualizer
npm i --workspace @repo/web --save react-error-boundary
npm i --workspace @repo/web --save date-fns
npm i --workspace @repo/web --save react-number-format
npm i --workspace @repo/web --save @reduxjs/toolkit react-redux
npm i --workspace @repo/web --save @tanstack/react-query-devtools

# Init "shared" library for common types and interfaces
mkdir packages/shared
npm i --workspace @repo/shared --save sqlite3 ts-loader typeorm
npm i --workspace @repo/shared --save-dev ts-node typescript
npm i --workspace @repo/shared --save date-fns
npm i --workspace @repo/shared --save @repo/openapi

# Init "utils" shared library for common functions
mkdir packages/utils
npm i --workspace @repo/shared --save ts-loader
npm i --workspace @repo/shared --save-dev ts-node typescript jest

# Common packages
npm i @openapitools/openapi-generator-cli -D

```

### Nest JS

``` bash
# Create resources
npx --workspace @repo/api nest generate resource users resources
npx --workspace @repo/api nest generate resource laws resources
npx --workspace @repo/api nest generate resource accounting resources
npx --workspace @repo/api nest generate resource companies resources
npx --workspace @repo/api nest generate resource userCompanies resources
npx --workspace @repo/api nest generate resource users resources
npx --workspace @repo/api nest generate resource locales resources
npx --workspace @repo/api nest g module auth
npx --workspace @repo/api nest g controller auth
npx --workspace @repo/api nest g service auth
npx --workspace @repo/api nest generate resource departments resources
npx --workspace @repo/api nest generate resource jobs resources
npx --workspace @repo/api nest generate resource paymentTypes resources
npx --workspace @repo/api nest generate resource workNorms resources
npx --workspace @repo/api nest generate resource workNormPeriods resources
npx --workspace @repo/api nest generate resource payPeriods resources
npx --workspace @repo/api nest generate resource persons resources
npx --workspace @repo/api nest generate resource positions resources
npx --workspace @repo/api nest generate resource positionHistory resources
npx --workspace @repo/api nest generate resource access resources
npx --workspace @repo/api nest generate resource payroll resources
npx --workspace @repo/api nest generate resource processor
npx --workspace @repo/api nest generate service summaryCalculation processor
npx --workspace @repo/api nest generate service balanceCalculation processor
npx --workspace @repo/api nest generate service positionListener processor/listeners
npx --workspace @repo/api nest generate resource fundTypes resources
npx --workspace @repo/api nest generate resource funds resources
npx --workspace @repo/api nest generate resource minWage resources
npx --workspace @repo/api nest generate resource maxBaseECB resources
npx --workspace @repo/api nest generate service payFundCalculation processor
npx --workspace @repo/api nest generate service companyListener processor/listeners
npx --workspace @repo/api nest generate resource tasks resources
npx --workspace @repo/api nest generate service taskList processor
npx --workspace @repo/api nest generate service payPeriodCalculation processor
npx --workspace @repo/api nest generate controller serverEvent processor
npx --workspace @repo/api nest generate service serverEvent processor/serverEvent
npx --workspace @repo/api nest generate resource payments resources
npx --workspace @repo/api nest generate service paymentPositions resources/payments
npx --workspace @repo/api nest generate service paymentDeductions resources/payments
npx --workspace @repo/api nest generate service paymentFunds resources/payments
npx --workspace @repo/api nest generate service paymentCalculation processor
npx --workspace @repo/api nest generate controller paymentPositions resources/payments
npx --workspace @repo/api nest generate controller paymentDeductions resources/payments
npx --workspace @repo/api nest generate controller paymentFunds resources/payments

```

### TypeORM

``` bash
# Create an empty migration
npm run m:crt
# Generate a migration
npm run m:gen
# Run a migration
npm run m:run
# Revert a recent migration
npm run m:revert
```

### JWT

``` bash
# Generate JWT secret key
openssl rand -base64 60
```

## References

- [**Web apps development methodology** - The Twelve-Factor App](https://12factor.net)
- [**Project architecture** - Bulletproof node.js project architecture](https://dev.to/santypk4/bulletproof-node-js-project-architecture-4epf)
- [**Monorepo on Nx** - Full Stack Development Series](https://thefullstack.engineer/full-stack-development-series-an-introduction/)
- [**Turborepo** - Add Turborepo to your existing monorepo](https://turbo.build/repo/docs/getting-started/existing-monorepo)
- [**Commits** - Conventional Commits](https://www.conventionalcommits.org)
- [**NestJS** - Combine a NestJS app with React](https://youtu.be/nY0R7pslbCI?si=Lunb95j6enSY8GXE)
- [**Vite** - Server Proxy](https://vitejs.dev/config/server-options#server-proxy)
- [**NestJS** - Serve Static](https://docs.nestjs.com/recipes/serve-static)
- [**NestJS** - Tom Ray: Learn NestJS From The Ground Up](https://www.tomray.dev/)
- [**NestJS** - Crash Course: Everything you need to know! | NodeJS Tutorial 2023](https://youtu.be/2n3xS89TJMI?si=9EXCuQZD5xS6cZIW)
- [**Linter** - How to use ESLint with TypeScript](https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/)
- [**Prettier** - How to use Prettier with ESLint and TypeScript in VSCode](https://khalilstemmler.com/blogs/tooling/prettier/)
- [**TypeORM** - Generate Migration with TypeORM in Nest.js](https://www.bytestechnolab.com/blog/mastering-migration-with-typeorm-in-nestjs-step-by-step-guide/)
- [**JWT** - The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)
- [**NestJS** - NestJS JWT Authentication with Refresh Tokens Complete Guide](https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token)
- [**NestJS** - How to implement refresh tokens JWT in NestJS](https://webera.blog/how-to-implement-refresh-tokens-jwt-in-nestjs-b8093c5642a9)
- [**React** - React Libraries to Use in Your Projects in 2024](https://www.freecodecamp.org/news/react-libraries-to-use-in-your-projects/)
- [**React** - React Query and Axios (Typescript) example with Rest API](https://www.bezkoder.com/react-query-axios-typescript/)
- [**MUI** - Material UI - React Templates](https://mui.com/material-ui/getting-started/templates/)
- [**Icons** - MUI Icons](https://mui.com/material-ui/material-icons/)
- [**Icons** - Google Fonts - Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons)
- [**React** - Define React Routes With Better Approach (TypeScript)](https://medium.com/@ahsan-ali-mansoor/define-react-routes-with-better-approach-typescript-d07de782b517)
- [**React** - Rules of Hooks](https://legacy.reactjs.org/docs/hooks-rules.html)
- [**React** - React Typescript Authentication example with Hooks](https://www.bezkoder.com/react-typescript-authentication-example/)
- [**React** - Practical React Query](https://tkdodo.eu/blog/practical-react-query)
- [**React** - Using Material UI with React Hook Form](https://blog.logrocket.com/using-material-ui-with-react-hook-form/)
- [**React** - React Query and Forms](https://tkdodo.eu/blog/react-query-and-forms)
- [**React** - React Hook Form](https://react-hook-form.com/)
- [**React** - React Snackbars](https://notistack.com/)
- [**React** - React Data Grid](https://adazzle.github.io/react-data-grid/#/common-features)
- [**l10n** - React MUI Localization](https://www.geeksforgeeks.org/react-mui-localization/)
- [**i18n** - How to use i18n in your React App](https://medium.com/@devpedrodias/how-to-use-i18n-in-your-react-app-1f26deb2a3d8)
- [**TypeORM** - How to properly handle decimals with TypeORM](https://medium.com/@matthew.bajorek/how-to-properly-handle-decimals-with-typeorm-f0eb2b79ca9c)
- [**Postgres** - Working with Money in Postgres](https://www.crunchydata.com/blog/working-with-money-in-postgres)
- [**React** - React TypeScript Cheat Sheets](https://react-typescript-cheatsheet.netlify.app/)
- [**NestJS** - Advanced Testing Strategies with Mocks NestJS - @golevelup/ts-jest](https://trilon.io/blog/advanced-testing-strategies-with-mocks-in-nestjs)
- [**TypeORM** - PostgreSQL and typeorm — Advanced Querying](https://darraghoriordan.medium.com/postgresql-and-typeorm-advanced-querying-e5d8e4c950d6)
- [**NestJS** - Inject NestJS Service from Another Module](https://tiloid.com/p/inject-nestjs-service-from-another-module)
- [**Mocking** - Mocking Express Request with Jest and Typescript using correct types](https://stackoverflow.com/questions/57964299/mocking-express-request-with-jest-and-typescript-using-correct-types)
- [**SSE** - NestJS: A Request Progress Tracker Using SSE](https://medium.com/@leonardoacrg.dev/nestjs-a-request-progress-tracker-using-sse-b9f2fded9d70)
- [**SSE** - Backend to Frontend communication with Server-Sent Events](https://dev.to/cloudx/backend-to-frontend-communication-with-server-sent-events-56kf)
- [**SSE** - NestJS - Server-Sent Events](https://docs.nestjs.com/techniques/server-sent-events)
- [**SSE** - NestJS - Server-Sent Events](https://docs.nestjs.com/techniques/server-sent-events)
- [**SSE** - NestJS - How to Push Server-Sent Events (SSE) in NestJS](https://www.slingacademy.com/article/how-to-push-server-sent-events-sse-in-nestjs/)
- [**NestJS** - Sling Academy - NestJS Course](https://www.slingacademy.com/cat/node-js/)
- [**Typescript** - 4 Different Ways Of Creating A Map In TypeScript](https://timmousk.com/blog/typescript-map/)
- [**Release** - Release Please](https://github.com/googleapis/release-please)
- [**Docker** - postgres:15.0-alpine](https://hub.docker.com/layers/library/postgres/15.0-alpine/images/sha256-f46b2ae1a00a87552a52fe83d36f7aef60ef61f9d64baf3bfc4abaa89847024b?context=explore#!)
- [**VPS** - Initial Server Setup with Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)
- [**VPS** - Disabling Password Authentication on Your Server](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)
- [**VPS** - How To Install and Use Docker on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04)
- [**Redux** - Getting Started with React Redux](https://react-redux.js.org/introduction/getting-started)
- [**Backup** - Docker Postgres Backup/Restore Guide (with examples)](https://simplebackups.com/blog/docker-postgres-backup-restore-guide-with-examples/#before-you-begin)
- [**React Hook Form** - Combined Add/Edit (Create/Update) Form Example](https://jasonwatmore.com/post/2020/10/14/react-hook-form-combined-add-edit-create-update-form-example)
- [**ESLint** - ESLint no-unused-vars: _ ignore prefix](https://johnnyreilly.com/typescript-eslint-no-unused-vars)
- [**TypeScript** - How to Remove a Property from an Object in TypeScript](https://bobbyhadz.com/blog/typescript-object-remove-property)
- [**Yup** - Schema builder for runtime value parsing and validation](https://yup-docs.vercel.app/docs/intro)
- [**React** - Path To A Clean(er) React Architecture](https://profy.dev/article/react-architecture-api-client)
- [**Shared DTO** - Domain Entities & DTOs](https://profy.dev/article/react-architecture-domain-entities-and-dtos)
- [**Shared DTO** - A Guide to OpenAPI Code Generation for TypeScript](https://www.stefanwille.com/2021/05/2021-05-30-openapi-code-generator-for-typescript)
- [**Jest** - Jest with TypeScript and aliased imports (custom paths)](https://dev.to/mliakos/jest-with-typescript-and-aliased-imports-custom-paths-40d4)
- [**NestJS** - Best Way to Structure Your Directory/Code](https://medium.com/the-crowdlinker-chronicle/best-way-to-structure-your-directory-code-nestjs-a06c7a641401)
- [**React Query** - The Official React Query Course](https://query.gg/?s=dom)
- [**React Query** - Mastering Mutations in React Query](https://tkdodo.eu/blog/mastering-mutations-in-react-query)
- [**Microservices** - microservices.io](https://microservices.io/)
- [**Microservices** - NestJS REST API Gateway + gRPC microservices](https://github.com/benjsicam/nestjs-rest-microservices?tab=readme-ov-file)
- [**Microservices** - How to scale Docker Containers with Docker-Compose](https://brianchristner.io/how-to-scale-a-docker-container-with-docker-compose)
- [**Minikube** - Installing Minikube on Ubuntu 20.04 LTS](https://medium.com/@areesmoon/installing-minikube-on-ubuntu-20-04-lts-focal-fossa-b10fad9d0511)
- [**Minikube** - Setting up Minikube and Accessing Minikube Dashboard Remotely](https://medium.com/@areesmoon/setting-up-minikube-and-accessing-minikube-dashboard-09b42fa25fb6)
- [**API Gateway** - Build an API Gateway with NestJs](https://dev.to/thisdotmedia/build-an-api-gateway-with-nestjs-in-10-minutes-16db)
