import React, { useState, useEffect } from 'react';
// 1. **FIXED: Ensure this line is active and correct**
import Api, { BASE_URL } from '../Services/api'; // import base URL to build image URLs
// You may also need to get the BASE_URL if your Api file exports it
// If Api.js exports BASE_URL, import it:
// import Api, { BASE_URL } from '../services/Api'; 


// Utility function to map backend 'severity' to frontend 'priority' and Tailwind classes
const getPriorityClasses = (severity) => {
  // Check for undefined severity property
  if (!severity) {
      return { priority: 'Unknown Priority', priorityClass: 'text-gray-500', borderClass: 'border-gray-300' };
  }
  
  switch (severity.toLowerCase()) {
    case 'severe':
      return { priority: 'High Priority', priorityClass: 'text-red-700', borderClass: 'border-red-500' };
    case 'moderate':
      return { priority: 'Medium Priority', priorityClass: 'text-yellow-600', borderClass: 'border-yellow-500' };
    case 'minor':
      return { priority: 'Low Priority', priorityClass: 'text-green-600', borderClass: 'border-green-500' };
    default:
      return { priority: 'Unknown Priority', priorityClass: 'text-gray-500', borderClass: 'border-gray-300' };
  }
};

const ReportCard = ({ report }) => {
  const { priority, priorityClass, borderClass } = getPriorityClasses(report.severity);
  
  // Build a usable image URL. The backend stores images as "/uploads/<filename>".
  // When report.image is a relative path (starts with '/'), prefix the backend BASE_URL
  let imageUrl = null;
  if (report.image) {
    if (report.image.startsWith('http') || report.image.startsWith('//')) {
      imageUrl = report.image;
    } else if (report.image.startsWith('/')) {
      imageUrl = `${BASE_URL}${report.image}`;
    } else {
      imageUrl = `${BASE_URL}/${report.image}`;
    }
  }
  
  return (
    <div className={`flex justify-between items-start p-5 mb-5 bg-white shadow-md rounded-lg border-l-4 ${borderClass}`}>
      
      {/* Report Content (Left Side) */}
      <div className="flex-grow pr-5">
        {/* Priority */}
        <p className={`text-sm font-bold uppercase ${priorityClass} mb-1`}>
          {priority}
        </p>
        
        {/* Location & Type */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {report.type} in {report.location}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-base">
          {report.description}
        </p>
      </div>
      
      {/* Image (Right Side) */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={`${report.type} in ${report.location}`} 
          className="w-52 h-36 object-cover rounded-md flex-shrink-0 ml-4" 
        />
      )}
    </div>
  );
};

const Homepage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use the imported Api.get() method
    Api.get('/reports') 
      .then(response => {
        const data = response.data; 
        
        const sortedData = data.sort((a, b) => {
          const priorityOrder = { 'severe': 3, 'moderate': 2, 'minor': 1 };
          // Ensure severity is a string before calling toLowerCase()
          const severityA = b.severity ? b.severity.toLowerCase() : '';
          const severityB = a.severity ? a.severity.toLowerCase() : '';

          return (priorityOrder[severityA] || 0) - (priorityOrder[severityB] || 0);
        });
        
        setReports(sortedData);
        setLoading(false);
      })
      .catch(err => {
        let errorMessage = 'An unexpected error occurred.';
        if (err.response) {
            // Server responded with a status code (4xx or 5xx)
            errorMessage = err.response.data?.error || `Server Error: ${err.response.status}`;
        } else if (err.request) {
            // The request was made but no response was received (e.g., server down/wrong port)
            errorMessage = 'No response from server. Check server URL and status.';
        } else {
            // Something else happened
            errorMessage = err.message;
        }

        console.error("Fetch error:", err);
        setError(`Could not load reports: ${errorMessage}`);
        setLoading(false);
      });
  }, []);

  // --- Render Logic ---

  return (
    <div className="min-h-screen bg-gray-50 pt-20"> 
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="mb-8 pt-4">
                <h1 className="text-3xl font-medium text-gray-900">
                    Recent Disaster Reports in Kenya
                </h1>
            </header>

            {loading && (
                <div className="text-center text-lg text-blue-600">
                    Loading reports...
                </div>
            )}

            {error && (
                <div className="text-center text-lg text-red-600 p-4 border border-red-300 bg-red-50 rounded-md">
                    Error: {error}
                </div>
            )}
            
            <div className="reports-list">
                {!loading && !error && reports.length > 0 ? (
                    reports.map(report => (
                        <ReportCard key={report.id} report={report} />
                    ))
                ) : (!loading && !error && (
                    <p className="text-center text-gray-500">No disaster reports available.</p>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Homepage;