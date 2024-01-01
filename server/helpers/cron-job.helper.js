const cron = require("node-cron");
const Schedule = require("../schemas/schedule.schema"); // Assuming you have a Schedule model
const sendMail = require("./nodemailer.helper");

function scheduleFormatter(object) {
  const {
    employee,
    weekStartDate,
    weekEndDate,
    monHrs,
    tuesHrs,
    wedHrs,
    thursHrs,
    friHrs,
    satHrs,
    sunHrs,
  } = object;

  const formattedStartDate = new Date(weekStartDate).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const formattedEndDate = new Date(weekEndDate).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const formattedSchedule = `
        <div>
            <h2>${employee.firstName} ${employee.lastName}'s Schedule</h2>
            <p><strong>Week Start Date:</strong> ${formattedStartDate}</p>
            <p><strong>Week End Date:</strong> ${formattedEndDate}</p>
            <table>
                <tr>
                    <th>Day</th>
                    <th>Hours</th>
                </tr>
                <tr>
                    <td>Monday</td>
                    <td>${monHrs}</td>
                </tr>
                <tr>
                    <td>Tuesday</td>
                    <td>${tuesHrs}</td>
                </tr>
                <tr>
                    <td>Wednesday</td>
                    <td>${wedHrs}</td>
                </tr>
                <tr>
                    <td>Thursday</td>
                    <td>${thursHrs}</td>
                </tr>
                <tr>
                    <td>Friday</td>
                    <td>${friHrs}</td>
                </tr>
                <tr>
                    <td>Saturday</td>
                    <td>${satHrs}</td>
                </tr>
                <tr>
                    <td>Sunday</td>
                    <td>${sunHrs}</td>
                </tr>
            </table>
        </div>
    `;

  return formattedSchedule;
}

// Function to fetch schedules from the database and send emails
async function sendSchedulesToEmployees() {
  try {
    console.log("Getting schedules from the database...");
    // Fetch all schedules from the database
    const schedules = await Schedule.find().populate(
      "employee",
      "firstName lastName email"
    );

    console.log("Schedules:", schedules.length);
    console.log("Sending emails to employees...");

    // Iterate over each schedule and send email to the corresponding employee
    for (const schedule of schedules) {
      const employeeEmail = schedule.employee.email;
      await sendMail(
        employeeEmail,
        "Your Weekly Schedule",
        scheduleFormatter(schedule)
      );
    }

    console.log("Emails sent successfully!");
  } catch (error) {
    console.error("Error sending emails:", error);
  }
}

function startCronJob() {
  // Schedule the function to run every Monday at 00:00
  cron.schedule("0 0 * * MON", sendSchedulesToEmployees);
  // Schedule the function to run every minute (assuming you want to test it)
  // cron.schedule("* * * * *", sendSchedulesToEmployees);
}

module.exports = startCronJob;
