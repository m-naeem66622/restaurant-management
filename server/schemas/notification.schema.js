/* Based on the document, here is an explanation of the workflow and key entities in the Restaurant Employee Management System application:

Entities:
- Employees: Restaurant employees who can log into the system with unique credentials. They can view their profile and schedules.
- Management: Restaurant managers who have admin privileges to view all employee profiles and manage schedules.  

Workflow:
1. Employee login: Employees log into the system using unique username and password. This ensures only authorized employees can access their profile.

2. Employee profile: After login, employees can access an interactive profile interface to view their details.

3. Schedule management: Management has a privileged interface to manage employee schedules efficiently. They can assign weekly working hours for employees.

4. Email notifications: The system automatically sends email notifications to employees with their assigned weekly working hours. This facilitates communication. Emails are sent using Nodemailer package.

5. Input validation: All user inputs are validated to prevent unauthorized access or manipulation of data. Secure measures like encryption are implemented.

6. Error handling: Any errors are caught and informative messages are displayed to the user for feedback. Default error handling is also set up.

7. Frontend interface: The application has frontend pages built using React for login, profile viewing, schedule management etc. Management view for schedules is a privileged admin interface.

8. Backend API: Backend routes and APIs implemented using Node.js and Express handle application logic, database/file access, authentication, notifications and more.

So in summary - the main entities are employees, managers, schedules, notifications, data validation checks and frontend+backend architecture. Let me know if you need any clarification or have additional questions! */

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
