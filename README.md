# KYC Service Project

This is a NestJS project with PostgreSQL database integration. The project includes authentication using JWT, role-based access control, KYC management, and reporting.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- PostgreSQL running locally or on a remote server
- NestJS CLI (optional, can be used for development)

## Environment Variables

Make sure to create a `.env` file in the root directory of the project with the following environment variables:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=kycservicedb

JWT_SECRET=myjwtsecret123
JWT_EXPIRES=1d

- **DB_HOST**: The hostname or IP address of your PostgreSQL database.
- **DB_PORT**: The port your PostgreSQL is running on (default is 5432).
- **DB_USERNAME**: Username for your PostgreSQL database.
- **DB_PASSWORD**: Password for your PostgreSQL database.
- **DB_DATABASE**: The name of your database.
- **JWT_SECRET**: A secret key for signing JSON Web Tokens.
- **JWT_EXPIRES**: Token expiration time (e.g., 1d).

## Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2. Install the dependencies using `npm` or `yarn`:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3. Create and set up the PostgreSQL database as per the values in your `.env` file.

## Running the Application

### Development Mode

To run the project in development mode, use the following command:

```bash
npm run start:dev

The server will be available at http://localhost:3000.

Production Mode

For production, you can build the project and run it:

npm run build
npm run start

The server will be available at http://localhost:3000.

API Documentation

Once the server is running, you can access the Swagger documentation at:

http://localhost:3000/api/swagger

This will display all the available API endpoints with detailed information on each.

Postman Collection

https://drive.google.com/file/d/1P75gIfVhWbmwwunrD2ir4oPp2OW4RoHN/view?usp=drive_link

You can import the provided Postman collection to test the API:
	1.	Download the Postman collection JSON file.
	2.	Open Postman and click on “Import”.
	3.	Choose the downloaded file to add the collection to Postman.

Database Setup
	1.	Ensure PostgreSQL is installed and running on your machine or a remote server.
	2.	Use the .env configuration for the database connection.
	3.	The project will automatically attempt to connect to the database on startup and synchronize the schema.

Authentication

The API uses JWT for authentication. To obtain a token:
	1.	Make a POST request to http://localhost:3000/auth/login with the necessary credentials (username and password).
	2.	Use the JWT token returned in the response for subsequent requests that require authentication. Include it in the Authorization header as a Bearer token.

Useful Commands
	•	npm run start:dev: Start the project in development mode with live-reloading.
	•	npm run build: Build the project for production.
	•	npm run start: Start the project in production mode.
	•	npm run test: Run tests.

Troubleshooting

If you encounter issues with the database connection, ensure that the PostgreSQL service is running and the credentials in the .env file are correct. You can also check the NestJS logs for error details.