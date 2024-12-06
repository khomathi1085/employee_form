import express from "express";
import bodyParser from "body-parser";
import mysql2 from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit if connection fails
  }
  console.log("Connected to database");
});

// Employee API
app.post("/add-employee", (req, res) => {
  const { name, employeeId, email, phone, department, dateOfJoining, role } = req.body;

  // Validation
  if (!name || !employeeId || !email || !phone || !department || !dateOfJoining || !role) {
    return res.status(400).send("All fields are required");
  }

  const checkQuery = "SELECT * FROM employee_table WHERE employeeId = ? OR email = ?";
  db.query(checkQuery, [employeeId, email], (err, result) => {
    if (err) {
      console.error("Error during query execution:", err);
      return res.status(500).send("Internal server error");
    }

    if (result.length > 0) {
      return res.status(400).send("Employee ID or Email already exists");
    }

    const insertQuery = "INSERT INTO employee_table SET ?";
    const values = { name, employeeId, email, phone, department, dateOfJoining, role };

    db.query(insertQuery, values, (err) => {
      if (err) {
        console.error("Error during insertion:", err);
        return res.status(500).send("Internal server error");
      }
      res.status(201).send("Employee added successfully");
    });
  });
});

// Start Server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
