# Nest React Application inside a Turbo mono-repository

## Initial script

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

# Init "web" application for front-end
npm i --workspace @repo/web --save react-query
npm i --workspace @repo/web --save axios
npm i --workspace @repo/web --save react-router-dom
npm i --workspace @repo/web --save react-hook-form
npm i --workspace @repo/web --save @mui/material @emotion/react @emotion/styled
npm i --workspace @repo/web --save @fontsource/roboto
npm i --workspace @repo/web --save @mui/icons-material
npm i --workspace @repo/web --save @mui/x-data-grid
npm i --workspace @repo/web --save @mui/x-date-pickers
npm i --workspace @repo/web --save notistack

# Init "shared" library
mkdir packages/shared
npm i --workspace @repo/shared --save sqlite3 ts-loader typeorm
npm i --workspace @repo/shared --save-dev ts-node typescript
```

## Development

``` bash
npm run dev
```

In Development mode frontend and backend applications works on the different ports:

- Backend URL <http://localhost:3000/api>
- Frontend URL <http://localhost:5173>

## Production

``` bash
npm run build
npm start
```

In Production mode frontend and backend applications works on the same port:

- Backend URL <http://localhost:3000/api>
- Frontend URL <http://localhost:3000>

## Docker

``` bash
# Build and start application
npm run build
docker compose build
docker compose up --detach
# Stop application
docker compose down
```

## Docker Hub

``` bash
# Build application and push images to the Docker Hub
npm run build
docker compose push
# Download docker compose script and run docker containers
curl https://raw.githubusercontent.com/serhii-untilov/nest-react/master/docker-compose.yml >docker-compose.yml
docker compose up --detach
```

## Nest JS

``` bash
# Create resources
npx --workspace @repo/api nest generate resource users resources
npx --workspace @repo/api nest generate resource laws resources
npx --workspace @repo/api nest g module auth
npx --workspace @repo/api nest g controller auth
npx --workspace @repo/api nest g service auth
```

## TypeORM

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

## JWT

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
