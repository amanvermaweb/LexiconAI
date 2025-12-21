import React from "react";

const signin = () => {
  const InputClass =
    "w-full px-4 py-2 border rounded-lg focus:outline-white focus:ring-2 focus:ring-black";
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl shadow-white shadow-md p-8">
        <h1 className="text-2xl font-bold text-center">LexiconAI</h1>
        <p className="text-center text-gray-500 mt-1">
          Log Back Into Your Account
        </p>
        <form className="mt-6 space-y-4">
          <input type="text" placeholder="Full Name" className={InputClass} />

          <input type="email" placeholder="Email" className={InputClass} />

          <input
            type="password"
            placeholder="Password"
            className={InputClass}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className={InputClass}
          />

          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg hover:opacity-90"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Do not have an account?
          <a href="/signup" className="text-white font-medium ml-1">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default signin;
