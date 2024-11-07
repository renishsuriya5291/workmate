// src/Pages/FAbout.js
import React from 'react';
import withAuthRedirect from '../../Components/withAuthRedirect';


function FAbout() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="container mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

                <div className="flex flex-col lg:flex-row">
                    {/* Left Side: About the Company */}
                    <div className="w-full lg:w-7/12 pr-6 mb-6 lg:mb-0">
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-gray-700 mb-4">
                            At WorkMate, our mission is to revolutionize the way people interact with their surroundings. We strive to provide innovative solutions that make life easier, more connected, and more enjoyable.
                        </p>
                        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                        <ul className="list-disc list-inside text-gray-700 mb-4">
                            <li>Innovation: We continuously push the boundaries to deliver cutting-edge solutions.</li>
                            <li>Integrity: We maintain the highest standards of honesty and transparency in all our dealings.</li>
                            <li>Customer Focus: We are committed to understanding and exceeding our customers' expectations.</li>
                            <li>Sustainability: We prioritize practices that benefit our environment and community.</li>
                        </ul>
                    </div>

                    {/* Right Side: Team */}
                    <div className="w-full lg:w-5/12">
                        <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
                        <div className="flex flex-col space-y-4">
                            {/* Team Member 1 */}
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src="https://via.placeholder.com/80"
                                    alt="Team Member 1"
                                    className="w-16 h-16 rounded-full border-2 border-black"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">Renish Suriya</h3>
                                    <p className="text-gray-600">CEO & Founder</p>
                                </div>
                            </div>
                            {/* Team Member 2 */}
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src="https://via.placeholder.com/80"
                                    alt="Team Member 2"
                                    className="w-16 h-16 rounded-full border-2 border-black"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">Kunj Patel</h3>
                                    <p className="text-gray-600">CTO</p>
                                </div>

                            </div>
                            {/* Team Member 2 */}
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src="https://via.placeholder.com/80"
                                    alt="Team Member 2"
                                    className="w-16 h-16 rounded-full border-2 border-black"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">Karan Zala</h3>
                                    <p className="text-gray-600">CMO</p>
                                </div>
                            </div>
                            {/* Add more team members as needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuthRedirect(FAbout);
