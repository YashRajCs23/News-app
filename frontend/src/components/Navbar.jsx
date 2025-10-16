import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

import Cookies from "js-cookie";
import { useUserContext } from "../context/UserContext";

const Navbar = ({ setCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { user } = useUserContext ? useUserContext() : { user: null };

  const menuItems = [
    "general",
    "world",
    "technology",
    "sports",
    "business",
    "entertainment",
  ];

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="font-['aileron'] bg-black text-slate-200 px-4 py-6 flex items-center justify-between shadow-md shadow-teal-500/30  relative z-[1000]">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <Link to="/home">
          <h1 className="text-md font-bold text-teal-500 tracking-[1.5px] cursor-pointer hover:text-yellow-400">
            News Aggregator
          </h1>
        </Link>

        {/* Desktop Menu */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            <ul className="flex list-none gap-3">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to="/home"
                    className="cursor-pointer text-xs uppercase transition-colors duration-300 hover:text-yellow-400"
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            {/* User / Signup */}
            {user ? (
              <Link to="/user/dashboard">
                <button className="p-2 text-slate-200 hover:bg-teal-500/20 rounded transition flex items-center gap-2">
                  <User size={20} />
                  <span className="text-xs font-bold">{user.name || user.email}</span>
                </button>
              </Link>
            ) : (
              <Link to="/signup">
                <button className="text-xs px-3 py-1.5 bg-teal-500 text-black rounded transition hover:bg-yellow-400 uppercase">
                  Sign Up
                </button>
              </Link>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            className="bg-transparent border-none text-white cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isOpen && (
        <div className="absolute top-full right-2 bg-slate-800 w-56 rounded-lg shadow-md shadow-teal-500/30 overflow-hidden transition-all">
          <ul className="list-none m-0 p-0">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to="/home"
                  className="block px-4 py-3 cursor-pointer uppercase transition-colors duration-300 hover:bg-teal-500"
                  onClick={() => {
                    setCategory(item);
                    setIsOpen(false);
                  }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile User/Signup */}
          <div className="p-2 flex justify-center">
            {user ? (
              <Link to="/user/dashboard">
                <button className="p-2 text-slate-200 hover:bg-teal-500/20 rounded transition flex items-center gap-2">
                  <User size={20} />
                  <span className="text-xs font-bold">{user.name || user.email}</span>
                </button>
              </Link>
            ) : (
              <Link to="/signup">
                <button className="text-xs px-3 py-1.5 bg-teal-500 text-black rounded transition hover:bg-yellow-400 uppercase">
                  Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
