import { Skeleton } from "@mui/material";
import { StarIcon } from "lucide-react";
import React from "react";

const Intro = ({ userName, darkMode, loading }) => {
  return (
    <>
      <div
        className={`col-span-full rounded-xl shadow-xl p-8 text-white relative overflow-hidden border border-gray-300 dark:border-gray-600 ${
          darkMode
            ? "bg-gradient-to-r from-[#0A2640] to-[#1C3D5B]"
            : "bg-white text-gray-900"
        }`}
      >
        {darkMode && (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-blue-400 opacity-30 transform -translate-x-1/2 -translate-y-1/2 rounded-full -z-10"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-purple-500 opacity-30 transform translate-x-1/2 translate-y-1/2 rounded-full -z-10"></div>
          </>
        )}
        <div className="flex items-center mb-4">
          <StarIcon
            size={32}
            className={`mr-3 rotate-animation transform rotate-12 ${
              darkMode ? "text-yellow-300" : "text-yellow-500"
            }`}
          />
          {loading ? ( // Show skeleton loader for username while loading
            <Skeleton
              className="dark:bg-gray-600"
              variant="text"
              width={150}
              height={60}
            />
          ) : (
            <h2
              className={`text-3xl font-extrabold ${
                darkMode ? "text-white" : "text-[#3B82F6]"
              }`}
            >
              Hello, {userName || "Guest"}!
            </h2>
          )}
        </div>

        <p
          className={`text-lg leading-relaxed ${
            darkMode ? "text-white" : "text-gray-700"
          }`}
        >
          Welcome back to your personal dashboard! We’ve prepared some exciting
          updates and insights for you today. Keep an eye on your budget, track
          your expenses, and make the most out of your day!
        </p>
      </div>
    </>
  );
};

export default Intro;
