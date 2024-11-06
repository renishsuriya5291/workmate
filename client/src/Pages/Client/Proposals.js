import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../Components/Input";
import { Search } from "lucide-react";
import { ChevronDown } from "lucide-react"; // Assuming you want to use an icon
import Button from "../../Components/Button";
import ProposalsShow from "../../Components/ProposalsShow";
import { useDispatch, useSelector } from "react-redux";
import { addAllPropsal } from "../../react-redux/store";
import axios from "axios";
function Proposals() {
  const { jobId } = useParams();
  const [query, setQuery] = useState("");
  const { proposals } = useSelector((state) => state.auth);
  const [pro, setPro] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get("/api/proposal/all");
        if (response.status === 200) {
          dispatch(addAllPropsal(response.data));
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };
    fetchProposals();
  }, [dispatch]);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(
          `/api/proposal/proposals/${jobId}?search=${query}`
        );

        if (response.status === 200) {
          setPro(response.data);
        }
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };
    fetchProposals();
  }, [query]);

  return (
    <div className="bg-white">
      <div className="bg-white p-6 flex flex-col min-h-screen container mx-auto">
        <div className="border border-gray-200 rounded-md p-8">
          <div className="">
            <div>
              <h1 className="text-4xl font-semibold">Job Proposals</h1>
            </div>
            <div className="mb-8 flex flex-col sm:flex-row gap-4 mt-6">
              <div className="relative flex-grow flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search proposals"
                  className="pl-8 w-full"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pro?.map((proposal, index) => (
                <ProposalsShow key={index} proposal={proposal} />
              ))}
              {pro.length === 0 &&
                proposals
                  .filter((proposal) => proposal.job === jobId)
                  .map((filteredProposal) => (
                    <ProposalsShow
                      key={filteredProposal._id}
                      proposal={filteredProposal}
                    />
                  ))}
            </div>
            {pro.length === 0 &&
              proposals.filter((proposal) => proposal.job === jobId).length ===
                0 && (
                <>
                  <div className="flex flex-col items-center justify-center">
                    <span className="w-full max-w-xs ">
                      <img
                        src="/not.png"
                        alt="No proposals found"
                        className="w-full h-auto object-cover"
                      />
                    </span>
                    <p className="mt-4 text-gray-500 text-center">
                      No proposals found.
                    </p>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Proposals;
