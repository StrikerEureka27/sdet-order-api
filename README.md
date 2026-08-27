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

Install Serverless and Lambda types

```bash
npm install -D serverless @types/aws-lambda
```

serverless docs: https://www.serverless.com/framework/docs

create lambda handler using serverless framework

create serverless.yml
```bash
touch serverless.yml
```

Serverless print
```bash
npx serverless print
```

> Serverless print shows the compiled configuration of the service.

Serverless package
```bash
npx serverless package
```

> Serverless package creates a deployment package of your service for deployment.


AWS configuration and dependencies

base dependencies
```bash
npm install @aws-sdk/client-eventbridge
mkdir -p src/events
touch src/events/eventbridge.ts
```

How it works

1. The `createOrder` handler creates an order and publishes an EventBridge event
2. The event is sent to the default EventBridge bus
3. The event can be consumed by other services via EventBridge rules
4. Be sure IAM permissions are configured correctly for EventBridge access

Updated serverless stage to perform:

```bash
npx serverless deploy --stage "dev | staging | prod"
```


