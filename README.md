# Foodie ERP

## About
Foodie ERP is an enterprise resource planning software for small, pre-launch food producers.

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/beneloe/foodie-erp.git
    cd foodie-erp
    ```
2. Install dependencies:
    ```sh
    npm install
    cd frontend
    npm install
    cd ..
    ```
3. Create an `.env` file in the root directory and the `/backend` directory and add the following:
    ```env
    DB_USER=admin
    DB_PASS=admin
    DB_NAME=foodie
    DB_HOST=localhost
    DB_PORT=5432
    JWT_SECRET=<jwt-secret>
    ```
4. Install PostgreSQL: https://www.postgresql.org/download/
5. Use the terminal to set up the PostgreSQL database:
    ```sql
    psql -U postgres
    CREATE DATABASE foodie;
    CREATE USER admin WITH ENCRYPTED PASSWORD 'admin';
    GRANT ALL PRIVILEGES ON DATABASE foodie TO admin;
    ```
6. Run the `setup.sql` script to create the database schema:
    ```sh
    psql -U admin -d foodie -f scripts/setup.sql
    ```
7. Run the `seed.sql` script to create sample database entries:
    ```sh
    psql -U admin -d foodie -f scripts/seed.sql
    ```

## Start the App

### Run Backend
Start backend:
```sh
npm run start:backend
```

### Run Frontend
Start frontend:
```sh
npm run start:frontend
```

### Run Backend & Frontend
Start backend and frontend:
```sh
npm start
```

### Open the Browser
http://localhost:3000

## Testing the App

### Test Backend
Run backend test:
```sh
cd backend
npm test tests/*.test.js
```

### Test Frontend
Run frontend test:
```sh
cd frontend
npm test
```
