# Restaurant Management System

The Restaurant Management System is a robust and scalable application designed to streamline the operations of a restaurant. It is built on Node.js and uses Express for routing and middleware support.

The system is divided into three main components: Employees, Managers, and Schedules. Each component has its own set of RESTful API endpoints that allow for the creation, retrieval, updating, and deletion of data related to that component.

## Employees

Employees can register, login, view their profile, and update their profile. They can also view their schedule. Managers have the additional ability to view all employees, view and update profiles of any employee, and delete an employee.

## Managers

Managers can register, login, view, and update their own profile. They also have the ability to delete their profile.

## Schedules

Managers can create, view all, view a specific, update, and delete a schedule. Each schedule is associated with an employee.

The system uses middleware for request validation, authentication, and authorization. It ensures that only authenticated users can access certain routes and only managers can perform certain operations.

This Restaurant Management System is a comprehensive solution for managing restaurant operations, making it easier to manage employees and their schedules.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
- You have a Windows/Linux/Mac machine.
- Internet connection to connect to the cloud database.

## Setup

1. Update .env file with your own Secret Key to generate and validate JWT Tokens (optional).
2. Create an account on [Ethereal Email](https://ethereal.email/) to get nodemailer configuration.
3. Update `/helpers/nodemailer.helper.js` with the received configuration.
4. Open Command Prompt in project directory.
5. Run `npm install` to install the project dependencies.
6. Run `npm start` to start the server.
7. API routes can be accessed at `http://localhost:5000`.

Note: Run `npm run dev` to start in development mode (restart automatically after changes made)


## Routes

### Employee Routes

- `POST /register`: Register a new employee. Requires manager authentication.
- `POST /login`: Login an employee.
- `GET /`: Get all employees. Requires manager authentication.
- `GET /profile`: Get the profile of the authenticated employee.
- `GET /schedule`: Get the schedule of the authenticated employee.
- `GET /schedule/:employeeId`: Get the schedule of a specific employee. Requires manager authentication.
- `GET /:employeeId`: Get the profile of a specific employee. Requires manager authentication.
- `PATCH /profile`: Update the profile of the authenticated employee.
- `PATCH /:employeeId`: Update the profile of a specific employee. Requires manager authentication.
- `DELETE /:employeeId`: Delete a specific employee. Requires manager authentication.

### Manager Routes

- `POST /register`: Register a new manager. Requires manager authentication.
- `POST /login`: Login a manager.
- `GET /profile`: Get the profile of the authenticated manager.
- `PATCH /profile`: Update the profile of the authenticated manager.
- `DELETE /profile`: Delete the profile of the authenticated manager.

### Schedule Routes

- `POST /`: Create a new schedule. Requires manager authentication.
- `GET /`: Get all schedules. Requires manager authentication.
- `GET /:scheduleId`: Get a specific schedule. Requires manager authentication.
- `PATCH /:scheduleId`: Update a specific schedule. Requires manager authentication.
- `DELETE /:scheduleId`: Delete a specific schedule. Requires manager authentication.

## Usage

To test the API routes using Postman:

1. Open Postman.
2. Set the HTTP method (GET, POST, PUT, DELETE) and enter the URL for the desired route.
3. Add any required headers or parameters.
4. Click the "Send" button to send the request.
5. View the response in the Postman interface.

For example, to test the GET route for retrieving all employees, set the method to GET and the URL to `http://localhost:5000/api/employees?page=1&limit=10` with manager token

Note: Make sure the server is running (`npm start`) before sending requests.
