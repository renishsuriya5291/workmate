import { useState } from "react";

const WorkHistory = () => {
  const [activeTab, setActiveTab] = useState("completed");

  return (
    <div className="p-4 md:p-8 border-b border-gray-200">
      <div className="text-xl  md:text-2xl font-semibold mb-4">
        <h1>Work History</h1>
      </div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-grary-200 transition-all duration-150">
        <button
          onClick={() => setActiveTab("completed")}
          className={`${
            activeTab === "completed"
              ? "text-black border-b border-black"
              : "text-gray-400"
          }`}
        >
          Work Completed
        </button>
        <button
          onClick={() => setActiveTab("inProgress")}
          className={` ${
            activeTab === "inProgress"
              ? "text-black border-b border-black"
              : "text-gray-400"
          }`}
        >
          In Progress
        </button>
      </div>

      {/* Work History Container */}
      <div className="space-y-6">
        {activeTab === "completed" && (
          <>
            {/* Completed Work Items */}
            <div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  Website Development for Local Business
                </h2>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★★★★☆</span>
                  <span className="text-sm text-gray-600">(4.5)</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Developed a responsive website for a local business to enhance
                their online presence and increase customer engagement.
              </p>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Client:</span> John Doe |{" "}
                <span className="font-semibold">Budget:</span> $1200 |{" "}
                <span className="font-semibold">Duration:</span> 3 weeks
              </div>
              <div className="italic text-gray-600">
                "Great job! The website looks professional and met all our
                requirements."
              </div>
            </div>

            <div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Mobile App Design</h2>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="text-sm text-gray-600">(5.0)</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Designed a user-friendly mobile app for a fintech startup
                focusing on an intuitive user experience and modern aesthetics.
              </p>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Client:</span> Sarah Smith |{" "}
                <span className="font-semibold">Budget:</span> $1500 |{" "}
                <span className="font-semibold">Duration:</span> 2 weeks
              </div>
              <div className="italic text-gray-600">
                "Excellent design work! Highly recommend for app UI/UX design."
              </div>
            </div>
          </>
        )}

        {activeTab === "inProgress" && (
          <>
            {/* In Progress Work Items */}
            <div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  E-commerce Website Development
                </h2>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Building a scalable e-commerce platform with product management,
                payment integration, and order tracking features.
              </p>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Client:</span> Emily Clark |{" "}
                <span className="font-semibold">Budget:</span> $2000 |{" "}
                <span className="font-semibold">Duration:</span> 4 weeks
              </div>
            </div>

            <div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">
                  SaaS Dashboard UI/UX Design
                </h2>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Designing an intuitive dashboard UI for a SaaS platform focusing
                on ease of navigation and data visualization.
              </p>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-semibold">Client:</span> Alex Johnson |{" "}
                <span className="font-semibold">Budget:</span> $1800 |{" "}
                <span className="font-semibold">Duration:</span> 3 weeks
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkHistory;
