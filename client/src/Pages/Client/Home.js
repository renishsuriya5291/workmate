// src/Pages/Home.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import withAuthRedirect from "../../Components/withAuthRedirect";
import Button from "../../Components/Button";
import Modal from "../../Components/Modal";
import Input from "../../Components/Input";
import axios from "axios";
import { addjob, addAllJobs, addAllPropsal } from "../../react-redux/store";
import toast, { Toaster } from "react-hot-toast";
import { useLocation } from "react-router-dom";

import JobPage from "../../Components/JobPage";

const CHome = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/job`);
        if (response.status === 200) {
          dispatch(addAllJobs(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProposals = async () => {
      setLoading(true); // Optional: You might want to set loading here too
      try {
        const response = await axios.get("/api/proposal/all");
        if (response.status === 200) {
          dispatch(addAllPropsal(response.data));
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    const fetchData = async () => {
      await fetchJobs();
      await fetchProposals(); // Ensure you're calling the correct function
    };

    fetchData();
  }, [dispatch, location.pathname]);

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
  const [cjob, setCjob] = useState(initialState);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();

    // Validate the project fields
    if (!cjob.title) {
      toast.error("Title is required!");
      return;
    }
    if (!cjob.description) {
      toast.error("Description is required!");
      return;
    }
    if (!cjob.category) {
      toast.error("Category is required!");
      return;
    }
    if (cjob.budget < 0) {
      toast.error("Budget is required and must be greater than zero!");
      return;
    }
    if (!cjob.connectsRequired || cjob.connectsRequired <= 0) {
      toast.error(
        "Connects Required is required and must be greater than zero!"
      );
      return;
    }
    if (!cjob.skills || cjob.skills.length === 0) {
      toast.error("At least one skill is required!");
      return;
    }
    setLoading(true);

    try {
      // Prepare project data to send to the API
      const jobData = {
        title: cjob.title,
        description: cjob.description,
        category: cjob.category,
        budget: cjob.budget,
        connectsRequired: cjob.connectsRequired,
        skills: cjob.skills, // Convert skills from comma-separated string to array
        paymentType: cjob.paymentType, // Ensure paymentType is included if necessary
        paymentSchedule: cjob.paymentSchedule, // Ensure paymentSchedule is included if necessary
        location: cjob.location || null, // Set to null if not provided
        privacy: cjob.privacy, // Ensure privacy is included
      };

      // Send a POST request to create the project
      const response = await axios.post("/api/job/add", jobData);

      if (response.status === 201) {
        toast.success("Job created successfully!");
        setCjob(initialState);
        handleCloseModal();
        dispatch(addjob(response.data));
      } else {
        toast.error("Failed to create Job. Please try again.");
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.details?.[0] ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error while submitting the Job:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleJobChange = (e) => {
    const { name, value } = e.target;
    setCjob((prevCjob) => ({
      ...prevCjob,
      [name]: value,
    }));
  };

  const [inputValue, setInputValue] = useState("");

  const handleDelete = (skillToDelete) => {
    setCjob((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  const handleAddTag = () => {
    if (inputValue.trim() && !cjob.skills.includes(inputValue.trim())) {
      setCjob((prev) => ({
        ...prev,
        skills: [...prev.skills, inputValue.trim()],
      }));
      setInputValue(""); // Clear input after adding
    }
  };

  return (
    <div className="">
      <Toaster />
      <div className="min-h-screen bg-white pt-11 pb-3 px-2 lg:px-24">
        <div className="container mx-auto">
          <header className=" flex flex-col sm:flex-row max-sm:gap-3 sm:justify-between items-center ">
            <div className="flex flex-col">
              <span className="font-semibold text-2xl lg:text-2xl">
                Your Dashboard
              </span>
              <span className="text-md max-sm:text-center text-gray-500">
                {`${
                  user.username.charAt(0).toUpperCase() + user.username.slice(1)
                }'s Enterprices`}
              </span>
            </div>
            <div className="">
              <Button variant="black" onClick={handleOpenModal}>
                Post a Job
              </Button>
            </div>
          </header>
        </div>

        <div className="container mx-auto rounded-xl mt-7 border border-gray-200">
          <main className="sm:pb-8 flex flex-col border-b p-4 md:p-6 lg:p-8 border-gray-200">
            <div className="flex w-full justify-between">
              <span className="text-xl font-semibold cursor-pointer">
                Your Postings
              </span>
              <span className="text-gray-400 hover:text-gray-800 hover:underline transition-colors duration-300 cursor-pointer">
                See all postings
              </span>
            </div>
            {/* */}

            <JobPage>
              <button
                className="px-11 py-3 rounded-full text-white bg-black"
                onClick={handleOpenModal}
              >
                Post a Job
              </button>
            </JobPage>
          </main>
        </div>

        {/* //modals  */}

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="relative max-w-3xl w-full mx-auto p-6 overflow-y-auto max-h-[75vh] rounded-lg shadow-lg bg-white border border-gray-300 z-10">
            <div className="">
              <h1 className="text-2xl text-center sm:text-3xl font-semibold mb-8 sm:mb-11">
                Post Job
              </h1>
              <div className="">
                <div className="">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="mb-4 flex-1">
                      <label
                        className="block text-left mb-2"
                        htmlFor="job-title"
                      >
                        Job Title
                      </label>
                      <Input
                        id="job-title"
                        name="title"
                        type="text"
                        value={cjob.title}
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
                        value={cjob.category}
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
                      value={cjob.description}
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
                        value={cjob.connectsRequired}
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
                        value={cjob.budget}
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
                            value={cjob.paymentType}
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
                            value={cjob.paymentSchedule}
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
                        value={cjob.location}
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
                            name="paymentSchedule"
                            value={cjob.privacy}
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
                      {cjob.skills.map((skill, index) => (
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
                        setCjob(initialState);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="black" onClick={handleSubmitJob}>
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default withAuthRedirect(CHome);
