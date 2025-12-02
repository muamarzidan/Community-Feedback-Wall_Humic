import { Component } from 'react';


class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  };

  componentDidCatch(error, errorInfo) {
    console.warn('Error caught by boundary:', error);
    console.warn('Error info:', errorInfo);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-800">Oops! Something went wrong</h2>
            <p className="mb-4 text-gray-600">Please refresh the page to try again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white transition-colors duration-300 bg-primary-500 rounded-xl hover:bg-primary-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    };

    return this.props.children;
  }
};

export default ErrorBoundary;