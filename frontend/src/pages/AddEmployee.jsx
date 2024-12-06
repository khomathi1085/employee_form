import React from "react";
import axios from "axios";
import EmployeeForm from "../components/EmployeeForm";
import "./addEmployee.css";

const AddEmployee = () => {
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/add-employee", values);
      alert(response.data);
    } catch (error) {
      alert(error.response.data || "An error occurred");
    }
  };

  return (
    <div className="add-employee-container">
      <div className="form">
        <EmployeeForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddEmployee;
