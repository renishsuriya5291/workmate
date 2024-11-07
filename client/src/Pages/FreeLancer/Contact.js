// src/Pages/Home.js
import React, { useState } from "react";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import TextAreaComponent from "../../Components/TextArea";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import withAuthRedirect from "../../Components/withAuthRedirect";

const faqs = [
  {
    question: "What services can I find on Workmate?",
    answer:
      "Workmate connects you with freelancers across various categories including writing, graphic design, web development, marketing, and more. Whether you need a one-time project or ongoing support, you can find skilled professionals to meet your needs.",
  },
  {
    question: "How do I hire a freelancer on Workmate?",
    answer:
      "To hire a freelancer, simply create an account, post your project with detailed requirements, and browse through the proposals you receive. You can review profiles, portfolios, and ratings to find the perfect match for your project.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Workmate supports various payment methods including credit/debit cards, PayPal, and bank transfers. All transactions are securely processed to protect your financial information.",
  },
  {
    question: "How can I ensure the quality of work from freelancers?",
    answer:
      "To ensure quality, you can review freelancers' profiles, check their ratings and feedback from previous clients, and communicate your expectations clearly before starting a project. Additionally, you can set milestones and request revisions if needed.",
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer:
      "If you're not satisfied with the work, you can discuss your concerns directly with the freelancer. If the issue cannot be resolved, Workmate has a dispute resolution process to help mediate and find a fair solution.",
  },
];

const FContact = () => {
  return (
    <>
      <section className="overflow-hidden bg-white">
        <div className="container mx-auto bg-white px-4 flex flex-col md:flex-row py-16 max-w-6xl">
          <div className="w-full">
            <h1 className="text-3xl font-bold text-center mb-2 text-black">
              Connect with Our Team
            </h1>
            <p className="text-center text-gray-700 max-w-xl mx-auto mb-12 text-sm">
              we believe that open communication is key to building lasting
              relationships with our clients. Our dedicated team is here to
              assist you every step of the way.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-6 text-black">
                  Get in Touch with Us
                </h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Enter your name" />
                    <Input placeholder="Enter your email" type="email" />
                  </div>
                  <Input placeholder="Subject" className="w-full" />
                  <TextAreaComponent
                    placeholder="Submit your message request"
                    className="h-32"
                  />
                  <Button
                    variant="black"
                    className="w-full flex justify-center"
                  >
                    Send message
                  </Button>
                </form>
              </div>

              {/* Contact Details */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold mb-6 text-black">
                  Contact Details
                </h2>
                <p className="text-gray-700 mb-8">
                  We value your feedback and are here to help you with any
                  questions or concerns you may have. Whether you need
                  assistance with our services or want to learn more about what
                  we offer, don't hesitate to get in touch.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex items-center shadow-md p-2 rounded-lg bg-white">
                    <div className="bg-black p-2 rounded-lg mr-4">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Address</h3>
                      <p className="text-gray-700">Anand , gujarat</p>
                    </div>
                  </div>
                  <div className="flex items-center shadow-md p-2 rounded-lg bg-white">
                    <div className="bg-black p-2 rounded-lg mr-4">
                      <Phone className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Mobile</h3>
                      <p className="text-gray-700">(+1)12345678910</p>
                    </div>
                  </div>
                  <div className="flex items-center shadow-md p-2 rounded-lg bg-white">
                    <div className="bg-black p-2 rounded-lg mr-4">
                      <Clock className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Availability</h3>
                      <p className="text-gray-700">Daily 09 am - 05 pm</p>
                    </div>
                  </div>
                  <div className="flex items-center shadow-md p-2 rounded-lg bg-white">
                    <div className="bg-black p-2 rounded-lg mr-4">
                      <Mail className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Email</h3>
                      <p className="text-gray-700">admin@support.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white">
        <div className="container mx-auto bg-white px-4 py-16 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-2">
            Your Common Queries Answered
          </h2>
          <h3 className="text-xl text-center mb-8 text-gray-600">
            with Additional FAQs
          </h3>
          <p className="text-center text-sm text-gray-600 mb-12 max-w-2xl mx-auto">
            At Workmate, we understand that you may have questions about our
            services and offerings. We've compiled a list of the most frequently
            asked questions to help you find the information you need quickly
            and easily. If you don't see your question here, feel free to reach
            out to our support team for further assistance!
          </p>

          <div className="grid grid-cols-1  md:grid-cols-2 gap-10 items-start">
            <Accordion
              type="single"
              collapsible
              className="w-full flex flex-col justify-center"
            >
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="relative  rounded-lg overflow-hidden">
              <ImageComponent
                src="/c-12.jpg"
                alt="Customer support representative"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FContact;

export const Accordion = ({ children, type, collapsible }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    if (collapsible && openIndex === index) {
      setOpenIndex(null); // Close if already open
    } else {
      setOpenIndex(index); // Open the clicked item
    }
  };

  return (
    <div className="space-y-2">
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          isOpen: index === openIndex,
          onToggle: () => toggleItem(index),
        });
      })}
    </div>
  );
};

// AccordionItem Component
export const AccordionItem = ({ isOpen, onToggle, children }) => {
  return (
    <div
      className={`border rounded-md overflow-hidden ${
        isOpen ? "bg-gray-100" : "bg-white"
      }`}
    >
      <div
        onClick={onToggle}
        className="cursor-pointer p-4 flex justify-between items-center hover:bg-gray-200 transition duration-200"
      >
        {children[0]} {/* AccordionTrigger */}
        <span className={`transform transition-all duration-200`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </div>
      {isOpen && (
        <div className="p-4 text-gray-700">
          {children[1]} {/* AccordionContent */}
        </div>
      )}
    </div>
  );
};

// AccordionTrigger Component
export const AccordionTrigger = ({ children }) => {
  return <div className="font-medium">{children}</div>;
};

// AccordionContent Component
export const AccordionContent = ({ children }) => {
  return <div>{children}</div>;
};

const ImageComponent = ({ src, alt, className }) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="object-center w-full h-full rounded-lg" // Tailwind CSS classes for responsive styling
      />
    </div>
  );
};
