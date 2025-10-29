import React from "react";
import { useLocation, Link } from "react-router-dom";
export default function Result() {
  const loc = useLocation();
  const st = (loc.state || {}) as any;
  if (st.success) {
    return (
      <div className="container py-20 text-center">
        <div className="inline-block rounded-full bg-green-100 p-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#16a34a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mt-4">Booking Confirmed</h2>
        <p className="mt-4">
          Ref ID: <strong>{st.booking._id}</strong>
        </p>
        <Link
          to="/"
          className="px-3 py-2 rounded bg-yellow-300 mt-6 inline-block"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  return (
    <div className="container py-20 text-center">
      <h2 className="text-xl text-red-500 font-semibold ">Booking Failed</h2>
      <p className="mt-4">{st.message}</p>
      <Link to="/" className="px-3 py-2 rounded mt-6 inline-block text-blue-600">
        Back to Home
      </Link>
    </div>
  );
}
