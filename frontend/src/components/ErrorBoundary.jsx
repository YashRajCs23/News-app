import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen p-8 bg-slate-900 text-white flex items-center justify-center">
          <div className="bg-slate-800 rounded-lg p-8 max-w-md text-center">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">Error Loading Story</h2>
            <p className="text-slate-300 mb-4">
              {this.state.error?.message || "Something went wrong"}
            </p>
            <button
              onClick={() => window.location.href = "/home"}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
