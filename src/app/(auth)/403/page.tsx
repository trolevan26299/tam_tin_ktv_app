export default function Forbidden() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6">
        <div className="text-center w-full max-w-md p-6 sm:p-8 bg-white rounded-lg shadow-lg mx-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-red-500 mb-3 sm:mb-4">403</h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Không có quyền truy cập
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Bạn không có quyền truy cập vào hệ thống. Vui lòng liên hệ admin để được hỗ trợ.
          </p>
        </div>
      </div>
    );
  }