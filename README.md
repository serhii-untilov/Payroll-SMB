# Nest React Application inside a Turbo mono repository

## Initial script

``` bash
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
npm i --workspace api --save @nestjs/serve-static
```

## Development mode

``` bash
npm run dev
```

In Development mode frontend and backend applications works on the different ports:

- Backend URL <http://localhost:3000/api>
- Frontend URL <http://localhost:5173>

## Production mode

``` bash
npm run build
npm start
```

In Production mode frontend and backend applications works on the same port:

- Backend URL <http://localhost:3000/api>
- Frontend URL <http://localhost:3000>

## References

- [**Web apps development methodology**: The Twelve-Factor App](https://12factor.net)
- [**Project architecture**: Bulletproof node.js project architecture](https://dev.to/santypk4/bulletproof-node-js-project-architecture-4epf)
- [**Nx**: Full Stack Development Series](https://thefullstack.engineer/full-stack-development-series-an-introduction/)
- [**Turborepo**: Add Turborepo to your existing monorepo](https://turbo.build/repo/docs/getting-started/existing-monorepo)
- [**NestJS**: Combine a NestJS app with React](https://youtu.be/nY0R7pslbCI?si=Lunb95j6enSY8GXE)
- [**Vite**: Server Proxy](https://vitejs.dev/config/server-options#server-proxy)
- [**NestJS**: Serve Static](https://docs.nestjs.com/recipes/serve-static)
- [**NestJS**: Crash Course: Everything you need to know! | NodeJS Tutorial 2023](https://youtu.be/2n3xS89TJMI?si=9EXCuQZD5xS6cZIW)