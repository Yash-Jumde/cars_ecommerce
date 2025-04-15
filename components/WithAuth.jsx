import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

// HOC to protect routes that require authentication
const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !currentUser) {
        router.replace('/login');
      }
    }, [currentUser, loading, router]);

    // Show loading state or redirect if not authenticated
    if (loading || !currentUser) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    // If authenticated, render the component
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging purposes
  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  
  return WithAuth;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;