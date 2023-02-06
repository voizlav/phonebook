require("dotenv").config();
const mongoose = require("mongoose");

/* Check if the password is given */
if (!process.argv.length === 3 || !process.argv.length === 5) {
  console.error("Usage: node cli.js password [name] [number]");
  process.exit(1);
}

/* Validate the input when the name and number have been provided */
if (process.argv.length === 5) {
  if (process.argv[3].length > 30 || process.argv[3].length < 3) {
    console.error("Name length out of scope");
    process.exit(1);
  }

  if (process.argv[4].length > 15 || process.argv[4].length < 3) {
    console.error("Number length out of scope");
    process.exit(1);
  }

  if (!/^\p{L}+(\s\p{L}+)*$/u.test(process.argv[3])) {
    console.error("Invalid name");
    process.exit(1);
  }

  if (!/^\d+(?:-\d+)?$/.test(process.argv[4])) {
    console.error("Invalid number");
    process.exit(1);
  }
}

/* Check if the connection string is present */
if (!process.env.DATABASE_URI) {
  console.error("A database URI must be provided in ENV");
  process.exit(1);
}

/* Configure mongodb and connect */
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.URI.replace(/password/g, process.argv[2]))
  .catch((error) =>
    console.error("Failure in establishing a connection to MongoDB")
  );
