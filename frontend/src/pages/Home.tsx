import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Home({ search }: { search: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  // Fetch experiences from backend
  useEffect(() => {
    API.get("/experiences")
      .then((r) => {
        setItems(r.data);
        setFiltered(r.data);
      })
      .catch(console.error);
  }, []);

  // Search filtering logic
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(items);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        items.filter(
          (it) =>
            it.title.toLowerCase().includes(q) ||
            (it.description && it.description.toLowerCase().includes(q))
        )
      );
    }
  }, [search, items]);

  return (
    <div className="container mx-auto py-10 px-4">
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-12">
          No experiences found for “{search}”.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((it: any) => (
            <div
              key={it.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative group"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={it.thumbnail || "/fallback.jpg"}
                  alt={it.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Quantity / Available Tag */}
                {it.capacity && (
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                    {it.capacity} spots left
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col justify-between h-[180px]">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-1">
                    {it.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {it.description || "Curated small-group experience."}
                  </p>
              

                </div>

                {/* Price + CTA */}
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="font-semibold text-gray-900">
                      ₹{it.priceFrom}
                    </p>
                  </div>

                  <Link
                    to={`/experiences/${it.id}`}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium px-4 py-1.5 rounded-full transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
