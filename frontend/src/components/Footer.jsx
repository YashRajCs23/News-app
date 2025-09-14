const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121212] text-white text-center py-5 text-base">
      <div className="flex flex-col items-center gap-3">
        {/* Copyright */}
        <p>&copy; {currentYear} News Aggregator. All rights reserved.</p>

        {/* Links */}
        <ul className="flex list-none gap-5 p-0">
          <li>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Use
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="#" className="text-xl no-underline">🔵</a>
          <a href="#" className="text-xl no-underline">🐦</a>
          <a href="#" className="text-xl no-underline">📸</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
