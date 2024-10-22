import React, { useState, useEffect } from "react";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  Clock,
  Lock,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Input from "./Input";
import Button from "./Button";
import Modal from "./Modal";
import axios from "axios";
import { formatDate } from "../utils/DateFormat";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllJobs,
  deleteJob,
  updateJob,
  addAllPropsal,
} from "../react-redux/store";
import { Link } from "react-router-dom";

function JobPage({ children }) {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Track current page
  const jobsPerPage = 2; // Number of jobs per page
  const dispatch = useDispatch();
  const { jobs, proposals } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isopen1, setIsopen1] = useState(false);

  const initialState = {
    title: "",
    description: "",
    category: "",
    skills: [],
    connectsRequired: 4,
    paymentType: "fixed",
    paymentSchedule: "upon_completion",
    location: "",
    privacy: "public",
    budget: 0,
  };
  const [ujob, setUjob] = useState(initialState);

  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setUjob((prevCjob) => ({
      ...prevCjob,
      [name]: value,
    }));
  };

  const ho = (job, status) => {
    setUjob({
      _id: job._id,
      title: job.title || "",
      description: job.description || "",
      category: job.category || "",
      skills: job.skills || [],
      connectsRequired: job.connectsRequired || 4,
      paymentType: job.paymentType || "fixed",
      paymentSchedule: job.paymentSchedule || "upon_completion",
      location: job.location || "",
      privacy: job.privacy || "public",
      budget: job.budget || 0,
      status: status,
    });
    setIsopen1(true);
  };
  const cancelJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`/api/job/cancel/${ujob._id}`, {
        status: ujob.status,
      });
      console.log(response);
      if (response.status === 200) {
        toast.success(`Job ${ujob.status} successfully!`);
        setUjob(initialState);
        cm();
        dispatch(updateJob(response.data.job));
      } else {
        toast.error("Failed to delete Job. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete Job. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const [inputValue, setInputValue] = useState("");

  const handleDelete = (skillToDelete) => {
    setUjob((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  const handleAddTag = () => {
    if (inputValue.trim() && !ujob.skills.includes(inputValue.trim())) {
      setUjob((prev) => ({
        ...prev,
        skills: [...prev.skills, inputValue.trim()],
      }));
      setInputValue(""); // Clear input after adding
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  const handleOpenModal = (job) => {
    setUjob({
      _id: job._id,
      title: job.title || "",
      description: job.description || "",
      category: job.category || "",
      skills: job.skills || [],
      connectsRequired: job.connectsRequired || 4,
      paymentType: job.paymentType || "fixed",
      paymentSchedule: job.paymentSchedule || "upon_completion",
      location: job.location || "",
      privacy: job.privacy || "public",
      budget: job.budget || 0,
    });
    setIsModalOpen(true); // Open the modal
  };
  const cm = () => {
    setUjob(initialState);
    setIsopen1(false);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate the project fields
    if (!ujob.title) {
      toast.error("Title is required!");
      return;
    }
    if (!ujob.description) {
      toast.error("Description is required!");
      return;
    }
    if (!ujob.category) {
      toast.error("Category is required!");
      return;
    }
    if (ujob.budget < 0) {
      toast.error("Budget is required and must be greater than zero!");
      return;
    }
    if (!ujob.connectsRequired || ujob.connectsRequired <= 0) {
      toast.error(
        "Connects Required is required and must be greater than zero!"
      );
      return;
    }
    if (!ujob.skills || ujob.skills.length === 0) {
      toast.error("At least one skill is required!");
      return;
    }
    setLoading(true);

    try {
      const jobData = {
        title: ujob.title,
        description: ujob.description,
        category: ujob.category,
        budget: ujob.budget,
        connectsRequired: ujob.connectsRequired,
        skills: ujob.skills, // Convert skills from comma-separated string to array
        paymentType: ujob.paymentType, // Ensure paymentType is included if necessary
        paymentSchedule: ujob.paymentSchedule, // Ensure paymentSchedule is included if necessary
        location: ujob.location || null, // Set to null if not provided
        privacy: ujob.privacy, // Ensure privacy is included
      };
      const response = await axios.put(`/api/job/update/${ujob._id}`, jobData);
      if (response.status === 200) {
        toast.success("Job updated successfully!");
        setUjob(initialState);
        handleCloseModal();
        dispatch(updateJob(response.data.job));
      } else {
        toast.error("Failed to create Job. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.details?.[0] ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error while submitting the Job:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate the jobs to display for the current page
  const startIndex = currentPage * jobsPerPage;
  const displayedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  // Calculate total pages
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Toaster />
      {jobs.length === 0 && !loading ? (
        <div className="w-full mt-6">
          <div className="">
            <div className="w-full flex justify-center items-center mb-3">
              <img src="/flieImage.png" alt="" className="object-cover h-40" />
            </div>
            <div className="flex flex-col justify-center items-center gap-1">
              <span className="text-md font-semibold">No Active job posts</span>
              <span className="text-sm text-gray-500 text-center">
                Post job to the marketplace and let talent come to you
              </span>
            </div>
            <div className="w-full flex justify-center items-center mt-8">
              {children}
            </div>
          </div>
        </div>
      ) : (
        displayedJobs.map((job) => (
          <div className="w-full mt-6" key={job.id}>
            <div className="border border-gray-200 p-6 rounded-lg">
              <div className="flex text-lg justify-between font-semibold items-center">
                <div className="flex flex-col gap-1">
                  <span>{job.title}</span>
                  <span className="text-sm text-gray-500 font-light">
                    {`Posted on ${formatDate(job.createdAt)}`}
                  </span>
                </div>
                <span className="px-3 py-1 text-white bg-black rounded-full flex items-center justify-center text-sm cursor-pointer">
                  {job.status}
                </span>
              </div>
              <div className="w-full mt-6">
                <span className="text-gray-600 text-md">{job.description}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-5 border-b border-gray-200 pb-4">
                {job?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 text-sm rounded-full text-black border border-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="w-full mt-4 flex justify-between pb-4 border-b border-gray-200">
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex gap-1">
                    <div className="flex gap-2 items-center">
                      <DollarSign className="h-5 text-gray-500" />
                      <span className="font-semibold">Budget:</span>
                    </div>
                    <span className="text-md">{`$ ${job.budget}`}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex gap-2 items-center">
                      <Briefcase className="h-5 text-gray-500" />
                      <span className="font-semibold">Category:</span>
                    </div>
                    <span className="text-md">{job?.category}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex gap-2 items-center">
                      <MapPin className="h-5 text-gray-500" />
                      <span className="font-semibold">Location:</span>
                    </div>
                    <span className="text-md">{job.location}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex gap-1">
                    <div className="flex gap-2 items-center">
                      <Users className="h-5 text-gray-500" />
                      <span className="font-semibold">Connects Required:</span>
                    </div>
                    <span className="text-md">{job.connectsRequired}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex gap-2 items-center">
                      <Clock className="h-5 text-gray-500" />
                      <span className="font-semibold">Payment:</span>
                    </div>
                    <span className="text-md">{`${job.paymentType}, ${job?.paymentSchedule}`}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex gap-2 items-center">
                      <Lock className="h-5 text-gray-500" />
                      <span className="font-semibold">Privacy:</span>
                    </div>
                    <span className="text-md">{job.privacy}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <Button
                  variant="gray"
                  className="flex gap-2"
                  onClick={() => handleOpenModal(job)}
                >
                  <Edit className="h-5" />
                  <span>Edit Job</span>
                </Button>
                <Button variant="gray" className="flex gap-2">
                  <Eye className="h-5" />
                  <Link to={`/client/home/${job._id}`}>
                    View Proposals (
                    {
                      proposals.filter((proposal) => proposal.job === job._id)
                        .length
                    }
                    )
                  </Link>
                </Button>
                {job.status === "closed" && (
                  <Button variant="gray" onClick={() => ho(job, "open")}>
                    Open Job
                  </Button>
                )}
                {job.status !== "closed" && (
                  <Button variant="gray" onClick={() => ho(job, "closed")}>
                    Close Job
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      {loading && <div>Loading...</div>}
      {jobs.length !== 0 && (
        <div className="flex justify-center mt-6 gap-3 items-center">
          <ChevronLeft
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 0}
            className="hover:underline cursor-pointer h-5 hover:text-gray-500"
          />

          <div className="text-gray-500">{`${
            currentPage + 1
          } out of ${totalPages}`}</div>
          <ChevronRight
            onClick={() => handlePageChange("next")}
            disabled={currentPage >= totalPages - 1}
            className="hover:underline hover:text-gray-500 cursor-pointer h-5 "
          />
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="relative max-w-3xl w-full mx-auto p-6 overflow-y-auto max-h-[75vh] rounded-lg shadow-lg bg-white border border-gray-300 z-10">
          <div className="">
            <h1 className="text-2xl text-center sm:text-3xl font-semibold mb-8 sm:mb-11">
              Edit Job
            </h1>
            <div className="">
              <div className="">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="mb-4 flex-1">
                    <label className="block text-left mb-2" htmlFor="job-title">
                      Job Title
                    </label>
                    <Input
                      id="job-title"
                      name="title"
                      type="text"
                      value={ujob.title}
                      onChange={handleJobChange}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      placeholder="Enter job title"
                      required
                    />
                  </div>
                  <div className="mb-4 flex-1">
                    <label
                      className="block text-left mb-2"
                      htmlFor="job-category"
                    >
                      Job Category
                    </label>
                    <Input
                      id="job-category"
                      name="category"
                      type="text"
                      value={ujob.category}
                      onChange={handleJobChange}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      placeholder="Enter job category"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-left mb-2"
                    htmlFor="job-description"
                  >
                    Job Description
                  </label>
                  <textarea
                    id="job-description"
                    name="description"
                    value={ujob.description}
                    onChange={handleJobChange}
                    className="border border-gray-300 p-2 w-full rounded-md"
                    placeholder="Enter job description"
                    rows="4"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="mb-4 flex-1">
                    <label
                      className="block text-left mb-2"
                      htmlFor="job-connectsRequired"
                    >
                      Required Connects
                    </label>
                    <Input
                      type="number"
                      id="job-connectsRequired"
                      name="connectsRequired"
                      value={ujob.connectsRequired}
                      onChange={handleJobChange}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      placeholder="Enter job required connects"
                    />
                  </div>
                  <div className="mb-4 flex-1">
                    <label
                      className="block text-left mb-2"
                      htmlFor="job-budget"
                    >
                      Job Budget
                    </label>
                    <Input
                      type="number"
                      id="job-budget"
                      name="budget" // Corrected name from connectsRequired to budget
                      value={ujob.budget}
                      onChange={handleJobChange}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      placeholder="Enter job budget"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="mb-4 flex-1">
                    <div className="relative">
                      <label
                        className="block text-left mb-2"
                        htmlFor="job-paymentType"
                      >
                        Payment Type
                      </label>
                      <div className="relative">
                        <select
                          id="job-paymentType"
                          name="paymentType"
                          value={ujob.paymentType}
                          onChange={handleJobChange}
                          className="border border-gray-300 p-2 w-full rounded-md appearance-none pr-10" // Add pr-10 for padding
                          required
                        >
                          <option value="hourly">Hourly</option>
                          <option value="fixed">Fixed</option>
                        </select>
                        <span className="absolute right-3 top-3 pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 flex-1">
                    <div className="relative">
                      <label
                        className="block text-left mb-2"
                        htmlFor="job-paymentSchedule"
                      >
                        Payment Schedule
                      </label>
                      <div className="relative">
                        <select
                          id="job-paymentSchedule"
                          name="paymentSchedule"
                          value={ujob.paymentSchedule}
                          onChange={handleJobChange}
                          className="border border-gray-300 p-2 w-full rounded-md appearance-none pr-10" // Add pr-10 for padding
                          required
                        >
                          <option value="upon_completion">
                            upon_completion
                          </option>
                          <option value="weekly">weekly</option>
                          <option value="monthly">monthly</option>
                        </select>
                        <span className="absolute right-3 top-3 pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="mb-4 flex-1">
                    <label
                      className="block text-left mb-2"
                      htmlFor="job-location"
                    >
                      Job Location
                    </label>
                    <Input
                      id="job-location"
                      name="location"
                      type="text"
                      value={ujob.location}
                      onChange={handleJobChange}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      placeholder="Enter job location"
                    />
                  </div>
                  <div className="mb-4 flex-1">
                    <div className="relative">
                      <label
                        className="block text-left mb-2"
                        htmlFor="job-privacy"
                      >
                        Job Privacy
                      </label>
                      <div className="relative">
                        <select
                          id="job-privacy"
                          name="privacy"
                          value={ujob.privacy}
                          onChange={handleJobChange}
                          className="border border-gray-300 p-2 w-full rounded-md appearance-none pr-10" // Add pr-10 for padding
                        >
                          <option value="public">public</option>
                          <option value="private">private</option>
                        </select>
                        <span className="absolute right-3 top-3 pointer-events-none">
                          <svg
                            className="h-4 w-4 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4 ">
                  <h2>Skills</h2>
                  <div className="mt-2 flex gap-3">
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md w-full sm:w-[50%]"
                      placeholder="Add a skill and press Enter"
                    />
                    <Button
                      variant="black"
                      type="button"
                      onClick={handleAddTag}
                    >
                      Add Tag
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {ujob.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 rounded-lg px-3 py-2 flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => handleDelete(skill)}
                          className="ml-2 text-gray-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleCloseModal();
                      setUjob(initialState);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="black" onClick={handleUpdate}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isopen1} onClose={cm}>
        <div className="relative max-w-lg w-full mx-auto p-6 overflow-y-auto max-h-[75vh] rounded-lg shadow-lg bg-white border border-gray-300 z-10">
          <h1 className="text-2xl text-center sm:text-3xl font-semibold mb-5">
            Are You Sure?
          </h1>
          <p className="text-center mb-6">
            {`Please confirm this job to be ${
              ujob.status !== "open" ? "closed" : "opened"
            }.`}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={cm} // Just close the modal
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={cancelJob}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

export default JobPage;
