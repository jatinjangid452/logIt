import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Rating = () => {
  const { id: logId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const managerId = new URLSearchParams(location.search).get("managerId");

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [existingRatingId, setExistingRatingId] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/ratings/log/${logId}`);
        const managerRating = res.data.find(r => r.rater_id === managerId);
        if (managerRating) {
          setRating(managerRating.rating_value);
          setFeedback(managerRating.comments || "");
          setExistingRatingId(managerRating._id);
        }
      } catch (err) {
        toast.error("❌ Failed to fetch existing rating");
      }
    };
    fetchRating();
  }, [logId, managerId]);

  const handleSave = async () => {
    if (!rating) return toast.error("Please select a rating");

    try {
      if (existingRatingId) {
        await axios.put(`http://localhost:3000/api/ratings/${existingRatingId}`, {
          rating_value: rating,
          comments: feedback,
        });
        toast.success("✅ Rating updated successfully!");
      } else {
        await axios.post("http://localhost:3000/api/ratings", {
          log_id: logId,
          rater_id: managerId,
          rating_value: rating,
          comments: feedback,
        });
        toast.success("✅ Rating submitted successfully!");
      }
      navigate("/logForm/LogList");
    } catch (err) {
      toast.error("❌ Failed to submit rating");
    }
  };

  const handleBack = () => navigate("/logForm/LogList");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 py-10 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rate This Task</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
        >
          ← Back
        </button>
      </div>

      {/* Rating Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex flex-col items-center space-y-6">
          {/* Star Rating */}
          <div className="flex justify-center space-x-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-transform transform hover:scale-110 ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Feedback */}
          <div className="w-full">
            <label className="block font-semibold text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end w-full space-x-3 pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Submit Rating
            </button>
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;


// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// const Rating = () => {
//   const { id: logId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const managerId = new URLSearchParams(location.search).get("managerId");

//   const [rating, setRating] = useState(0);
//   const [feedback, setFeedback] = useState("");
//   const [existingRatingId, setExistingRatingId] = useState(null);

//   useEffect(() => {
//     const fetchRating = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/api/ratings/log/${logId}`);
//         const managerRating = res.data.find(r => r.rater_id === managerId);
//         if (managerRating) {
//           setRating(managerRating.rating_value);
//           setFeedback(managerRating.comments || "");
//           setExistingRatingId(managerRating._id);
//         }
//       } catch (err) {
//         toast.error("Failed to fetch existing rating");
//       }
//     };
//     fetchRating();
//   }, [logId, managerId]);

//   const handleSave = async () => {
//     if (!rating) return toast.error("Please select a rating");

//     try {
//       if (existingRatingId) {
//         await axios.put(`http://localhost:3000/api/ratings/${existingRatingId}`, {
//           rating_value: rating,
//           comments: feedback
//         });
//         toast.success("Rating updated successfully!");
//       } else {
//         await axios.post("http://localhost:3000/api/ratings", {
//           log_id: logId,
//           rater_id: managerId,
//           rating_value: rating,
//           comments: feedback
//         });
//         toast.success("Rating submitted successfully!");
//       }
//       navigate("/logForm/LogList");
//     } catch (err) {
//       toast.error("Failed to submit rating");
//     }
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Rate This Task</h2>
//       <div className="flex justify-center space-x-2 mb-4">
//         {[1, 2, 3, 4, 5].map(star => (
//           <button
//             key={star}
//             type="button"
//             onClick={() => setRating(star)}
//             className={`text-3xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
//           >★</button>
//         ))}
//       </div>
//       <div className="mb-4">
//         <label className="block mb-1 font-medium">Feedback:</label>
//         <textarea
//           value={feedback}
//           onChange={e => setFeedback(e.target.value)}
//           className="border p-2 rounded w-full"
//           placeholder="Write your feedback here..."
//         />
//       </div>
//       <div className="flex justify-center space-x-3">
//         <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit</button>
//         <button onClick={() => navigate("/logForm/LogList")} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default Rating;



