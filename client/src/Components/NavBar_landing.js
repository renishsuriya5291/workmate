import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import Button from "../Components/Button";
import { useSelector } from "react-redux";
export default function NavBarLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const showNavLinks =
    location.pathname !== "/signin" && location.pathname !== "/signup";
  const role = useSelector((state) => state.auth.role);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${
        scrolled ? "bg-gray-200 shadow-sm py-1" : "bg-white py-2"
      } sticky top-0 z-50 transition-all duration-300 ease-in-out border-b border-gray-200`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo and nav links in a single container */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex-shrink-0">
            <img src="/logo-2.png" alt="Logo" className="h-8 sm:h-11" />
          </Link>

          {/* Center container for nav links */}
          <div className="hidden md:flex items-center space-x-4">
            {showNavLinks && (
              <ul className="flex space-x-4">
                <li className="px-4 transition-colors duration-200">
                  <Link to="/" className="text-black font-semibold text-md">
                    Home
                  </Link>
                </li>
                <li className="px-4 transition-colors duration-200">
                  <Link
                    to="/about"
                    className="text-black font-semibold text-md"
                  >
                    About
                  </Link>
                </li>
                <li className="px-4 transition-colors duration-200">
                  <Link
                    to="/contact"
                    className="text-black font-semibold text-md"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button variant="black">Sign Up</Button>
          </Link>
        </div>

        {/* Hamburger Menu Icon */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:hidden flex-col absolute top-16 left-0 w-full bg-white  z-50 transition-all duration-300 ease-in-out`}
        >
          {showNavLinks && (
            <ul className="flex flex-col gap-2 px-4">
              <li className="py-2 px-4 transition-colors duration-200">
                <Link to="/" className="text-black flex justify-center">
                  Home
                </Link>
              </li>
              <li className="py-2 px-4 transition-colors duration-200">
                <Link to="/about" className="text-black flex justify-center">
                  About
                </Link>
              </li>
              <li className="py-2 px-4 transition-colors duration-200">
                <Link to="/contact" className="text-black flex justify-center">
                  Contact
                </Link>
              </li>
            </ul>
          )}
          <div className="flex flex-col items-center gap-2 px-4 mb-2">
            <Link to="/signin" className="w-full">
              <Button variant="ghost" className="w-full justify-center">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" className="w-full">
              <Button variant="black" className="w-full justify-center">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
