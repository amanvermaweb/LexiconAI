import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
      <select name="model-selector" id="model-selector" className="bg-black">
        <option value="gpt">GPT</option>
        <option value="claude">Claude</option>
        <option value="perplexity">Perplexity</option>
      </select>
      <div>
        <div className="mx-1.5 gap-2">
          <Link
            href="/signin"
            className="px-4 py-2 m-1 rounded-2xl transition-all duration-200 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 m-1 rounded-2xl transition-all duration-200 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
