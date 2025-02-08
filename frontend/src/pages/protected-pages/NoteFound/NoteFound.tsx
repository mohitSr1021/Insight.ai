const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-4xl font-bold text-purple-600">404</h1>
                <p className="text-lg text-gray-700 mt-4">
                    Oops! The page you're looking for doesn't exist.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    It seems you've stumbled onto a broken link or a page that's no
                    longer available.
                </p>
                <div className="mt-6">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
