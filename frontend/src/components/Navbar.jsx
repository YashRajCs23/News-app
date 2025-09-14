import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ setCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const menuItems = [
    "general",
    "world",
    "technology",
    "sports",
    "business",
    "entertainment",
  ];

  // Check login
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

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
    <nav className="font-['Orbitron'] bg-black text-slate-200 px-4 py-3 flex items-center justify-between shadow-md shadow-teal-500/30 rounded-2xl relative z-[1000]">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <h1 className="text-sm font-bold text-teal-500 tracking-[1.5px]">
          News Aggregator
        </h1>

        {/* Desktop Menu */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            <ul className="flex list-none gap-3">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-xs uppercase transition-colors duration-300 hover:text-yellow-400"
                  onClick={() => setCategory(item)}
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* User / Signup */}
            {isLoggedIn ? (
              <Link to="/dashboard">
                <button className="p-2 text-slate-200 hover:bg-teal-500/20 rounded transition">
                  <User size={20} />
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
              <li
                key={index}
                className="px-4 py-3 cursor-pointer uppercase transition-colors duration-300 hover:bg-teal-500"
                onClick={() => {
                  setCategory(item);
                  setIsOpen(false);
                }}
              >
                {item}
              </li>
            ))}
          </ul>

          {/* Mobile User/Signup */}
          <div className="p-2 flex justify-center">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <button className="p-2 text-slate-200 hover:bg-teal-500/20 rounded transition">
                  <User size={20} />
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
