import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function Details() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // ✅ quantity state

  // Fetch experience details
  useEffect(() => {
    if (!id) return;
    API.get("/experiences/" + id)
      .then((r) => setData(r.data))
      .catch(console.error);
  }, [id]);

  // Handle checkout navigation
  function goCheckout() {
    if (!data || !selectedDate || !selectedTime) {
      alert("Select date and time");
      return;
    }

    nav("/checkout", {
      state: {
        experienceId: data.id,
        title: data.title,
        date: selectedDate,
        time: selectedTime,
        price: data.price,
        quantity, // ✅ include quantity
      },
    });
  }

  // ✅ Handlers for + and -
  function increaseQty() {
    setQuantity((q) => q + 1);
  }

  function decreaseQty() {
    setQuantity((q) => (q > 1 ? q - 1 : 1)); // never go below 1
  }

  if (!data) return <div className="container py-8">Loading...</div>;

  const mainImage = data.images?.[0] || "/fallback.jpg";

  // ✅ Calculate subtotal, taxes and total
  const subtotal = data.price * quantity;
  const taxes = 59;
  const total = subtotal + taxes;

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT SIDE - Experience Details */}
        <div className="md:col-span-2">
          <img
            src={mainImage}
            alt={data.title}
            className="w-full h-72 object-cover rounded-lg shadow-sm"
          />

          <div className="mt-4 border-t pt-3">
            <h1 className="text-2xl font-semibold text-gray-800">{data.title}</h1>
            <p className="text-gray-600 mt-1">{data.description}</p>

            {/* Choose Date Section */}
            <div className="mt-5">
              <h3 className="font-semibold text-gray-800">Choose date</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.slots.map((s: any, i: number) => (
                  <button
                    key={`${s.date}-${i}`}
                    className={`px-3 py-1 rounded border text-sm transition-all ${
                      selectedDate === s.date
                        ? "bg-yellow-300 border-yellow-400"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedDate(s.date);
                      setSelectedTime(null);
                    }}
                  >
                    {s.date}
                  </button>
                ))}
              </div>

              {/* Choose Time Section */}
              {selectedDate && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800">Choose time</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(
                      data.slots.find(
                        (group: any) => group.date === selectedDate
                      )?.times || []
                    ).map((t: any, idx: number) => {
                      const soldOut = (t.booked || 0) >= t.capacity;
                      return (
                        <button
                          key={`${selectedDate}-${t.time}-${idx}`}
                          disabled={soldOut}
                          className={`px-3 py-1 rounded border text-sm transition-all ${
                            selectedTime === t.time
                              ? "bg-yellow-300 border-yellow-400"
                              : "hover:bg-gray-100"
                          } ${soldOut ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => setSelectedTime(t.time)}
                        >
                          {t.time} {soldOut ? "(Sold out)" : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="mt-6 border-t pt-3">
              <h3 className="font-semibold text-gray-800">About</h3>
              <p className="text-sm text-gray-600 mt-1">
                Scenic routes, trained guides, and safety briefing. Minimum age 10.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Booking Summary */}
        <div className="bg-white rounded-lg shadow-md p-5 h-fit">
          <p className="text-sm text-gray-600">Starts at</p>
          <h2 className="text-lg font-bold text-gray-900 mb-3">₹{data.price}</h2>

          {/* ✅ Quantity Section (now dynamic) */}
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Quantity</span>
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-0.5 border rounded"
                onClick={decreaseQty}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="px-2 py-0.5 border rounded"
                onClick={increaseQty}
              >
                +
              </button>
            </div>
          </div>

          {/* ✅ Subtotal and Taxes */}
          <div className="text-sm text-gray-700 space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Subtotal</span> <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span> <span>₹{taxes}</span>
            </div>
          </div>

          {/* ✅ Total */}
          <div className="flex justify-between font-semibold text-gray-900 mb-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {/* Checkout Button */}
          <button
            onClick={goCheckout}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
