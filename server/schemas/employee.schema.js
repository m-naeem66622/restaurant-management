const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { possiblePositions } = require("../validators/employee.validator");

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, uppercase: true, trim: true, required: true },
    lastName: { type: String, uppercase: true, trim: true, required: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: { type: String, required: true },
    position: {
      type: String,
      uppercase: true,
      trim: true,
      enum: possiblePositions,
      required: true,
    },
    contactNumber: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

  next();
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
