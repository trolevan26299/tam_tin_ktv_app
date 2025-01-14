import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <div className="w-full max-w-xs">
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: "100%" }}
          >
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
