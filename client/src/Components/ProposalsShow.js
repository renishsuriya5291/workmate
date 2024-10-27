import React, { useState } from "react";
import { DollarSign, Clock, X } from "lucide-react";
import { Image as ImageIcon, FileText, File } from "lucide-react";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { addContract, updateJob, updateProposal } from "../react-redux/store";
function ProposalsShow({ proposal }) {
  const { jobs } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    accpect: false,
    notice: false,
  });
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
  const handleContract = async () => {
    try {
      const jobId = proposal.job; // Job ID
      const proposalId = proposal._id; // Proposal ID

      const payload = {
        freelancerId: proposal.freelancer._id,
        amount: proposal.amount,
        estimatedDuration: proposal.estimatedDuration,
        // Add any other necessary fields here
      };

      // Call the API to create the contract
      const response = await axios.post(
        `/api/contract/addContract/${jobId}/${proposalId}`,
        payload
      );

      // Check if the response is successful
      if (response.status === 201) {
        console.log("Contract created:", response.data);
        dispatch(updateJob(response.data.job));
        dispatch(updateProposal(response.data.proposal));
        dispatch(addContract(response.data.contract));
        closeModal("accept");
        openModal("notice");
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      // Optionally handle error (e.g., show a notification)
    }
  };

  const openModal = (name) => {
    setModal((s) => ({ ...s, [name]: true }));
  };
  const closeModal = (name) => {
    setModal((s) => ({ ...s, [name]: false }));
  };

  return (
    <>
      <div className="border rounded-lg shadow-md overflow-hidden w-full">
        <div className="p-4  flex flex-row items-center gap-4">
          <div className="rounded-full overflow-hidden h-16 w-16">
            <img src="/avatar-1.png" className="w-full h-full object-cover" />
            <div className="flex items-center justify-center bg-gray-300 text-white h-full w-full">
              {proposal?.freelancer?.username}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">
              {proposal.freelancer.username}
            </h2>
            <p className="text-sm text-gray-500">
              {proposal.freelancer.experience}
            </p>
          </div>
        </div>
        <div className="p-4 grid gap-4">
          <div>
            <h3 className="font-semibold mb-2">Job Details</h3>
            <p className="text-sm text-gray-500">
              {jobs
                .filter((job) => job._id === proposal.job)
                .map((job) => job.description)}
            </p>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm">{`Estimated ${proposal.estimatedDuration}`}</span>
            </div>
          </div>
          {proposal?.attachments.length > 0 && (
            <div className="">
              <div className="font-semibold mb-2">Attachments</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {proposal?.attachments?.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 p-2 rounded-md shadow-sm"
                  >
                    {renderFileIcon({ name: attachment })}

                    <Link
                      to={attachment}
                      className="ml-2 text-gray-700 truncate w-14"
                    >
                      {attachment}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-semibold mb-2">Proposal</h3>
            <p className="text-sm text-gray-700 mb-2">{proposal.description}</p>
            <div className="flex gap-4 items-center">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 " />
                <span className="text-lg font-bold text-black">
                  {proposal.amount}
                </span>
              </div>
              <div className="">
                <span className="px-4 bg-gray-200 rounded-full text-sm text-gray-500">
                  {jobs
                    .filter((job) => job._id === proposal.job)
                    .map((job) => job.paymentType)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-between  items-center">
          <Button variant="outline" onClick={() => openModal("notice")}>
            Message
          </Button>
          <Button variant="black" onClick={() => openModal("accpect")}>
            Accept Proposal
          </Button>
        </div>
      </div>
      <Modal isOpen={modal.accpect} onClose={() => closeModal("accpect")}>
        <div className="relative sm:max-w-[425px] w-full mx-auto p-4 overflow-y-auto max-h-[75vh] rounded-lg shadow-lg bg-white border border-gray-300 z-10">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Accept Proposal</h2>
            <X
              className="h-5 cursor-pointer"
              onClick={() => closeModal("accpect")}
            />
          </div>
          <p className=" text-gray-500 mb-4">
            {`You're about to accept the proposal from ${proposal.freelancer.username}. This will
            initiate the project.`}
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <span>Project:</span>
              <span>
                {jobs
                  .filter((job) => job._id === proposal.job)
                  .map((job) => job.title)}
              </span>
            </div>
            <div className="flex gap-1">
              <span>Price:</span>
              <div className="flex gap-1">
                <div className="flex ">
                  <span>$</span>
                  <span>{proposal.amount}</span>
                </div>
                <span>
                  (
                  {jobs
                    .filter((job) => job._id === proposal.job)
                    .map((job) => job.paymentType)}
                  )
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <span>Estimated Time:</span>
              <span>{proposal.estimatedDuration}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end ">
            <Button variant="black" onClick={handleContract}>
              Confirm Acceptance
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={modal.notice} onClose={() => closeModal("notice")}>
        <div className="relative sm:max-w-[425px] w-full mx-auto p-6 overflow-y-auto max-h-[75vh] rounded-lg shadow-lg bg-white border border-gray-300 z-10">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Proposal Accepted</h2>
            <X
              className="h-5 cursor-pointer"
              onClick={() => closeModal("notice")}
            />
          </div>
          <p className=" text-gray-500 mb-4">
            You've successfully accepted the proposal. Here are the next steps:
          </p>
          <ol className="flex flex-col gap-2 mt-4" type="1">
            <li>1. The freelancer will be notified of your acceptance.</li>
            <li>
              2. You can now start communicating directly to discuss project
              details.
            </li>
            <li>3. Agree on milestones and payment schedule.</li>
            <li>
              4. The freelancer will begin work as per the agreed timeline.
            </li>
          </ol>

          <div className="mt-4 flex justify-end ">
            <Button
              variant="black"
              onClick={() => {
                navigate("/client/home");
              }}
            >
              Got it, thanks!
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProposalsShow;
