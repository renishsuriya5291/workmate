import { Edit, X } from "lucide-react";
import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { useSelector } from "react-redux";
import Input from "./Input";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { setUserItem } from "../react-redux/store";

function Skills() {
  const { user } = useSelector((state) => state.auth);
  const [tags, setTags] = useState(user.skills);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkill, setNewSkill] = useState(""); // For adding a new skill
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setLoading(true);
    axios
      .put(`/api/user/update`, { skills: tags })
      .then((response) => {
        console.log(`skills updated successfully`, response.data);
        toast.success("Profile Updated!");
        // Optionally update the Redux store or local state with new data
        dispatch(setUserItem(response.data.data));
        closeModal(); // Close the modal after saving
      })
      .catch((error) => {
        toast.error(error?.response?.data?.msg);
        console.log(error);
        console.error(`Error updating skills`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Add a new skill
  const addSkill = () => {
    if (newSkill.trim() && !tags.includes(newSkill)) {
      setTags([...tags, newSkill]);
      setNewSkill(""); // Reset input field
    }
  };

  // Delete a skill
  const deleteSkill = (skill) => {
    setTags(tags.filter((tag) => tag !== skill));
  };

  return (
    <>
      <Toaster />
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center">
          <div className="text-xl md:text-2xl font-semibold mb-4">Skills</div>
          <Edit size={20} onClick={openModal} className="cursor-pointer" />
        </div>

        {/* Tag Section */}
        <div className="flex flex-wrap gap-2">
          {user?.skills.map((tag, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 bg-gray-200 px-6 py-2 rounded-lg"
            >
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="relative max-w-2xl w-full mx-auto p-6 rounded-lg shadow-lg bg-white border border-gray-300 z-10">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-11">
              Add Skills
            </h1>
            <div className="mb-6 flex gap-3">
              <Input
                type="text"
                placeholder="Add new skill"
                className="w-full"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-600 transition duration-200"
                onClick={addSkill}
              >
                Add
              </button>
            </div>

            {/* List of skills with delete button */}
            <div className=" flex gap-2  flex-wrap">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 px-3 gap-3 py-2 rounded-lg"
                >
                  <span>{tag}</span>
                  <X
                    size={16}
                    className=" cursor-pointer"
                    onClick={() => deleteSkill(tag)}
                  />
                </div>
              ))}
            </div>

            {/* Add new skill input */}

            {/* Close Modal Button */}
            <div className="flex gap-3 mt-6 justify-end">
              <Button onClick={closeModal} variant="ghost">
                Close
              </Button>
              <Button variant="black" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Skills;
