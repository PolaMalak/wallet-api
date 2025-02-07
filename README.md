## 🚀 Wallet System API

A wallet system API built with NestJS, Prisma, and SQLite.
This API allows users to create accounts, manage wallet balances, and track transaction history and secured with JWT authentication.
The project follows Domain-Driven Design principles and here it's structure

wallet-system/
├── src/
│ ├── auth/
│ │ ├── auth.module.ts
│ │ ├── auth.service.ts
│ │ ├── auth.controller.ts
│ │ ├── dto/
│ │ │ ├── index.ts
│ │ │ ├── login.dto.ts
│ │ │ ├── register.dto.ts
│ │ ├── strategies/
│ │ │ ├── jwt.strategy.ts
│ │ ├── guards/
│ │ │ ├── jwt-auth.guard.ts
│ ├── user/
│ │ ├── user.module.ts
│ │ ├── user.service.ts
│ │ ├── user.controller.ts
│ │ ├── test/
│ │ │ ├── user.service.spec.ts
│ │ ├── dto/
│ │ │ ├── index.ts
│ │ │ ├── create-user.dto.ts
│ │ ├── response/
│ │ │ ├── index.ts
│ │ │ ├── user.response.ts
│ ├── wallet/
│ │ ├── wallet.module.ts
│ │ ├── wallet.service.ts
│ │ ├── wallet.controller.ts
│ │ ├── test/
│ │ │ ├── wallet.service.spec.ts
│ │ ├── dto/
│ │ │ ├── index.ts
│ │ │ ├── top-up.dto.ts
│ │ │ ├── charge.dto.ts
│ │ ├── response/
│ │ │ ├── index.ts
│ │ │ ├── wallet.response.ts
│ ├── transaction/
│ │ ├── transaction.module.ts
│ │ ├── transaction.service.ts
│ │ ├── transaction.controller.ts
│ │ ├── decorator/
│ │ │ ├── two-decimals-max.decorator.ts
│ │ ├── test/
│ │ │ ├── transaction.service.spec.ts
│ │ ├── dto/
│ │ │ ├── index.ts
│ │ │ ├── create-transaction.dto.ts
│ │ ├── enum/
│ │ │ ├── index.ts
│ │ │ ├── transaction-type.enum.ts
│ ├── prisma/
│ │ ├── prisma.service.ts
│ │ ├── prisma.module.ts
│ ├── main.ts
├── prisma/
│ ├── schema.prisma
│ ├── migrations/
├── .env-example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── nest-cli.json
├── tsconfig.json

## 📌 Features

✅ User Authentication – Register and login using JWT authentication.
✅ Wallet Management – Top-up, charge and check wallet balance securely.
✅ Transaction History – View all past transactions for user's wallet.
✅ API Documentation – Swagger UI available for easy API exploration.

## Prerequisites

Before running the NestJS API, make sure you have the following prerequisites installed on your system:

- Node.js

- npm (Node Package Manager) or yarn

## 🛠️ Setup Instructions

1️⃣ Configuration

      The API can be configured using environment variables. Rename the .env.example file to .env and update the variables according to your needs. The configuration file should be placed in the root directory of the project.

2️⃣ Clone the Repository

      ```bash
      git clone https://github.com/PolaMalak/wallet-api.git
      cd wallet-api
      ```

3️⃣ Install Dependencies

      ```bash
      npm install
      ```

4️⃣ Set Up the Database

      -Run Prisma migrations:

      ```bash
      npm run prisma:migrate
      ```

      -Generate Prisma client:

      ```bash
      npm run prisma:generate
      ```

      -Run Prisma studio to explore the database:

      ```bash
      npm run prisma:studio
      ```

5️⃣ Start the Server

      ```bash
      npm run start:dev
      ```

6️⃣ To run tests

      ```bash
      npm run test
      ```

## 🌍 API Access

The API will be available at **http://localhost:3000**
Swagger API documentation is available at **http://localhost:3000/api**
OpenAPI specification JSON file for postman importing is available at **http://localhost:3000/api-json**

## API Examples

1. Create Top-up transaction
   **Endpoint**: `POST /transaction`
   **Request**:

```bash
curl -X POST http://localhost:3000/transaction \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
  "amount": 20,
  "type": "TOP_UP"
}'
```

**Response**:

```json
{
  "id": 3,
  "amount": 20,
  "type": "TOP_UP",
  "walletId": 1
}
```

2. Get wallet details
   **Endpoint**: `GET /wallet`
   **Request**:

```bash
curl -X GET http://localhost:3000/wallet \
-H "Authorization: Bearer <your_token>"
```

**Response**:

```json
{
  "id": 1,
  "userId": 1,
  "balance": 100
}
```
