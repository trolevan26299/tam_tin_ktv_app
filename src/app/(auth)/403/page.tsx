export default function Forbidden() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Không có quyền truy cập</h2>
          <p className="text-gray-600">
            Bạn không có quyền truy cập vào hệ thống. Vui lòng liên hệ admin để được hỗ trợ.
          </p>
        </div>
      </div>
    );
  }