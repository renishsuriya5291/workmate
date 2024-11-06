import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  MessageCircleIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  DollarSignIcon,
  XCircleIcon,
  X,
  CalendarIcon,
  CirclePlus,
} from "lucide-react";
import axios from "axios";
import Modal from "../../Components/Modal";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../Components/Button";
import Input from "../../Components/Input";
import { updateContract, addAllContracts } from "../../react-redux/store";
import { formatDate } from "../../utils/DateFormat";
import withAuthRedirect from "../../Components/withAuthRedirect";
import NotFound from "../NotFound";
function FreelanceMilestoneTimeline() {
  const { contractId } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("overview");
  const { contracts, user } = useSelector((state) => state.auth);
  const [clientFeedback, setClientfeedback] = useState("");

  const [newMilestone, setNewMilestone] = useState({
    description: "",
    dueDate: "",
    amount: 0,
  });
  const [isOpen, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState({
    _id: "",
    description: "",
    amount: 0,
    dueDate: "",
    status: "pending",
  });

  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("/api/contract/getallcontracts");
        if (response.status === 200) {
          dispatch(addAllContracts(response.data.contracts));
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
      }
    };
    fetchContracts();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle dueDate validation
    if (name === "dueDate") {
      const selectedDate = new Date(value); // Directly use the value
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set hours to 0 to ignore time part

      if (selectedDate <= today) {
        setError("The date must be later than today.");
        // Optionally, you can keep the last valid date in the state
      } else {
        setError(""); // Clear any previous error
        if (edit) {
          setSelectedMilestone((prev) => ({ ...prev, [name]: value }));
        } else {
          setNewMilestone((prev) => ({ ...prev, [name]: value })); // Store date as YYYY-MM-DD
        }
      }
    } else {
      if (edit) setSelectedMilestone((prev) => ({ ...prev, [name]: value }));
      else setNewMilestone((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openModal = (milestone) => {
    setSelectedMilestone(milestone);

    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedMilestone({
      description: "",
      amount: 0,
      _id: "",
      status: "pending",
      dueDate: "",
    });
    setClientfeedback("");
    setEdit(false);
  };
  const handleAccept = async (milestone) => {
    try {
      const response = await axios.post(
        `/api/contract/accpect/${contractId}/${milestone._id}`
      );

      if (response.status === 200) {
        dispatch(updateContract(response.data.contract));
        toast.success("work accpect succfully");
        closeModal();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const submitWork = async (milestone) => {
    try {
      const response = await axios.post(
        `/api/contract/submit/${contractId}/${milestone._id}`
      );

      if (response.status === 200) {
        dispatch(updateContract(response.data.contract));
        toast.success("work submitted succfully");
        closeModal();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleRequestRevision = async (milestone) => {
    if (clientFeedback.trim() === "") {
      toast.error("enter the feedback please");
      return;
    }
    try {
      const response = await axios.post(
        `/api/contract/submit/feedack/${contractId}/${milestone._id}`,
        { feedback: clientFeedback }
      );

      if (response.status === 200) {
        dispatch(updateContract(response.data.contract));
        toast.success(response.data.message);
        closeModal();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const addMilestone = async (e) => {
    e.preventDefault();
    if (edit) {
      const contractt = contracts.find(
        (contract) => contract._id === contractId
      );
      const mileston = contractt?.milestones[contractt?.milestones?.length - 1];

      if (
        mileston &&
        mileston.status !== "pending" &&
        mileston.paymentStatus === "not_paid"
      ) {
        toast.error(
          "Please complete the previous milestone before adding a new one."
        );
        return;
      }
    }

    if (!edit) {
      const contractt = contracts.find(
        (contract) => contract._id === contractId
      );
      const milestone =
        contractt?.milestones[contractt?.milestones?.length - 1];
      console.log(milestone);
      if (
        milestone &&
        milestone.status !== "completed" &&
        milestone.paymentStatus === "not_paid"
      ) {
        toast.error(
          "Please complete the previous milestone before adding a new one."
        );
        return;
      }
    }

    // Field validation

    if (!edit && (!newMilestone.description || !newMilestone.dueDate)) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!edit && newMilestone.amount < 0) {
      toast.error("Amount must be a positive number.");
      return;
    }

    if (edit && !selectedMilestone.description) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (edit && selectedMilestone.amount < 0) {
      toast.error("Amount must be a positive number.");
      return;
    }

    try {
      let response;
      if (edit) {
        // Update existing milestone
        response = await axios.put(
          `/api/contract/updatemilestone/${contractId}/${selectedMilestone._id}`,
          {
            description: selectedMilestone.description,
            amount: selectedMilestone.amount,
            dueDate: selectedMilestone.dueDate ? selectedMilestone.dueDate : "",
          }
        );
      } else {
        // Add new milestone
        response = await axios.post(
          `/api/contract/addmilestone/${contractId}`,
          {
            description: newMilestone.description,
            amount: newMilestone.amount,
            dueDate: newMilestone.dueDate,
          }
        );
      }

      if (response.status === 201 || response.status === 200) {
        toast.success("add milestone successfully");
        dispatch(updateContract(response.data.contract));
        if (edit) {
          setEdit(false);
        }
      }
    } catch (error) {
      // Check if the error response contains a message
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while creating the milestone.";
      toast.error(errorMessage); // Display the error message to the user
    } finally {
      setModal(false);
      setNewMilestone({ description: "", amount: 0, dueDate: "" });
    }
  };
  console.log(clientFeedback);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-500";
      case "submitted":
        return "bg-blue-500";
      case "feedback":
        return "bg-yellow-500";
      case "revision":
        return "bg-orange-500";
      case "pending":
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <RefreshCwIcon className="h-4 w-4 text-white" />;
      case "feedback":
        return <MessageCircleIcon className="h-4 w-4 text-white" />;
      case "completed":
        return <CheckCircleIcon className="h-4 w-4 text-white" />;
      case "paid":
        return <DollarSignIcon className="h-4 w-4 text-white" />;
      case "pending":
        return <XCircleIcon className="h-4 w-4 text-white" />;
      default:
        return null;
    }
  };
  const TabsContent = ({ children, isVisible }) =>
    isVisible ? <div className="mt-4">{children}</div> : null;
  if (!contracts.find((contract) => contract._id === contractId)) {
    return (
      <>
        <NotFound />
      </>
    );
  } else {
    return (
      <div className="bg-white">
        <Toaster />
        <div className="container mx-auto py-8">
          {/* //navigation of progress */}
          <div className="lg:px-4">
            <div className="border mb-8 border-gray-200 p-5 pb-0 rounded-lg">
              <div className="">
                <h1 className="text-3xl font-bold mb-4">
                  {
                    contracts.find((contract) => contract._id === contractId)
                      ?.job.title
                  }
                </h1>
                <div className="">
                  <span className="flex gap-3">
                    <img
                      src={user.profilePicture}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <span className="flex flex-col">
                      <span className="text-xl font-bold">{user.username}</span>
                      <span>{user.experience}</span>
                    </span>
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-4 ">
                    <button
                      className={`py-2 px-4 ${
                        activeTab === "overview" ? "border-b border-black" : ""
                      } transition-all duration-300 hover:bg-gray-100 rounded-md rounded-b-none`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </button>
                    <button
                      className={`py-2 px-4 ${
                        activeTab === "message" ? "border-b border-black" : ""
                      } transition-all duration-200 hover:bg-gray-100 rounded-md rounded-b-none`}
                      onClick={() => setActiveTab("message")}
                    >
                      Message
                    </button>
                    <button
                      className={`py-2 px-4 ${
                        activeTab === "details" ? "border-b border-black" : ""
                      } transition-all duration-300 hover:bg-gray-100 rounded-md rounded-b-none`}
                      onClick={() => setActiveTab("details")}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <TabsContent isVisible={activeTab === "overview"}>
              <div className="p-8 bg-gray-100 rounded-lg flex justify-between mb-6">
                <div className="">
                  <div className="">Project price</div>
                  <div className="font-semibold ">{`$ ${
                    contracts.find((contract) => contract._id === contractId)
                      ?.amount
                  }`}</div>
                  <div className="text-gray-500 text-sm">
                    {`${
                      contracts.find((contract) => contract._id === contractId)
                        ?.job.paymentType
                    }-price`}
                  </div>
                </div>
                <div className="">
                  <div className="">Milestones paid (2)</div>
                  <div className="font-semibold ">$ 200</div>
                </div>
                <div className="">
                  <div className="">Milestones Remaining (0)</div>
                  <div className="font-semibold ">$ 200</div>
                </div>
                <div className="border-l border-gray-600 px-8">
                  <div className="">Total charges</div>
                  <div className="font-semibold ">$ 105</div>
                </div>
              </div>
              <h1 className="text-xl font-bold mb-6">Milestone Timeline</h1>

              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-8 flex flex-col">
                  {contracts
                    .find((contract) => contract._id === contractId)
                    ?.milestones?.map((milestone, index) => (
                      <div key={index} className="relative pl-12">
                        <div className="absolute left-0 mt-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                              milestone.status
                            )}`}
                          >
                            {getStatusIcon(milestone.status)}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div
                            className="pt-2 bg-white cursor-pointer"
                            onClick={() => openModal(milestone)}
                          >
                            {/* <h3 className="font-bold text-lg mb-1 text-blue-500">
                        {milestone.date}
                      </h3> */}
                            <h4 className="font-semibold text-lg">
                              {milestone.description}
                            </h4>
                            <span className="mt-2 text-gray-600">
                              $ {milestone.amount}
                            </span>
                            <span className="pt-2 flex gap-2 items-center text-gray-400">
                              <CalendarIcon className="h-5 w-5  " />
                              <span className="text-sm">
                                {formatDate(milestone.dueDate)}
                              </span>
                            </span>
                            {/* <p className="text-sm font-semibold">
                        Status: {milestone.status}
                      </p>
                      <p className="text-sm italic text-gray-500">
                        Category: {milestone.category}
                      </p> */}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {!contracts.find((contract) => contract._id === contractId)
                ?.milestones && user.role === "freelancer" ? (
                <div className="relative mt-8 pl-12">
                  <p className="text-gray-500">
                    Milestones are not available for freelancers at this time.
                  </p>
                </div>
              ) : user.role === "client" ? (
                <div className="relative mt-8 pl-12">
                  <Button
                    variant="black"
                    className="flex gap-2 items-center"
                    onClick={() => setModal(true)}
                  >
                    <CirclePlus className="h-4 w-4" />
                    <span>Add Milestone</span>
                  </Button>
                </div>
              ) : null}
            </TabsContent>
          </div>

          <Modal
            isOpen={modal}
            onClose={() => {
              setModal(false);
              setNewMilestone({ description: "", amount: 0, dueDate: "" });
            }}
          >
            <div className="relative sm:max-w-[425px] w-full mx-auto p-6 overflow-y-auto max-h-[75vh] rounded-lg shadow-lg bg-white border border-gray-300 z-10">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">sagfudysf</h2>
                <X
                  className="h-5 cursor-pointer"
                  onClick={() => {
                    setModal(false);
                    setNewMilestone({
                      description: "",
                      amount: 0,
                      dueDate: "",
                    });
                  }}
                />
              </div>

              <div className="mb-4 flex-1">
                <label
                  className="block text-left mb-2"
                  htmlFor="milestone-description"
                >
                  Description
                </label>
                <textarea
                  id="milestone-description"
                  name="description"
                  type="text"
                  value={newMilestone.description}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  placeholder="Enter Description"
                  required
                />
              </div>
              <div className="mb-4 flex-1">
                <label
                  className="block text-left mb-2"
                  htmlFor="milestone-amount"
                >
                  Amount
                </label>
                <Input
                  id="milestone-amount"
                  name="amount"
                  type="number"
                  value={newMilestone.amount}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  required
                />
              </div>
              <div className="mb-4 flex-1">
                <label
                  className="block text-left mb-2"
                  htmlFor="milestone-due-date"
                >
                  Due Date
                </label>
                <input
                  id="milestone-due-date"
                  name="dueDate"
                  type="date"
                  value={newMilestone.dueDate ? newMilestone.dueDate : ""}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 w-full rounded-md"
                  required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <Button
                variant="black"
                className="w-full flex justify-center"
                onClick={addMilestone}
              >
                Add Milestone
              </Button>
            </div>
          </Modal>

          <Modal isOpen={isOpen} onClose={closeModal}>
            {selectedMilestone && (
              <div className="relative sm:max-w-[425px] w-full mx-auto p-6 overflow-y-auto max-h-[75vh] rounded-lg shadow-lg bg-white border border-gray-300 z-10">
                <div className="flex justify-between mb-4">
                  {!edit && (
                    <h2 className="text-lg font-semibold">
                      {selectedMilestone.description}
                    </h2>
                  )}
                  {edit && (
                    <h2 className="text-lg font-semibold">Edit Milestone</h2>
                  )}
                  <X className="h-5 cursor-pointer" onClick={closeModal} />
                </div>
                {edit && (
                  <div className="mb-4">
                    <div className="mb-4 flex-1">
                      <label
                        className="block text-left mb-2"
                        htmlFor="milestone-description"
                      >
                        Description
                      </label>
                      <textarea
                        id="milestone-description"
                        name="description"
                        type="text"
                        value={selectedMilestone.description}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 w-full rounded-md"
                        placeholder="Enter Description"
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mb-2">
                  {!edit && (
                    <>
                      <span>Amount:</span>
                      <span>{selectedMilestone.amount}</span>
                    </>
                  )}
                  {edit && (
                    <div className="mb-4 flex-1">
                      <label
                        className="block text-left mb-2"
                        htmlFor="milestone-amount"
                      >
                        Amount
                      </label>
                      <Input
                        id="milestone-amount"
                        name="amount"
                        type="number"
                        value={selectedMilestone.amount}
                        onChange={handleInputChange}
                        className="border border-gray-300 p-2 w-full rounded-md"
                        required
                      />
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <span>Status : </span>
                  <span className="px-4 bg-gray-300 rounded-full text-sm">
                    {selectedMilestone.status}
                  </span>
                </div>

                {/* Additional Information */}
                {!edit && (
                  <div className="mb-4">
                    <p className="text-sm">
                      <strong>Due Date:</strong>{" "}
                      {new Date(selectedMilestone.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {!edit &&
                  user.role === "freelancer" &&
                  selectedMilestone.clientFeedback && (
                    <div className="flex gap-1">
                      <p>Feedback : </p>
                      <p className=" italic text-gray-700">
                        "{selectedMilestone.clientFeedback}"
                      </p>
                    </div>
                  )}

                {edit && (
                  <div className="mb-4 flex-1">
                    <label
                      className="block text-left mb-2"
                      htmlFor="milestone-due-date"
                    >
                      Due Date
                    </label>
                    <input
                      id="milestone-due-date"
                      name="dueDate"
                      type="date"
                      value={selectedMilestone.dueDate}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 w-full rounded-md"
                      required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                )}

                {user.role === "client" &&
                  selectedMilestone.status === "in_review" && (
                    <div className="mb-4 flex flex-col w-full">
                      <label htmlFor="feedback" className="mb-2 font-semibold">
                        Feedback
                      </label>
                      <textarea
                        name="clientFeedback"
                        id="feedback"
                        rows="4" // Set a default height
                        value={clientFeedback}
                        onChange={(e) => setClientfeedback(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 resize-none"
                        placeholder="Enter your feedback here..."
                      />
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex justify-end mt-4 gap-2">
                  {user.role === "client" &&
                    selectedMilestone.status === "in_review" && (
                      <Button
                        variant="ghost"
                        onClick={() => handleAccept(selectedMilestone)}
                      >
                        Accept Work
                      </Button>
                    )}
                  {user.role === "client" && edit && (
                    <Button variant="black" onClick={addMilestone}>
                      save
                    </Button>
                  )}
                  {user.role === "client" &&
                    !edit &&
                    selectedMilestone.status === "pending" && (
                      <Button variant="black" onClick={() => setEdit(true)}>
                        Edit
                      </Button>
                    )}
                  {user.role === "client" &&
                    selectedMilestone.status === "in_review" && (
                      <Button
                        variant="black"
                        onClick={() => handleRequestRevision(selectedMilestone)}
                      >
                        Request Revision
                      </Button>
                    )}
                  {user.role === "client" &&
                    selectedMilestone.status === "completed" && (
                      <Button
                        variant="black"
                        // onClick={() => handleRequestRevision(selectedMilestone)}
                      >
                        Make Payment
                      </Button>
                    )}
                  {user.role === "freelancer" &&
                    selectedMilestone.status === "pending" && (
                      <Button
                        variant="black"
                        onClick={() => submitWork(selectedMilestone)}
                      >
                        Submit Work
                      </Button>
                    )}
                </div>
              </div>
            )}
          </Modal>

          <Modal></Modal>
        </div>
      </div>
    );
  }
}

export default withAuthRedirect(FreelanceMilestoneTimeline);
