import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import withAuthRedirect from "../../Components/withAuthRedirect";
import { X } from "lucide-react";
import axios from "axios";
import Button from "../../Components/Button";
import { Edit, Plus } from "lucide-react";
import Modal from "../../Components/Modal";
import Input from "../../Components/Input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast, { Toaster } from "react-hot-toast";
import ProjcetSlider from "../../Components/ProjcetSlider";
import { addProject, setImage, setUserItem } from "../../react-redux/store";
import WorkHistory from "../../Components/WorkHistory";
import Skills from "../../Components/Skills";

function EditProfile() {
  const { user } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modals, setModals] = useState({
    hourlyRate: false,
    location: false,
    country: false,
    bioTitle: false,
    project: false,
    avatar: false,
    name: false,
    experience: false,
  });
  const [name, setName] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  });
  const [formData, setFormData] = useState({
    hourlyRate: user.hourlyRate || "",
    location: user.location || "",
    country: user.country || "",
    bioTitle: user.bioTitle || "",
    experience: user.experience || "",
  });
  const dispatch = useDispatch();
  const [showMore, setShowMore] = useState(false);
  const [bioContent, setBioContent] = useState(user.bio || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const bioRef = useRef(null);

  const [flie1, setFile1] = useState(null);
  const [flie2, setFile2] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const initialProjectState = {
    title: "",
    description: "",
    image: "",
    role: "",
    technologies: [],
    liveLink: "",
  };
  const [project, setProject] = useState(initialProjectState);

  const toggleShowMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };
  useEffect(() => {
    const element = bioRef.current;
    if (element) {
      const isContentOverflowing = element.scrollHeight > element.clientHeight;
      setIsOverflowing(isContentOverflowing);
    }
  }, [bioContent, showMore]);

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validate the project fields
    if (!project.title) {
      toast.error("Title is required!");
      return;
    }
    if (!project.description) {
      toast.error("Description is required!");
      return;
    }
    if (!project.role) {
      toast.error("Role is required!");
      return;
    }
    if (!project.technologies || project.technologies.length === 0) {
      toast.error("At least one technology is required!");
      return;
    }
    if (flie2) {
      try {
        // Upload the file first
        const uploadedFileUrl = await handleFileUpload(flie2, "project"); // Await the file upload

        // Prepare project data to send to the API
        const projectData = {
          title: project.title,
          description: project.description,
          image: uploadedFileUrl, // Use the uploaded file URL
          role: project.role,
          technologies: project.technologies,
          liveLink: project.liveLink, // Set to null if not provided
        };

        // Send a POST request to create the project
        const response = await axios.post("/api/project/add", projectData);

        if (response.status === 201) {
          toast.success("Project created successfully!");
          setProject(initialProjectState);
          setSelectedImage1("");
          setFile2(null);
          closeModal("project");
          dispatch(addProject(response.data.project));
        } else {
          toast.error("Failed to create project. Please try again.");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.details?.[0] ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
        console.error("Error while submitting the project:", errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please upload a file!");
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !project.technologies.includes(tagInput.trim())) {
      setProject((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tagInput.trim()],
      }));
      setTagInput(""); // Clear input after adding
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (name !== "project")
          setSelectedImage(reader.result); // Update the image preview
        else setSelectedImage1(reader.result);
      };
      reader.readAsDataURL(file);
      if (name !== "project") setFile1(file);
      else if (name === "project") setFile2(file);
    }
  };

  // Handle the file upload
  const handleFileUpload = async (file, name) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await axios.post("/api/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-File-Name": name,
        },
      });
      if (name === "profile") {
        dispatch(setImage(response.data.imageUrl));
        setFile1(null);
        setSelectedImage("");
      }
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed"); // Handle error as needed
    } finally {
      setLoading(false);
    }
  };

  // Handle modal open/close
  const openModal = (modalName) => {
    setModals((prevState) => ({ ...prevState, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals((prevState) => ({ ...prevState, [modalName]: false }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setName((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProject((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // General handleSave function for API calls
  const handleSave = (fields) => {
    // Validation for each field
    const emptyFields = Object.keys(fields).filter((field) => !fields[field]);
    if (emptyFields.length > 0) {
      toast.error(`${emptyFields.join(", ")} cannot be empty!`);
      return; // Exit if validation fails
    }

    setLoading(true);
    axios
      .put(`/api/user/update`, {
        // Spread the fields object to send both fields to the backend
        ...fields,
      })
      .then((response) => {
        console.log(`User updated successfully`, response.data);
        toast.success("Profile Updated!");
        // Optionally update the Redux store or local state with new data
        console.log("first");
        dispatch(setUserItem(response.data.data));
      })
      .catch((error) => {
        toast.error(error?.response?.data?.msg);
        console.log(error);
        console.error(`Error updating user`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveBio = () => {
    // Save bioContent to the server
    setLoading(true);
    axios
      .put(`/api/user/update`, { bio: bioContent })
      .then((response) => {
        console.log("Bio updated successfully", response.data.data);
        toast.success("Profile Updated!");
        dispatch(setUserItem(response.data.data));
        setIsEditing(false);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-white pt-11 pb-6 px-2 lg:px-14">
        <div className="container mx-auto rounded-xl border border-gray-200">
          {/* first section */}
          <header className="pb-8 border-b p-4 md:p-6 lg:p-8 border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user?.profilePicture}
                    alt="Profile"
                    className="h-16 w-16 md:h-20 md:w-20 object-cover border-2 border-grary-200 rounded-full cursor-pointer"
                    onClick={() => openModal("avatar")}
                  />

                  <div
                    className="absolute bottom-1 right-1 bg-gray-300 rounded-full p-1 cursor-pointer"
                    onClick={() => openModal("avatar")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M7 13.536V17h3.464l9.768-9.768a2.5 2.5 0 00-3.536-3.536L7 13.536z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl md:text-3xl font-semibold ">
                      {`${user.firstName} ${user.lastName}`}
                    </div>
                    <Edit size={20} onClick={() => openModal("name")} />
                  </div>
                  <div className="flex gap-1 items-center">
                    <img
                      src="/location.svg"
                      alt="Location"
                      className="h-5 md:h-6"
                    />
                    {user.location && user.location.length !== 0 && (
                      <p>{user.location}</p>
                    )}
                    {!user.location && (
                      <>
                        <p
                          className="cursor-pointer"
                          onClick={() => openModal("location")}
                        >
                          Add location
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Button variant="black">Show Public View</Button>
              </div>
            </div>
          </header>

          {/* second section */}
          <main className="w-full flex flex-col md:flex-row">
            <section className="w-full md:w-[30%]  h-full p-4 ">
              <div className="bg-gray-100 p-5 flex flex-col gap-4 rounded-lg">
                <span className="font-semibold text-lg">{`Connects: ${
                  user?.connects || 0
                }`}</span>
                <span className="underline cursor-pointer">View details</span>
              </div>

              {user.role === "freelancer" && (
                <div className="p-5 pt-8 flex flex-row justify-between items-center border-b border-gray-200">
                  <div className="">
                    <div className="font-semibold text-lg">Rate Per Hour</div>
                    <div className="">{`$ ${user.hourlyRate || 0}`}</div>
                  </div>
                  <Edit
                    className="h-4 w-4 mr-2 cursor-pointer"
                    onClick={() => openModal("hourlyRate")}
                  />
                </div>
              )}
              <div className="p-5 border-b ">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold">Experience</span>
                    <span>{user.experience}</span>
                  </div>
                  <Edit
                    className="h-4 w-4 mr-2 cursor-pointer"
                    onClick={() => openModal("experience")}
                  />
                </div>
              </div>
              <div className="p-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold">Location</span>
                    {user.location && user.location.length !== 0 && (
                      <p>{user.location}</p>
                    )}
                    {!user.location && (
                      <>
                        <p>Add location</p>
                      </>
                    )}
                  </div>
                  <Edit
                    className="h-4 w-4 mr-2 cursor-pointer"
                    onClick={() => openModal("location")}
                  />
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <span className="text-lg font-semibold">Country</span>
                    <span>{user.country}</span>
                  </div>
                  <Edit
                    className="h-4 w-4 mr-2 cursor-pointer"
                    onClick={() => openModal("country")}
                  />
                </div>
              </div>
            </section>

            <section className="w-full md:w-[70%] border-l border-gray-200">
              {/* first section */}
              <section className="p-4 md:p-8 border-b border-gray-200">
                <div className="flex gap-3 items-center">
                  {user.bioTitle && (
                    <div className="text-xl md:text-2xl font-semibold">
                      {user.bioTitle}
                    </div>
                  )}
                  {!user.bioTitle && (
                    <div className="text-xl md:text-2xl font-semibold">
                      Add Title
                    </div>
                  )}
                  <Edit
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => openModal("bioTitle")}
                  />
                </div>
                <div className={`relative flex flex-col items-start`}>
                  {isEditing ? (
                    <>
                      <ReactQuill
                        theme="snow"
                        className="w-full mt-4" // Full width editor
                        value={bioContent}
                        onChange={setBioContent} // Update state on change
                      />
                      <div className="mt-4 self-end flex gap-3">
                        {/* Place buttons at the bottom */}
                        <Button variant="ghost" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button variant="black" onClick={handleSaveBio}>
                          Save
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex justify-between items-start mt-4">
                      {/* Flex layout for non-edit mode */}
                      <div
                        ref={bioRef}
                        className={`transition-all duration-300 ${
                          showMore
                            ? "max-h-full"
                            : "max-h-[200px] overflow-hidden  line-clamp-3 "
                        }`}
                      >
                        {bioContent.trim() ? (
                          <div
                            // className={`w-full ${
                            //   //
                            // }`}
                            className="w-full"
                            dangerouslySetInnerHTML={{ __html: bioContent }}
                          />
                        ) : (
                          <p className="text-gray-500 italic">
                            No bio available. Please add one.
                          </p>
                        )}
                      </div>

                      {/* Edit icon with fixed width */}
                      <div className="w-8 flex justify-center items-center">
                        <Edit
                          className="h-6 w-6 cursor-pointer" // Ensure the icon itself has consistent size
                          onClick={handleEditClick}
                        />
                      </div>
                    </div>
                  )}
                  {!isEditing &&
                    isOverflowing && ( // Show the "Show More" button only if content overflows
                      <button
                        className="text-gray-500 mt-2 underline"
                        onClick={toggleShowMore}
                      >
                        {showMore ? "Show Less" : "Show More"}
                      </button>
                    )}
                </div>
              </section>

              {/* section second */}
              {user.role === "freelancer" && (
                <section className="p-4 md:p-8 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl md:text-2xl font-semibold">
                      Portfolio
                    </span>
                  </div>
                  <ProjcetSlider>
                    <div className="flex">
                      <div className="bg-white  border border-dotted border-gray-300 rounded-lg shadow-md py-4  w-60 h-52 flex flex-col items-center">
                        <div
                          className="text-gray-300 h-full flex justify-center flex-col items-center cursor-pointer"
                          onClick={() => openModal("project")}
                        >
                          <Plus size={42} />
                          <div className="">add project</div>
                        </div>
                      </div>
                    </div>
                  </ProjcetSlider>
                </section>
              )}

              <section>
                <WorkHistory />
              </section>

              {user.role === "freelancer" && (
                <section>
                  <Skills />
                </section>
              )}
            </section>
          </main>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}

      {user.role === "freelancer" && (
        <Modal
          isOpen={modals.hourlyRate}
          onClose={() => closeModal("hourlyRate")}
        >
          <div className="relative max-w-sm w-full mx-auto p-5 rounded-lg shadow-md bg-white border border-gray-200 z-10">
            <div className="text-center">
              <h1 className="text-xl font-semibold mb-4">Edit Hourly Rate</h1>

              <input
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="border border-gray-300 p-2 w-full rounded-md"
                placeholder="Enter new hourly rate"
              />

              <div className="flex justify-end mt-4 gap-3">
                <Button
                  variant="ghost"
                  onClick={() => closeModal("hourlyRate")}
                >
                  Cancel
                </Button>
                <Button
                  variant="black"
                  onClick={() => {
                    handleSave({ hourlyRate: formData.hourlyRate });
                    closeModal("hourlyRate");
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {/* Additional modal can follow a similar pattern */}
      {/* Additional modal can follow similar pattern */}
      <Modal isOpen={modals.location} onClose={() => closeModal("location")}>
        <div className="relative max-w-sm w-full mx-auto p-5 rounded-lg shadow-md bg-white border border-gray-200 z-10">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">Edit Location</h1>

            {/* Add form inputs or any content here */}
            <Input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              placeholder="Enter new location"
            />

            {/* Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <Button variant="ghost" onClick={() => closeModal("location")}>
                Cancel
              </Button>
              <Button
                variant="black"
                onClick={() => {
                  handleSave({ location: formData.location });
                  closeModal("location");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={modals.name} onClose={() => closeModal("name")}>
        <div className="relative max-w-sm w-full mx-auto p-5 rounded-lg shadow-md bg-white border border-gray-200 z-10">
          <div className="">
            <h1 className="text-xl font-semibold mb-4">Edit Name</h1>

            {/* Add form inputs or any content here */}
            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={name.firstName}
                  onChange={handleNameChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter new first name"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={name.lastName}
                  onChange={handleNameChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter new last name"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <Button variant="ghost" onClick={() => closeModal("name")}>
                Cancel
              </Button>
              <Button
                variant="black"
                onClick={() => {
                  handleSave({
                    firstName: name.firstName,
                    lastName: name.lastName,
                  });
                  closeModal("name");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={modals.bioTitle} onClose={() => closeModal("bioTitle")}>
        <div className="relative max-w-sm w-full mx-auto p-5 rounded-lg shadow-md bg-white border border-gray-200 z-10">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">Edit Bio Title</h1>

            {/* Add form inputs or any content here */}
            <Input
              name="bioTitle"
              type="text"
              value={formData.bioTitle}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              placeholder="Enter new bioTitle"
            />

            {/* Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <Button variant="ghost" onClick={() => closeModal("bioTitle")}>
                Cancel
              </Button>
              <Button
                variant="black"
                onClick={() => {
                  handleSave({ bioTitle: formData.bioTitle });
                  closeModal("bioTitle");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={modals.country} onClose={() => closeModal("country")}>
        <div className="relative max-w-sm w-full mx-auto p-5 rounded-lg shadow-md bg-white border border-gray-200 z-10">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">Edit Country </h1>

            {/* Add form inputs or any content here */}
            <Input
              name="country"
              type="text"
              value={formData.country}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              placeholder="Enter new country"
            />

            {/* Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <Button variant="ghost" onClick={() => closeModal("country")}>
                Cancel
              </Button>
              <Button
                variant="black"
                onClick={() => {
                  handleSave(formData.country);
                  closeModal("country");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modals.experience}
        onClose={() => closeModal("experience")}
      >
        <div className="relative max-w-sm w-full mx-auto p-5 rounded-lg shadow-md bg-white border border-gray-200 z-10">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-4">Edit experience</h1>

            {/* Add form inputs or any content here */}
            <Input
              name="experience"
              type="text"
              value={formData.experience}
              onChange={handleInputChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              placeholder="Enter new experience"
            />

            {/* Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              <Button variant="ghost" onClick={() => closeModal("experience")}>
                Cancel
              </Button>
              <Button
                variant="black"
                onClick={() => {
                  handleSave({ experience: formData.experience });
                  closeModal("experience");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={modals.avatar} onClose={() => closeModal("avatar")}>
        <div className="relative max-w-2xl w-full mx-auto p-6 rounded-lg shadow-lg bg-white border border-gray-300 z-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-11">
              Edit Avatar
            </h1>

            {/* Hidden file input */}
            <input
              type="file"
              id="imageInput"
              name="profile"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Layout container */}
            <div className="flex flex-col items-center sm:flex-row sm:justify-evenly gap-6">
              {/* Image preview or clickable upload area */}
              <div className="flex justify-center w-full ">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Profile Preview"
                    className="h-40 w-40  sm:h-60 sm:w-60 shadow-xl rounded-full object-cover border-4 cursor-pointer border-gray-200"
                    onClick={() =>
                      document.getElementById("imageInput").click()
                    }
                  />
                ) : (
                  <div
                    onClick={() =>
                      document.getElementById("imageInput").click()
                    }
                    className="h-40 w-40 sm:h-52 sm:w-52 rounded-full flex justify-center items-center border-2 border-dotted border-gray-300 cursor-pointer hover:border-gray-400 transition-all"
                  >
                    <Plus className="text-gray-300" size={40} />
                  </div>
                )}
              </div>

              {/* Instructional text block */}
              <div className="flex flex-col text-left max-w-md px-4 sm:px-0">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                  Show clients the best version of yourself!
                </h2>
                <p className="text-gray-500 text-sm sm:text-lg">
                  Must be an actual photo of you. Logos, clip-art, group photos,
                  and digitally altered images are not allowed.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 gap-3">
              <Button variant="ghost" onClick={() => closeModal("avatar")}>
                Cancel
              </Button>
              <Button
                variant="black"
                onClick={() => {
                  if (flie1) {
                    handleFileUpload(flie1, "profile");
                  }
                  closeModal("avatar");
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {user.role === "freelancer" && (
        <Modal isOpen={modals.project} onClose={() => closeModal("project")}>
          <div className="relative mt-10 overflow-y-scroll max-h-[80vh] max-w-3xl w-full mx-auto p-5 rounded-lg shadow-md bg-white border border-gray-200 z-10">
            <div className="">
              <h1 className="text-3xl text-center font-semibold mb-4">
                Add New Project
              </h1>

              {/* Add form inputs or any content here */}
              <form>
                <div className="flex flex-col gap-2">
                  <label htmlFor="title">Project Title</label>
                  <Input
                    name="title"
                    type="text"
                    value={project.title}
                    onChange={handleProjectChange}
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
                      value={project.role}
                      onChange={handleProjectChange}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      placeholder="eg.,front-end engineer"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="liveLink">Project Live Link</label>
                    <Input
                      name="liveLink"
                      type="text"
                      value={project.liveLink}
                      onChange={handleProjectChange}
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
                    value={project.description}
                    onChange={handleProjectChange}
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
                    <Button
                      variant="black"
                      type="button"
                      onClick={handleAddTag}
                    >
                      Add Tag
                    </Button>
                  </div>

                  {/* Display Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.technologies.map((tag, index) => (
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
                  <Button variant="ghost" onClick={() => closeModal("project")}>
                    Cancel
                  </Button>
                  <Button variant="black" onClick={handleSubmitProject}>
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default withAuthRedirect(EditProfile);
