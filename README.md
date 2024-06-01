# Foodie ERP

## About
Foodie ERP is an enterprise resource planning software for small, pre-launch food producers.

## Installation
1. Clone the repository:
    ```
    git clone https://github.com/beneloe/foodie-erp.git
    cd foodie-erp
    ````
2. Install dependencies:
    ```
    npm install
    cd frontend
    npm install
    cd ..
    ````
3. Create an `.env` file in the root directory and add the following:
    ```env
    DB_USER=admin
    DB_PASS=admin
    DB_NAME=foodie
    DB_HOST=localhost
    DB_PORT=5432
    ````
4. Install PostgreSQL: https://www.postgresql.org/download/
5. Use the terminal to set up the PostgreSQL database:
    ```
    psql -U postgres
    CREATE DATABASE foodie;
    CREATE USER admin WITH ENCRYPTED PASSWORD 'admin';
    GRANT ALL PRIVILEGES ON DATABASE foodie TO admin;
    ````

## Start the App

### Run Backend

Start backend: `npm run start:backend`

### Run Frontend

Start frontend: `npm run start:frontend`

### Run Backend & Frontend

Start backend and frontend: `npm start`

### Open the Browser

http://localhost:3000

## Testing the App

### Test Backend

Run backend test: `cd backend && npm test`

### Test Frontend

Run fronted test: `cd frontend && npm test`
