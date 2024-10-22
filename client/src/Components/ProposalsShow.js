import React from "react";
import { DollarSign, Clock } from "lucide-react";
import { Image as ImageIcon, FileText, File } from "lucide-react";
import Button from "./Button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function ProposalsShow({ proposal }) {
  const { jobs } = useSelector((state) => state.auth);
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
  console.log(proposal);
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
          <Button variant="outline">Message</Button>
          <Button variant="black">Accept Proposal</Button>
        </div>
      </div>
    </>
  );
}

export default ProposalsShow;
