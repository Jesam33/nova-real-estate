"use client";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedImage, setSelectedImage] = useState({ url: null, fullSizeUrl: null, loading: false });
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [loadingImages, setLoadingImages] = useState({});

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Optimized Cloudinary URL transformation
  const getOptimizedImageUrl = (url, size = 'thumbnail') => {
    if (!url) return url;

    // If using Cloudinary, add AGGRESSIVE optimization parameters
    if (url.includes("cloudinary")) {
      const transforms = {
        // Tiny thumbnails for grid (ultra-fast loading)
        thumbnail: 'w_150,h_150,c_fill,q_auto:low,f_auto,fl_progressive',
        // Medium preview while full loads (progressive loading)
        preview: 'w_800,h_600,c_limit,q_auto:good,f_auto,fl_progressive:steep',
        // Full size but optimized (progressive + auto format)
        full: 'w_1920,c_limit,q_auto:good,f_auto,fl_progressive:steep,dpr_auto'
      };
      
      const transform = transforms[size] || transforms.thumbnail;
      return url.replace("/upload/", `/upload/${transform}/`);
    }

    return url;
  };

  const handleImageClick = (imageUrl) => {
    const previewUrl = getOptimizedImageUrl(imageUrl, 'preview');
    const fullSizeUrl = getOptimizedImageUrl(imageUrl, 'full');
    
    // Show preview immediately, then upgrade to full
    setSelectedImage({ 
      url: previewUrl, 
      fullSizeUrl: fullSizeUrl,
      loading: true 
    });
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/submissions");
      const result = await response.json();
      if (result.success) {
        setSubmissions(result.data);
        console.log("Submissions loaded:", result.data.length);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingStatus(id);
      const response = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(`Status updated to ${status}`);
        fetchSubmissions();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const sendReply = async (submission) => {
    try {
      setSendingReply(true);
      const response = await fetch("/api/send-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: submission.email,
          subject: `Re: Your Cash Offer Request - NovaCore`,
          message: replyMessage,
          customerName: submission.name,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`✅ Email sent to ${submission.email}!`);
        setReplyMessage("");
        setSelectedSubmission(null);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error(`❌ Failed to send email: ${error.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Cash Offer Submissions ({submissions.length})
          </h1>
          <button
            onClick={fetchSubmissions}
            className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2 justify-center text-sm sm:text-base w-full sm:w-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Reply Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-2">
              <h3 className="text-lg font-bold mb-3 sm:mb-4">
                Reply to {selectedSubmission.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Email: {selectedSubmission.email}
              </p>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply message here..."
                className="w-full h-32 sm:h-40 border rounded p-3 mb-4 resize-none text-sm sm:text-base"
                disabled={sendingReply}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => sendReply(selectedSubmission)}
                  disabled={sendingReply || !replyMessage.trim()}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center text-sm sm:text-base order-2 sm:order-1"
                >
                  {sendingReply ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Reply"
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedSubmission(null);
                    setReplyMessage("");
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm sm:text-base order-1 sm:order-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal - PROGRESSIVE LOADING */}
        {selectedImage.url && (
          <div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center p-0 z-50"
            onClick={() => setSelectedImage({ url: null, fullSizeUrl: null, loading: false })}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={() => setSelectedImage({ url: null, fullSizeUrl: null, loading: false })}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10 bg-black bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-90 transition-all"
              >
                ✕
              </button>
              
              {/* Show loading spinner */}
              {selectedImage.loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                </div>
              )}
              
              {/* Show preview first (medium quality, loads fast) */}
              <img
                src={selectedImage.url}
                alt="Property preview"
                className={`max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain transition-opacity duration-300 ${
                  selectedImage.loading ? 'opacity-70 blur-sm' : 'opacity-100'
                }`}
                onClick={(e) => e.stopPropagation()}
                style={{ imageRendering: 'high-quality' }}
              />
              
              {/* Load full-size in background and swap when ready */}
              <img
                src={selectedImage.fullSizeUrl}
                alt="Property full size"
                className="hidden"
                onLoad={(e) => {
                  // Swap to full-size when loaded
                  setSelectedImage(prev => ({
                    ...prev,
                    url: prev.fullSizeUrl,
                    loading: false
                  }));
                }}
                onError={() => {
                  setSelectedImage(prev => ({ ...prev, loading: false }));
                }}
              />
              
              {/* Quality indicator */}
              {selectedImage.loading && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
                  Loading full quality...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submissions Grid */}
        <div className="grid gap-3 sm:gap-4">
          {submissions.map((submission) => (
            <div
              key={submission._id}
              className="bg-white rounded-lg p-4 sm:p-6 border shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                {/* Submission Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 break-words">
                    {submission.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    <div>
                      <p className="text-gray-700 text-sm sm:text-base">
                        <strong className="text-gray-900">Address:</strong>
                        <span className="break-words ml-1">
                          {submission.address}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm sm:text-base">
                        <strong className="text-gray-900">Phone:</strong>
                        <span className="break-words ml-1">
                          {submission.phone}
                        </span>
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-gray-700 text-sm sm:text-base break-words">
                        <strong className="text-gray-900">Email:</strong>{" "}
                        {submission.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm sm:text-base">
                        <strong className="text-gray-900">Condition:</strong>{" "}
                        {submission.condition}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm sm:text-base">
                        <strong className="text-gray-900">
                          Desired Price:
                        </strong>{" "}
                        {submission.desiredAmount}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mt-3 text-sm sm:text-base">
                    <strong className="text-gray-900">Reason:</strong>{" "}
                    {submission.reason}
                  </p>

                  {/* Images */}
                  {submission.images && submission.images.length > 0 ? (
                    <div className="mt-4">
                      <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                        Property Photos ({submission.images.length}):
                      </p>
                      <div className="flex gap-2 sm:gap-3 flex-wrap">
                        {submission.images.map((imageUrl, index) => {
                          const optimizedUrl = getOptimizedImageUrl(imageUrl, 'thumbnail');
                          const imageId = `${submission._id}-${index}`;

                          return (
                            <div
                              key={index}
                              className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-200"
                              onClick={() => handleImageClick(imageUrl)}
                            >
                              {/* Loading skeleton */}
                              {loadingImages[imageId] !== false && (
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center absolute">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                              )}

                              {/* Thumbnail images */}
                              <img
                                src={optimizedUrl}
                                alt={`Property photo ${index + 1}`}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:border-blue-400 transition-all"
                                onLoad={() => {
                                  setLoadingImages((prev) => ({
                                    ...prev,
                                    [imageId]: false,
                                  }));
                                }}
                                onError={(e) => {
                                  setLoadingImages((prev) => ({
                                    ...prev,
                                    [imageId]: false,
                                  }));
                                  e.target.onerror = null;
                                  e.target.src = `https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=Image`;
                                }}
                                loading="lazy"
                              />

                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg"></div>
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded text-[10px]">
                                {index + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm">No photos provided</p>
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-3">
                    Submitted: {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row lg:flex-col gap-2 justify-between lg:justify-start lg:min-w-[140px]">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 flex items-center gap-2 justify-center flex-1 lg:flex-none"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="hidden xs:inline">Reply</span>
                  </button>

                  <select
                    value={submission.status || "pending"}
                    onChange={(e) =>
                      updateStatus(submission._id, e.target.value)
                    }
                    disabled={updatingStatus === submission._id}
                    className="border rounded px-2 py-1 text-sm disabled:opacity-50 bg-white flex-1 lg:flex-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="offered">Offer Made</option>
                    <option value="successful">Successful</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <span
                    className={`px-2 py-1 text-xs text-center rounded-full font-medium flex items-center justify-center flex-1 lg:flex-none
                    ${
                      submission.status === "successful"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : submission.status === "rejected"
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : submission.status === "contacted"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : submission.status === "offered"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    }`}
                  >
                    {submission.status || "pending"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-lg">No submissions yet.</p>
            <p className="text-gray-400 mt-2">Form submissions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}