# Restaurant Management System

The Restaurant Management System is a robust and scalable application designed to streamline the operations of a restaurant. It is built on Node.js and uses Express for routing and middleware support.

The system is divided into three main components: Employees, Managers, and Schedules. Each component has its own set of RESTful API endpoints that allow for the creation, retrieval, updating, and deletion of data related to that component.

## Employees

Employees can login, view their profile, and update their profile. They can also view their schedule. Managers have the additional ability to view all employees, create, view and update profiles of any employee, and delete an employee.

## Managers

Managers can login, view, and update their own profile.

## Schedules

Managers can create, view a specific, update, and delete a schedule. Each schedule is associated with an employee.

The system uses request validation, authentication, and authorization. It ensures that only authenticated users can access certain routes and only managers can perform certain operations.

This Restaurant Management System is a comprehensive solution for managing restaurant operations, making it easier to manage employees and their schedules.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
- You have a Windows/Linux/Mac machine.
- Internet connection to get the data from cloud database.

## Setup

1. Open Command Prompt in project directory.
2. Run `npm install` to install the project dependencies.
3. Run `npm run preview` to start the server.
4. Navigate to `http://localhost:4173/`.

Note: Run `npm run dev` to start in development mode (restart automatically after changes made) at navigate to `http://localhost:5173/`