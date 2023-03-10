require("dotenv").config();
const mongoose = require("mongoose");

/* Check if the password is given */
if (process.argv.length < 3) {
  console.error("Usage: node cli.js password [name] [number]");
  console.error("Error: Must provide password");
  process.exit(1);
}

if (process.argv.length > 5) {
  console.error("Usage: node cli.js password [name] [number]");
  process.exit(1);
}

/* Validate the input when the name and number have been provided */
if (process.argv.length === 5) {
  if (process.argv[3].length > 30 || process.argv[3].length < 3) {
    console.error("Error: Name length out of scope");
    process.exit(1);
  }

  if (process.argv[4].length > 15 || process.argv[4].length < 3) {
    console.error("Error: Number length out of scope");
    process.exit(1);
  }

  if (!/^\p{L}+(\s\p{L}+)*$/u.test(process.argv[3])) {
    console.error("Error: Invalid name");
    process.exit(1);
  }

  if (!/^\d+(?:-\d+)?$/.test(process.argv[4])) {
    console.error("Error: Invalid number");
    process.exit(1);
  }
}

/* Check if the connection string is present */
if (!process.env.DATABASE_URI) {
  console.error("Error: Database URI must be provided in ENV");
  process.exit(1);
}

/* Configure mongodb and connect */
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE_URI.replace(/password/g, process.argv[2]))
  .catch((error) =>
    console.error("Error: Failure in establishing a connection to MongoDB")
  );

/* Model collection */
const Peeps = mongoose.model(
  "Peeps",
  new mongoose.Schema({
    id: String,
    name: String,
    number: String,
  })
);

/* List the entire phonebook */
if (process.argv.length === 3) {
  Peeps.find().then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => console.log(`${person.name} ${person.number}`));
    mongoose.connection.close();
  });
} else {
  /* Create new person in phonebook */
  new Peeps({
    name: process.argv[3],
    number: process.argv[4],
  })
    .save()
    .then((result) => {
      console.log(`Added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close();
    });
}
