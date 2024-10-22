import React, { useState, useEffect } from "react";
import {
  Briefcase,
  DollarSign,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  addAllJobs,
  updateJob,
  updateUser,
  addAllPropsal,
} from "../../react-redux/store";
import JobCard from "../../Components/JobCard";
import { useLocation } from "react-router-dom";

const TabsContent = ({ children, isVisible }) =>
  isVisible ? <div className="mt-4">{children}</div> : null;

const FHome = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("best-matches");
  const { jobs } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLike = async (job) => {
    try {
      const response = await axios.put(`/api/job/like/${job._id}`);
      if (response.status === 200) {
        dispatch(updateUser(response.data));
        dispatch(updateJob(response.data.job));
      }
    } catch (error) {
      console.error("Error liking the job:", error);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/job/all");
        if (response.status === 200) {
          dispatch(addAllJobs(response.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    const fetchProposals = async () => {
      try {
        const response = await axios.get("/api/proposal/all");
        if (response.status === 200) {
          dispatch(addAllPropsal(response.data));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    const ft = async () => {
      await fetchProposals();
      await fetchJobs();
    };
    ft();
  }, [dispatch, location.pathname]);

  const calculateTimeAgo = (date) => {
    const now = new Date();
    const secondsAgo = Math.floor((now - new Date(date)) / 1000);
    if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} minutes ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo} hours ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-8 overflow-hidden">
              <div>
                <h2 className="text-xl font-semibold">Find Work</h2>
                <p className="text-gray-600">
                  Search for your next opportunity
                </p>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Search for jobs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <Button variant="black">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex space-x-4 border-b">
                <button
                  className={`py-2 px-4 ${
                    activeTab === "best-matches" ? "border-b border-black" : ""
                  } transition-all duration-300`}
                  onClick={() => setActiveTab("best-matches")}
                >
                  Best Matches
                </button>
                <button
                  className={`py-2 px-4 ${
                    activeTab === "most-recent" ? "border-b border-black" : ""
                  } transition-all duration-300`}
                  onClick={() => setActiveTab("most-recent")}
                >
                  Most Recent
                </button>
                <button
                  className={`py-2 px-4 ${
                    activeTab === "liked" ? "border-b border-black" : ""
                  } transition-all duration-300`}
                  onClick={() => setActiveTab("liked")}
                >
                  Liked Jobs
                </button>
              </div>

              <TabsContent isVisible={activeTab === "best-matches"}>
                <div className="space-y-4 mt-4">
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      user={user}
                      handleLike={handleLike}
                      calculateTimeAgo={calculateTimeAgo}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent isVisible={activeTab === "most-recent"}>
                <div className="space-y-4 mt-4">
                  {jobs.filter((job) => {
                    const jobPostedTime = new Date(job.createdAt);
                    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                    return jobPostedTime >= oneHourAgo;
                  }).length > 0 ? (
                    jobs
                      .filter((job) => {
                        const jobPostedTime = new Date(job.createdAt);
                        const oneHourAgo = new Date(
                          Date.now() - 60 * 60 * 1000
                        );
                        return jobPostedTime >= oneHourAgo;
                      })
                      .map((job) => (
                        <JobCard
                          key={job._id}
                          job={job}
                          user={user}
                          handleLike={handleLike}
                          calculateTimeAgo={calculateTimeAgo}
                        />
                      ))
                  ) : (
                    <p className="text-gray-600">No posts available.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent isVisible={activeTab === "liked"}>
                <div className="space-y-4 mt-4">
                  {user.likedJobs && user.likedJobs.length > 0 ? (
                    user.likedJobs.map((likedJobId) => {
                      const job = jobs.find((job) => job._id === likedJobId);
                      return job ? (
                        <JobCard
                          key={job._id}
                          job={job}
                          user={user}
                          handleLike={handleLike}
                          calculateTimeAgo={calculateTimeAgo}
                        />
                      ) : null;
                    })
                  ) : (
                    <p>No liked jobs found.</p>
                  )}
                </div>
              </TabsContent>
            </div>
          </div>

          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4">
                <h2 className="text-lg font-semibold">John Doe</h2>
                <p className="text-gray-600">Full Stack Developer</p>
              </div>
              <div className="p-4">
                <Button variant="black">Edit Profile</Button>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Your Stats</h2>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-gray-600" />
                      Jobs Completed
                    </span>
                    <span className="font-semibold">18</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-gray-600" />
                      Total Earned
                    </span>
                    <span className="font-semibold">$15,230</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4 text-gray-600" />
                      Proposals Sent
                    </span>
                    <span className="font-semibold">42</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Quick Links</h2>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <User className="mr-2 h-4 w-4" /> View Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <Settings className="mr-2 h-4 w-4" /> Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/help"
                      className="flex items-center text-gray-600 hover:text-blue-600"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" /> Help & Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
      </main>
    </div>
  );
};

export default FHome;
