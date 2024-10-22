// src/Pages/FContact.js
import React, { useState } from "react";
import axios from "axios"; // Make sure to import axios
import withAuthRedirect from "../../Components/withAuthRedirect";

function FContact() {
  const [files, setFiles] = useState([]); // State to hold the selected files
  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  // Handle the file selection
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to an array
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Accumulate files in state
  };

  // Handle the file upload
  const handleFileUpload = async () => {
    if (files.length === 0) {
      setError("No files selected");
      return; // Exit if no files are selected
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // Append each file to FormData
    });

    try {
      const response = await axios.post("/api/proposal/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success response
      console.log("Files uploaded successfully:", response.data);
      setSuccess("Files uploaded successfully!");
      setFiles([]); // Clear the selected files after upload
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("File upload failed. Please try again."); // Show error message
    }
  };

  return (
    <div>
      <button onClick={handleFileUpload}>Upload</button>{" "}
      {/* Button to trigger upload */}
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
      {/* Error message */}
      {success && <div style={{ color: "green" }}>{success}</div>}{" "}
      {/* Success message */}
      {files.length > 0 && (
        <div>
          <h4>Selected Files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default withAuthRedirect(FContact);
