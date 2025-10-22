import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#224266] text-gray-200 py-8 mt-10 font-jost">
      <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-4">
        <h2 className="text-xl font-semibold tracking-wide">
          DisasterConnect
        </h2>

        <div className="flex space-x-6">
          <a
            href="https://www.instagram.com/unclimatechange/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors duration-300"
          >
            <FaInstagram size={24} />
          </a>

          <a
            href="https://www.facebook.com/unitednations"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors duration-300"
          >
            <FaFacebookF size={24} />
          </a>

          <a
            href="https://x.com/un"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors duration-300"
          >
            <FaTwitter size={24} />
          </a>
        </div>

        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} <span className="font-medium">DisasterConnect</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
