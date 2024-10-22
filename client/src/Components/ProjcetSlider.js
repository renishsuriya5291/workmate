import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllProjects,
  deleteAll,
  deleteProject,
  updateProject,
} from "../react-redux/store";
import { X, Plus } from "lucide-react";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import toast, { Toaster } from "react-hot-toast";

const ProjcetSlider = ({ children }) => {
  const { projects } = useSelector((state) => state.auth.proflie);
  const [loading, setLoading] = useState(true); // State for loading
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [flie, setFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [selectProject, setSelectProject] = useState({
    _id: "",
    title: "",
    description: "",
    image: "",
    role: "",
    technologies: [],
    liveLink: "",
  });
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // State to track the current page
  const itemsPerPage = 2; // Limit of items per page (set to 2)
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/project"); // Make API call to fetch projects
        dispatch(addAllProjects(response.data.projects));
        setLoading(false); // Set projects state with the retrieved data
      } catch (err) {
        dispatch(deleteAll());
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [dispatch]);

  const totalPages = Math.ceil(projects.length / itemsPerPage); // Calculate total pages
  const currentProjects = projects.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  ); // Get current projects for the current page

  const handleAddTag = () => {
    if (
      tagInput.trim() &&
      !selectProject.technologies.includes(tagInput.trim())
    ) {
      setSelectProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tagInput.trim()],
      }));
      setTagInput(""); // Clear input after adding
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setSelectProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setLoader(true);
    // Validate the project fields
    if (!selectProject.title) {
      toast.error("Title is required!");
      return;
    }
    if (!selectProject.description) {
      toast.error("Description is required!");
      return;
    }
    if (!selectProject.role) {
      toast.error("Role is required!");
      return;
    }
    if (
      !selectProject.technologies ||
      selectProject.technologies.length === 0
    ) {
      toast.error("At least one technology is required!");
      return;
    }

    let uploadedFileUrl = "";

    if (flie) {
      try {
        // Upload the file first if selected
        uploadedFileUrl = await handleFileUpload(flie, "project");
      } catch (error) {
        const errorMessage =
          error.response?.data?.details?.[0] ||
          "An error occurred while uploading the file. Please try again.";
        toast.error(errorMessage);
        return; // Return early on file upload failure
      } finally {
        setLoader(false);
      }
    }

    // Prepare project data to send to the API
    const projectData = {
      title: selectProject.title,
      description: selectProject.description,
      image: uploadedFileUrl || selectProject.image, // Use the uploaded file URL or an empty string if no file was uploaded
      role: selectProject.role,
      technologies: selectProject.technologies,
      liveLink: selectProject.liveLink || "", // Set to empty string if not provided
    };

    try {
      // Send a POST request to create or update the project
      const response = await axios.put(
        `/api/project/update/${selectProject._id}`,
        projectData
      );

      if (response.status === 200) {
        toast.success("Project updated successfully!");
        setSelectedImage1("");
        setFile(null);
        closeModal();
        // console.log(response.data.project);
        dispatch(updateProject(response.data.project));
      } else {
        toast.error("Failed to update project. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error while submitting the project:", errorMessage);
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `/api/project/delete/${selectProject._id}`
      );
      if (response.status === 200) {
        toast.success("Project Deleted successfully!");
        dispatch(deleteProject(response.data.project));
        setSelectedImage1("");
        closeModal();
        console.log(response.data.project);
      } else {
        toast.error("Failed to update project. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage1(reader.result);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectProject((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = async (file, name) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoader(true);

    try {
      const response = await axios.post("/api/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-File-Name": name,
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed"); // Handle error as needed
    } finally {
      setLoader(false);
    }
  };

  const openModal = (project) => {
    setSelectProject(project);
    setModal(true);
    setSelectedImage1(project.image);
  };

  const closeModal = () => {
    setModal(false);
  };

  if (loading) {
    return (
      <div className="flex overflow-x-auto ">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 border border-dotted border-gray-400 rounded-lg shadow-md p-4 mx-2 w-60 h-52 animate-pulse"
          ></div> // Show skeletons while loading
        ))}
      </div>
    ); // Show loading state
  }

  return (
    <div>
      <Toaster />
      <div className="flex md:flex-row flex-col  py-2 mt-6 gap-5 md:justify-start">
        {children}
        {currentProjects.map((card) => (
          <div key={card._id} className="">
            <div
              // Make sure to use the correct unique identifier
              className="bg-white rounded-lg shadow-md p-4 w-60 h-52 mx-2 flex items-end" // Added margin for spacing
              style={{
                backgroundImage: `url(${card.image})`, // Use the image URL from the project
                backgroundSize: "cover", // Cover the entire card
                backgroundPosition: "center", // Center the background image
                color: "white", // Text color to ensure visibility
              }}
              onClick={() => openModal(card)}
            ></div>
            <h2 className="px-4 mt-3 text-lg text-gray-400 hover:underline cursor-pointer font-semibold">
              {card.title}
            </h2>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div
        className={`flex justify-center ${
          currentProjects.length === 0 ? "hidden" : ""
        } mt-4 items-center`}
      >
        {/* Left Arrow */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`mx-2 px-4 py-2 rounded ${
            currentPage === 0
              ? " text-gray-400 cursor-not-allowed"
              : " text-black"
          }`}
        >
          <ChevronLeft
            className={`h-6 w-6 ${
              currentPage === 0 ? "text-gray-400" : "text-black"
            }`}
          />
        </button>

        {/* Current Page Indicator */}
        <span className="mx-2 text-gray-300">
          Page {currentPage + 1} of {totalPages == 0 ? 1 : totalPages}
        </span>

        {/* Right Arrow */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`mx-2 px-4 py-2 rounded ${
            currentPage === totalPages - 1
              ? " text-gray-400 cursor-not-allowed"
              : " text-black"
          }`}
        >
          <ChevronRight
            className={`h-6 w-6 ${
              currentPage === totalPages - 1 ? "text-gray-400" : "text-black"
            }`}
          />
        </button>
      </div>
      <Modal isOpen={modal} onClose={closeModal}>
        <div className="relative mt-10 overflow-y-scroll max-h-[80vh] max-w-3xl w-full mx-auto p-5 rounded-lg shadow-md bg-white border border-gray-200 z-10">
          <div className="">
            <h1 className="text-3xl text-center font-semibold mb-4">
              Edit Project
            </h1>

            <form>
              <div className="flex flex-col gap-2">
                <label htmlFor="title">Project Title</label>
                <Input
                  name="title"
                  type="text"
                  default
                  value={selectProject.title}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter the project title"
                />
              </div>
              <div className="flex justify-evenly gap-3 mt-6">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="role">Your role</label>
                  <Input
                    name="role"
                    type="text"
                    value={selectProject.role}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full rounded-md"
                    placeholder="eg.,front-end engineer"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="liveLink">Project Live Link</label>
                  <Input
                    name="liveLink"
                    type="text"
                    value={selectProject.liveLink}
                    onChange={handleInputChange}
                    className="border border-gray-300 p-2 w-full rounded-md"
                    placeholder="eg., http://example.in"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="w-full overflow-hidden    rounded-md border-dotted border-2 mt-6 h-40 flex justify-center items-center">
                {!selectedImage1 && (
                  <>
                    <div
                      className="flex flex-col justify-center items-center"
                      onClick={() =>
                        document.getElementById("projectId").click()
                      }
                    >
                      <Plus className="text-gray-300 text-center" size={40} />
                      <span className="text-gray-300">
                        Upload Project Photo
                      </span>
                    </div>
                  </>
                )}
                {selectedImage1 && (
                  <>
                    <img
                      src={selectedImage1}
                      alt=""
                      className="w-full object-cover "
                      onClick={() =>
                        document.getElementById("projectId").click()
                      }
                    />
                  </>
                )}
                <input
                  type="file"
                  name="project"
                  id="projectId"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Tags Section */}

              {/* Project Description */}
              <div className="flex w-full mt-4 flex-col">
                <label
                  htmlFor="textarea"
                  className="mb-2 text-lg font-semibold"
                >
                  Project Description:
                </label>
                <textarea
                  id="textarea"
                  name="description"
                  value={selectProject.description}
                  onChange={handleInputChange}
                  className="h-32 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="Briefly describe the project's goals, your solutions, and the impact you made here..."
                />
              </div>

              <div className="flex flex-col mt-6">
                <label htmlFor="tags" className="mb-2 text-lg font-semibold">
                  Project Tags:
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="Enter the tag content"
                  />
                  <Button variant="black" type="button" onClick={handleAddTag}>
                    Add Tag
                  </Button>
                </div>

                {/* Display Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectProject.technologies.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md flex items-center"
                    >
                      {tag}

                      <X
                        className="ml-2 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                        size={15}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Form Buttons */}
              <div className="flex justify-end mt-4 gap-3">
                <Button variant="ghost" onClick={handleDelete}>
                  Delete
                </Button>
                <Button variant="black" onClick={handleSubmitProject}>
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default ProjcetSlider;
