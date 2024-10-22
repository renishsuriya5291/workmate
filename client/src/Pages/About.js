// src/Pages/About.js
import React, { useState } from "react";

const About = () => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      <section className={`relative ${isLoading ? "" : "bg-black"} py-20`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-center min-h-[70vh]">
            {/* Image as background with lower opacity */}
            <div className="absolute inset-0">
              {isLoading && (
                <div className="flex justify-center w-full h-full items-center">
                  <div className="w-[97%] h-[93%] rounded-lg mx-auto bg-gray-300 animate-pulse"></div>
                </div>
              )}
              <img
                src="/img-5.png"
                alt="description"
                onLoad={() => setIsLoading(false)}
                style={{ display: isLoading ? "none" : "block" }}
                className="w-full h-full object-cover opacity-65"
              />
            </div>
            {/* Only show text if the image has loaded */}
            {!isLoading && (
              <div className="relative z-10 max-w-xl w-full md:pl-8">
                <h2 className="text-4xl font-semibold text-white mb-4">
                  About WorkMate
                </h2>
                <p className="text-xl sm:text-2xl text-white mb-8">
                  We empower people worldwide to live their work dream, building
                  their business from the ground up and becoming financially and
                  professionally independent.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Debunking the archaic 9-to-5 work model
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl w-full mx-auto">
            <p>
              WorkMate started in 2024 with a one Idea. A lot has changed since
              then but our goals remain the same; connect clients to our
              community of expert freelancers who are available to hire by the
              hour or project; provide flexibility to work when it suits you,
              outside the archaic 9-to-5 day; and enable people to live their
              work dream.
            </p>{" "}
            <p>
              So far we've connected clients and freelancers and paid to
              freelancers — We think we might be onto something.
            </p>
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-medium px-8 mb-4">Press Highlights</h2>
          <div className="flex flex-wrap justify-center mx-4">
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white py-4">
                <img
                  src="/press-1.svg"
                  className="max-w-[7.5rem] "
                  alt="Press Highlight 1"
                />
                <p className="text-gray-600 text-sm mt-2 ">
                  Freelancing website has been assisting small businesses around
                  the world in finding affordable talent to perform small tasks
                  or to work on specific projects.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white py-4">
                <img
                  src="/press-2.svg"
                  className="max-w-[7.5rem] "
                  alt="Press Highlight 2"
                />
                <p className="text-gray-600 text-sm  ">
                  A business built on the idea that companies need to be
                  flexible and efficient when it comes to employment.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/3 p-4">
              <div className="bg-white py-4">
                <img
                  src="/press-3.svg"
                  className="max-w-[7.5rem] "
                  alt="Press Highlight 3"
                />
                <p className="text-gray-600 text-sm mt-2 ">
                  Freelanceing is an online community of freelance talent that
                  helps companies outsource specific projects to remote workers
                  when needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
