require("dotenv").config();
const mongoose = require("mongoose");

/* Check if the password is given */
if (!process.argv.length === 3 || !process.argv.length === 5) {
  console.error("Usage: node cli.js password [name] [number]");
  process.exit(1);
}
