import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { logout } from "../react-redux/store";
import { useLocation } from "react-router-dom";
import axios from "axios";
const NavBar = () => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth?.user?.role);
  const photo = useSelector((state) => state.auth?.user?.profilePicture);
  const username = useSelector((state) => state.auth?.user?.username);
  const dispatch = useDispatch();
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      // Make the API call for logout
      await axios.delete("/api/logout", {}, { withCredentials: true });

      // Dispatch the logout action
      dispatch(logout());

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // You can also show a notification or alert for logout failure
    }
  };

  // Handle scroll event to change nav style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav
      className={`${
        scrolled ? "bg-gray-200 shadow-sm py-1" : "bg-white py-2"
      } sticky top-0 z-50 transition-all duration-300 ease-in-out border-b border-gray-200 `}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo and navigation links */}
        <div className="flex items-center gap-5">
          {/* Logo */}
          <button className="md:hidden text-black" onClick={toggleMobileMenu}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <Link to="/">
            <img src="/logo-2.png" alt="Logo" className="h-8 sm:h-11 " />
          </Link>

          {/* Hamburger Icon for mobile */}

          {/* Navigation links for medium and larger screens */}
          {isLoggedIn && (
            <ul className="hidden md:flex ">
              {role === "freelancer" ? (
                <>
                  <li className="px-4 transition-colors duration-200">
                    {role === "freelancer" &&
                    !currentPath.startsWith("/freelancer") ? (
                      <Link to="/" className="text-black text-md font-semibold">
                        Home
                      </Link>
                    ) : (
                      <Link
                        to="/freelancer/home"
                        className="text-black text-md font-semibold"
                      >
                        Home
                      </Link>
                    )}
                  </li>
                  <li className="px-4 transition-colors duration-200">
                    {role === "freelancer" &&
                    !currentPath.startsWith("/freelancer") ? (
                      <Link
                        to="/about"
                        className="text-black text-md font-semibold"
                      >
                        About
                      </Link>
                    ) : (
                      <Link
                        to="/freelancer/about"
                        className="text-black text-md font-semibold"
                      >
                        About
                      </Link>
                    )}
                  </li>
                  <li className="px-4 transition-colors duration-200">
                    {role === "freelancer" &&
                    !currentPath.startsWith("/freelancer") ? (
                      <Link
                        to="/contact"
                        className="text-black text-md font-semibold"
                      >
                        Contact
                      </Link>
                    ) : (
                      <Link
                        to="/freelancer/contact"
                        className="text-black text-md font-semibold"
                      >
                        Contact
                      </Link>
                    )}
                  </li>
                </>
              ) : role === "client" ? (
                <>
                  <li className="px-4 transition-colors duration-200">
                    {role === "client" && !currentPath.startsWith("/client") ? (
                      <Link to="/" className="text-black text-md font-semibold">
                        Home
                      </Link>
                    ) : (
                      <Link
                        to="/client/home"
                        className="text-black text-md font-semibold"
                      >
                        Home
                      </Link>
                    )}
                  </li>
                  <li className="px-4 transition-colors duration-200">
                    {role === "client" && !currentPath.startsWith("/client") ? (
                      <Link
                        to="/about"
                        className="text-black text-md font-semibold"
                      >
                        About
                      </Link>
                    ) : (
                      <Link
                        to="/client/about"
                        className="text-black text-md font-semibold"
                      >
                        About
                      </Link>
                    )}
                  </li>
                  <li className="px-4 transition-colors duration-200">
                    {role === "client" && !currentPath.startsWith("/client") ? (
                      <Link
                        to="/contact"
                        className="text-black text-md font-semibold"
                      >
                        Contact
                      </Link>
                    ) : (
                      <Link
                        to="/client/contact"
                        className="text-black text-md font-semibold"
                      >
                        Contact
                      </Link>
                    )}
                  </li>
                </>
              ) : null}
            </ul>
          )}
        </div>

        {/* Right-side buttons and profile dropdown */}
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="font-semibold text-gray-600 text-md hidden md:block">{`Hi! ${username}`}</div>
            <div className="flex items-center relative" ref={dropdownRef}>
              {/* Profile photo with dropdown */}
              <div
                className="rounded-full h-10 w-10 object-cover cursor-pointer overflow-hidden"
                onClick={handleToggleDropdown}
              >
                <img src={photo} className="h-full w-full" alt="Profile" />
              </div>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div
                  className="absolute top-9 right-1 mt-2 w-48 bg-gray-100 text-black rounded shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ul className="py-2">
                    <li>
                      <Link
                        to={`/${role}/profile`}
                        className="block px-4 py-2  hover:bg-gray-200"
                        onClick={handleToggleDropdown}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <div
                        className="block px-4 py-2  hover:bg-gray-200 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/signin">
              <Button variant="ghost" className="hidden md:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="black">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2">
          <ul className="flex flex-col space-y-2 px-4">
            {role === "freelancer" ? (
              <>
                <li className="px-4 transition-colors duration-200">
                  {role === "freelancer" &&
                  !currentPath.startsWith("/freelancer") ? (
                    <Link to="/" className="text-black font-semibold">
                      Home
                    </Link>
                  ) : (
                    <Link
                      to="/freelancer/home"
                      className="text-black font-semibold"
                    >
                      Home
                    </Link>
                  )}
                </li>
                <li className="px-4 transition-colors duration-200">
                  {role === "freelancer" &&
                  !currentPath.startsWith("/freelancer") ? (
                    <Link to="/about" className="text-black font-semibold">
                      About
                    </Link>
                  ) : (
                    <Link
                      to="/freelancer/about"
                      className="text-black font-semibold"
                    >
                      About
                    </Link>
                  )}
                </li>
                <li className="px-4 transition-colors duration-200">
                  {role === "freelancer" &&
                  !currentPath.startsWith("/freelancer") ? (
                    <Link to="/contact" className="text-black font-semibold">
                      Contact
                    </Link>
                  ) : (
                    <Link
                      to="/freelancer/contact"
                      className="text-black font-semibold"
                    >
                      Contact
                    </Link>
                  )}
                </li>
              </>
            ) : role === "client" ? (
              <>
                <li className="px-4 transition-colors duration-200">
                  {role === "client" && !currentPath.startsWith("/client") ? (
                    <Link to="/" className="text-black font-semibold">
                      Home
                    </Link>
                  ) : (
                    <Link
                      to="/client/home"
                      className="text-black font-semibold"
                    >
                      Home
                    </Link>
                  )}
                </li>
                <li className="px-4 transition-colors duration-200">
                  {role === "client" && !currentPath.startsWith("/client") ? (
                    <Link to="/about" className="text-black font-semibold">
                      About
                    </Link>
                  ) : (
                    <Link
                      to="/client/about"
                      className="text-black font-semibold"
                    >
                      About
                    </Link>
                  )}
                </li>
                <li className="px-4 transition-colors duration-200">
                  {role === "client" && !currentPath.startsWith("/client") ? (
                    <Link to="/contact" className="text-black font-semibold">
                      Contact
                    </Link>
                  ) : (
                    <Link
                      to="/client/contact"
                      className="text-black font-semibold"
                    >
                      Contact
                    </Link>
                  )}
                </li>
              </>
            ) : null}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
