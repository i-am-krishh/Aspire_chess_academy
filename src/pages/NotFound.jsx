import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Trophy } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 pt-50">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-9xl font-bold text-transparent">
            404
          </div>
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Trophy className="h-24 w-24 animate-bounce text-cyan-400" />
              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                <span className="text-xs font-bold text-white">?</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="font-orbitron mb-4 text-4xl font-bold text-white">
            OOPS! PAGE NOT FOUND
          </h1>
          <p className="mb-2 text-xl text-gray-300">
            The page you're looking for has moved to a different square on the
            board.
          </p>
          <p className="text-gray-400">
            Don't worry, even grandmasters make wrong moves sometimes!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="flex transform items-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-cyan-600 hover:to-blue-700"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex transform items-center rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-600"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-700 pt-8">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Link
              to="/about"
              className="rounded p-2 text-cyan-400 transition-colors hover:bg-gray-800/50 hover:text-cyan-300"
            >
              About Us
            </Link>
            <Link
              to="/programs"
              className="rounded p-2 text-cyan-400 transition-colors hover:bg-gray-800/50 hover:text-cyan-300"
            >
              Programs
            </Link>
            <Link
              to="/students"
              className="rounded p-2 text-cyan-400 transition-colors hover:bg-gray-800/50 hover:text-cyan-300"
            >
              Students
            </Link>
            <Link
              to="/tournaments"
              className="rounded p-2 text-cyan-400 transition-colors hover:bg-gray-800/50 hover:text-cyan-300"
            >
              Tournaments
            </Link>
          </div>
        </div>

        {/* Chess Quote */}
        <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
          <p className="text-gray-300 italic">
            "Every chess master was once a beginner." - Irving Chernev
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
