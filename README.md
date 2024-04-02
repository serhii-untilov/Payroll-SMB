# Payroll SMB

- Payroll SMB application provides a **solution for employers and employees to calculate salary** and taxes based on laws for chosen country.
- Nest React application inside the Turbo mono-repository

## Start application

### Production mode

``` bash
npm i && npm run build && npm start
```

In Production mode frontend and backend applications works on the same port:

- Backend URL <http://localhost:3000/api>
- Frontend URL <http://localhost:3000>

### Development mode

``` bash
npm i && npm run dev
```

In Development mode frontend and backend applications works on the different ports:

- Backend URL <http://localhost:3000/api>
- Frontend URL <http://localhost:5173>

### By Docker

``` bash
# Build and start application
git clone https://github.com/serhii-untilov/Payroll.git
cd Payroll
docker compose build
docker compose up --detach
# Stop application
docker compose down
```

### By Docker Hub

``` bash
# Build application and push images to the Docker Hub
docker compose build
docker compose push
# Download docker compose script and containers
curl https://raw.githubusercontent.com/serhii-untilov/Payroll/master/docker-compose.yml >docker-compose.yml
docker compose pull
# Start containers
docker compose up --detach
# Stop containers
docker compose down
```

## Configuration

On a **production** server, copy .env.production file to .env.locale, replace environment variables in the .env.locale file and start the application.

In **development** mode:

- copy apps/api/.env to apps/api/.env.locale
- copy apps/web/.env.development to apps/web/.env.locale

replace environment variables in *.locale files and run the application.

## Domain-specific language (DSL)

| English               |Ukrainian              | Short form            | Description                                                                     |
|-----------------------|-----------------------|-----------------------|---------------------------------------------------------------------------------|
|Admin                  |Адміністратор          |admin                  |                                                                                 |
|User                   |Користувач             |user                   |                                                                                 |
|Owner                  |Власник                |owner                  |                                                                                 |
|Employer               |Роботодавець           |employer               |                                                                                 |
|Supervisor             |Керівник               |supervisor             |                                                                                 |
|Accountant             |Бухгалтер              |accountant             |                                                                                 |
|Collaborator           |Співробітник           |collaborator           |Помічник, асистент (assistant)                                                   |
|Employee               |Працівник              |employee               |Штатний працівник підприємства, співробітник                                     |
|Contractor             |Підрядник              |contractor             |Позаштатний працівник, тимчасовий, не постійний, на разову роботу                |
|Advisor                |Консультант            |advisor                |                                                                                 |
|Observer               |Спостерігач            |observer               |                                                                                 |
|Guest                  |Гість                  |guest                  |                                                                                 |
|Company                |Підприємство           |company                |                                                                                 |
|Tax ID                 |Податковий номер       |taxId                  |                                                                                 |
|Law                    |Законодавство          |law                    |                                                                                 |
|Accounting type        |Вид обліку             |accounting             |                                                                                 |
|Payment schedule       |Розклад виплат         |paymentSchedule        |Every 15th and last day of month, Last day of month, First day of the next month |
|Accounting period      |Обліковий період       |accPeriod              |Період за який нараховано  (1С)                                                  |
|Payment period         |Розрахунковий період   |payPeriod              |Період в якому розраховано (1С)                                                  |
|Check date             |Дата виплати           |checkDate              |                                                                                 |
|Position               |Штатна позиція         |position               |                                                                                 |
|Department             |Підрозділ              |department             |                                                                                 |
|Job                    |Посада                 |job                    |                                                                                 |
|Vacancy                |Вакансія               |vacancy                |                                                                                 |
|Working time norm      |Норма робочого часу    |workNorm               |                                                                                 |
|Working time calendar  |Виробничий календар    |workCalendar           |                                                                                 |
|Work Schedule          |Розклад роботи         |workSchedule           |                                                                                 |
|Work Sheet             |Табель робочого часу   |workSheet              |                                                                                 |
|Work Sheet             |Табель робочого часу   |workSheet              |                                                                                 |
|Incoming balance       |Вхідний залишок        |inBalance              |                                                                                 |
|Accrual                |Нарахування            |accrual                |                                                                                 |
|Deduction              |Утримання              |deduction              |                                                                                 |
|Tax                    |Податок                |tax                    |                                                                                 |
|Net pay                |До виплати             |netPay                 |                                                                                 |
|Payment                |Виплата                |payment                |                                                                                 |
|Outgoing balance       |Вихідний залишок       |outBalance             |                                                                                 |

## Development

### Initial script

``` bash
# Create project
mkdir nest-react
cd nest-react
npm install -D turbo
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

# Init "web" application for front-end
npm i --workspace @repo/web --save react-query
npm i --workspace @repo/web --save axios
npm i --workspace @repo/web --save react-router-dom
npm i --workspace @repo/web --save react-hook-form
npm i --workspace @repo/web --save @mui/material @emotion/react @emotion/styled
npm i --workspace @repo/web --save @fontsource/roboto
npm i --workspace @repo/web --save @mui/icons-material
npm i --workspace @repo/web --save @mui/x-data-grid
# npm i --workspace @repo/web --save @mui/x-date-pickers
# npm i --workspace @repo/web --save moment
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

# Init "shared" library for common types and interfaces
mkdir packages/shared
npm i --workspace @repo/shared --save sqlite3 ts-loader typeorm
npm i --workspace @repo/shared --save-dev ts-node typescript
npm i --workspace @repo/shared --save date-fns

# Init "utils" shared library for common functions
mkdir packages/utils
npm i --workspace @repo/shared --save ts-loader
npm i --workspace @repo/shared --save-dev ts-node typescript jest

```

### Nest JS

``` bash
# Create resources
npx --workspace @repo/api nest generate resource users resources
npx --workspace @repo/api nest generate resource laws resources
npx --workspace @repo/api nest generate resource accounting resources
npx --workspace @repo/api nest generate resource companies resources
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
