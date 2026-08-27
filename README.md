# sdet-order-api
TypeScript serverless service

### Initialize npm project

```bash
npm init -y
```

### Install TypeScript and basic dev tooling

```bash
npm install -D typescript tsx @types/node
```

### Initialize TypeScript

```bash
npx tsc --init
```

### Create source and test directories

```bash
mkdir -p src/handlers tests
touch src/handlers/create-order.ts
touch src/app.ts
touch tests/create-order.test.ts
```

### Install Express and related dependencies

```bash
npm install express
npm install -D @types/express
```

Then update `tsconfig.json`.


Then create a `src/server.ts` file to start the server.

```bash
touch src/server.ts
```

### Update package.json scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```


### API tests with Vitest + Supertest

```bash
npm install -D vitest supertest @types/supertest
```

Update package.json scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```


