import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Checkout from "./pages/Checkout";
import Result from "./pages/Result";
import "./index.css";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");

  return (
    <BrowserRouter>
      {/* Navbar */}
      <div className="border-b bg-white">
        <div className="container py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold">
              HD
            </div>
            <div className="text-sm font-semibold">highway delite</div>
          </div>

          {/* Search Bar */}
          <div className="flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Search experiences"
            />
          </div>
          <button className="px-4 py-2 rounded bg-yellow-400">Search</button>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home search={search} />} /> {/* ✅ Pass search */}
        <Route path="/experiences/:id" element={<Details />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
