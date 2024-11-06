import React, { useEffect, useState } from "react";
import { Heart, MapPin, Clock, BarChart, FolderIcon, X } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";
import Input from "./Input";
import axios from "axios"; // Ensure axios is imported
import { Image as ImageIcon, FileText, File } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addPropsal,
  updateProposal,
  removeProposal,
} from "../react-redux/store";
import { Link } from "react-router-dom";

const JobCard = ({ job, handleLike, calculateTimeAgo }) => {
  const dispatch = useDispatch();

  const { user, proposals, contracts } = useSelector((state) => state.auth);
  const [ajob, setAjob] = useState({
    jobId: "",
    _id: "",
    amount: 0,
    description: "",
    estimatedDuration: "",
    attachments: [],
  });

  const handleProposal = async (proposal) => {
    try {
      const response = await axios.delete(
        `/api/proposal/delete/${proposal._id}`
      );

      if (response.status === 200) {
        // Dispatch action to remove the proposal from the Redux store
        dispatch(removeProposal(proposal));
        toast.success("Proposal deleted successfully!");
      } else {
        toast.error("Failed to delete the proposal. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
      toast.error("An error occurred while deleting the proposal.");
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);

  const renderFileIcon = (file) => {
    const fileType = file?.type?.split("/")[0];

    switch (fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6 text-blue-500" />;
      case "application":
        if (file.type === "application/pdf") {
          return <FileText className="h-6 w-6 text-red-500" />;
        }
        return <File className="h-6 w-6 text-gray-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const modalOpen = (job, proposal = null) => {
    if (proposal) {
      setAjob({
        jobId: proposal.job._id,
        _id: proposal._id,
        amount: proposal.amount,
        description: proposal.description,
        estimatedDuration: proposal.estimatedDuration,
        attachments: proposal.attachments || [],
      });
      setEditMode(true);
    } else {
      setAjob((state) => ({ ...state, jobId: job._id }));
      setEditMode(false);
    }
    setIsOpen(true);
  };

  const modalClose = () => {
    setIsOpen(false);
    setFiles([]);
    setError("");
    setSuccess("");
    setAjob({
      amount: 0,
      description: "",
      estimatedDuration: "",
      attachments: [],
      jobId: "",
      _id: "",
    }); // Reset ajob state
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((state) => [...state, ...selectedFiles]);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAjob((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      setError("No files selected");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("/api/proposal/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.imageUrls;
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("File upload failed. Please try again."); // Use toast for error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const estimatedDuration = ajob.estimatedDuration.trim();
    if (!estimatedDuration) {
      toast.error("Estimated duration is required.");
      return;
    }

    const durationRegex = /^(1|2|3|4)\s*(week|month)(s)?$/i;
    if (!durationRegex.test(estimatedDuration)) {
      toast.error(
        "Estimated duration must be between 1 week and 4 weeks, or 1 month and 4 months."
      );
      return;
    }

    if (!ajob.description) {
      toast.error("Proposal description is required.");
      return;
    }

    let uploadedFilesData = [];

    try {
      // Only call handleFileUpload if there are files to upload
      if (files && files.length > 0) {
        uploadedFilesData = await handleFileUpload();
      }

      let proposal = {
        amount: ajob.amount,
        description: ajob.description,
        estimatedDuration: ajob.estimatedDuration,
        attachments: uploadedFilesData,
      };

      let response;
      if (editMode) {
        // Update proposal if in edit mode
        response = await axios.put(
          `/api/proposal/update/${ajob.jobId}/${ajob._id}`,
          proposal
        );
      } else {
        // Create new proposal
        response = await axios.post(
          `/api/proposal/create/${ajob.jobId}`,
          proposal
        );
      }

      if (editMode) {
        // Dispatch update action
        dispatch(updateProposal(response.data));
        toast.success("Proposal updated successfully!");
        setEditMode(false);
      } else {
        // Dispatch add action
        dispatch(addPropsal(response.data));
        toast.success("Proposal submitted successfully!");
      }
      modalClose();
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast.error("Failed to submit proposal. Please try again.");
    }
  };

  return (
    <div className="">
      <Toaster />
      <div className="border rounded-md p-6 bg-white">
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-xl font-semibold hover:underline cursor-pointer">
                {job.title}
              </span>
              <span>
                <span className="text-[15px] text-gray-600">
                  {`${job.paymentType} - Est. Budget: $${job.budget}${
                    job.paymentType === "hourly" ? "/hr" : ""
                  }`}
                </span>
              </span>
            </div>
            <div className="flex gap-2 ">
              {proposals?.some((proposal) => proposal.job === job._id) ? (
                <>
                  {/* Find the specific proposal for the job */}
                  {proposals?.map((proposal) => {
                    if (
                      proposal.job === job._id &&
                      proposal.freelancer === user._id
                    ) {
                      return (
                        <span key={proposal._id} className="">
                          <span className="px-3 rounded-full bg-gray-200 text-gray-500 text-sm">
                            {proposal.status}
                          </span>

                          {/* Display the status of the proposal */}
                        </span>
                      );
                    }
                    return null; // Return null if the job doesn't match
                  })}
                </>
              ) : (
                <span></span> // Message if no proposals exist for the job
              )}

              <Heart
                fill={
                  user?.likedJobs?.includes(job._id) ? "true" : "transparent"
                }
                className="h-5 text-gray-500 cursor-pointer"
                onClick={() => handleLike(job)}
              />
            </div>
          </div>
          <div className="text-gray-500 mt-8">{job.description}</div>
          <div className="flex flex-wrap mt-5 gap-2">
            {job?.skills?.map((skill) => (
              <span
                key={skill}
                className="text-gray-500 border px-3 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between mt-5 gap-4">
            <div className="flex flex-col sm:flex-row sm:gap-6 w-full">
              <span className="flex gap-1 items-center">
                <MapPin className="h-5 text-gray-500" />
                <span className="text-gray-500 text-sm">{job.location}</span>
              </span>
              <span className="flex gap-1 items-center">
                <Clock className="h-5 text-gray-500" />
                <span className="text-gray-500 text-sm">{`Posted ${calculateTimeAgo(
                  job.createdAt
                )}`}</span>
              </span>
              <span className="flex gap-1 items-center">
                <BarChart className="h-5 text-gray-500" />
                <span className="text-gray-500 text-sm">
                  {proposals?.filter((proposal) => proposal.job === job._id)
                    .length || 0}{" "}
                  proposals
                </span>
              </span>
              <span className="flex gap-1 items-center">
                <FolderIcon className="h-5 text-gray-500" />
                <span className="text-gray-500 text-sm">{job.category}</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-2">
              {proposals?.some((proposal) => proposal.job === job._id) ? (
                <span className="flex gap-3">
                  {proposals.map((proposal) => {
                    // Check if the proposal is from the freelancer for this job and isn't accepted
                    if (
                      proposal.job === job._id &&
                      proposal.freelancer === user._id
                    ) {
                      if (proposal.status !== "accepted") {
                        // Display the Update and Cancel buttons if the proposal isn't accepted
                        return (
                          <span
                            key={proposal._id}
                            className="flex items-center gap-3"
                          >
                            <Button
                              variant="ghost"
                              onClick={() => modalOpen(job, proposal)}
                            >
                              Update
                            </Button>
                            <Button
                              variant="black"
                              className="text-gray-500"
                              onClick={() => handleProposal(proposal)}
                            >
                              Cancel
                            </Button>
                          </span>
                        );
                      } else {
                        // If the proposal is accepted, show the View button (link to contract)
                        const contract = contracts.find(
                          (contract) => contract.job._id === job._id
                        );

                        return contract ? (
                          <Link
                            to={`/freelancer/contract/${contract._id}`}
                            key={proposal._id}
                          >
                            <Button variant="black">View</Button>
                          </Link>
                        ) : null;
                      }
                    }
                    return null; // Return null if the proposal doesn't match
                  })}
                </span>
              ) : (
                <Button variant="black" onClick={() => modalOpen(job)}>
                  Apply
                </Button>
              )}
            </div>
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={modalClose}>
          <div className="max-w-xl w-full mx-auto p-6 overflow-y-auto max-h-[75vh] rounded-lg shadow-lg bg-white border border-gray-300 z-10">
            <h1 className="text-2xl text-center sm:text-3xl font-semibold mb-8 sm:mb-11">
              {editMode ? "Edit Job Proposal" : "Add Job Proposal"}
            </h1>
            <div>
              <div className="mb-4">
                <label
                  className="block text-left mb-2"
                  htmlFor="proposed-amount"
                >
                  Proposed Amount
                </label>
                <Input
                  id="proposed-amount"
                  name="amount"
                  type="number"
                  value={ajob.amount}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter proposed amount"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-left mb-2"
                  htmlFor="proposal-description"
                >
                  Proposal Description
                </label>
                <textarea
                  id="proposal-description"
                  name="description"
                  value={ajob.description}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter Proposal description"
                  required
                  disabled={editMode} // Disable if in edit mode
                />
              </div>
              <div className="mb-4">
                <label className="block text-left mb-2" htmlFor="file-upload">
                  Attach Files
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,.pdf"
                  onChange={handleFileChange}
                  multiple
                  className="hidden" // Hide the default input
                />

                <div className="flex items-center justify-between border border-dashed border-gray-400 rounded-md p-4 cursor-pointer">
                  <span className="text-gray-600">
                    {files.length === 0
                      ? "Drag & drop files here or click to select"
                      : "Files selected"}
                  </span>
                  <Button
                    variant="black"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    disabled={editMode}
                  >
                    Browse
                  </Button>
                </div>

                {(files.length > 0 || ajob.attachments.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {/* Show new uploaded files */}
                    {files?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 p-2 rounded-md shadow-sm"
                      >
                        {renderFileIcon(file)}
                        <span className="ml-2 text-gray-700 truncate w-14">
                          {file.name}
                        </span>
                        <X
                          className="ml-2 text-gray-500 h-4 cursor-pointer"
                          onClick={() =>
                            setFiles(files.filter((_, i) => i !== index))
                          }
                        />
                      </div>
                    ))}
                    {/* Show previously uploaded files */}
                    {ajob?.attachments?.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 p-2 rounded-md shadow-sm"
                      >
                        {renderFileIcon({ name: attachment })}{" "}
                        {/* Assuming attachment is a string path */}
                        <span className="ml-2 text-gray-700 truncate w-14">
                          {attachment}
                        </span>
                        {/* Optionally provide a delete button for previously uploaded files */}
                        <X
                          className="ml-2 text-gray-500 h-4 cursor-pointer"
                          onClick={() => {
                            // Logic to remove the attachment from ajob and possibly update the server
                            const updatedAttachments =
                              ajob?.attachments?.filter((_, i) => i !== index);
                            setAjob((prev) => ({
                              ...prev,
                              attachments: updatedAttachments,
                            }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>}
              </div>

              <div className="mb-4">
                <label
                  className="block text-left mb-2"
                  htmlFor="proposed-duration"
                >
                  Estimated Duration
                </label>
                <Input
                  id="proposed-duration"
                  name="estimatedDuration"
                  type="text"
                  value={ajob.estimatedDuration}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter estimated duration"
                  required
                  disabled={editMode} // Disable if in edit mode
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="submit"
                  variant="ghost"
                  className=" flex justify-center"
                  onClick={handleSubmit}
                >
                  {editMode ? "Update" : "Apply"}
                </Button>
                <Button
                  variant="black"
                  className="text-gray-500"
                  onClick={modalClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default JobCard;
