import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";

export default function Checkout() {
  const loc = useLocation();
  const nav = useNavigate();
  const st = (loc.state || {}) as any;

  const basePrice = st.price * (st.quantity || 1);
  const taxes = 59;
  const totalPrice = basePrice + taxes;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(totalPrice);

  // ✅ Apply promo
  const applyPromo = async () => {
    try {
      const res = await API.post("/promo/validate", { code: promoCode });
      if (!res.data.valid) {
        alert(res.data.message || "Invalid code");
        return;
      }

      const { type, amount } = res.data;
      let discountValue = 0;

      if (type === "percent") discountValue = (totalPrice * amount) / 100;
      else discountValue = amount;

      const newFinal = Math.max(totalPrice - discountValue, 0); // never go negative
      setDiscount(discountValue);
      setFinalPrice(newFinal);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Confirm Booking
  async function confirm() {
    if (!name || !email) {
      alert("Name and email required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        experienceId: st.experienceId,
        date: st.date,
        time: st.time,
        quantity: st.quantity,
        customer: { name, email },
        promoCode,
        finalPrice,
      };
      const res = await API.post("/bookings", payload);
      nav("/result", { state: { success: true, booking: res.data } });
    } catch (e: any) {
      nav("/result", {
        state: {
          success: false,
          message: e?.response?.data?.message || e?.message,
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT SIDE - FORM */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-lg">Guest details</h2>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              className="p-2 border rounded"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Promo Section */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              onClick={applyPromo}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Apply
            </button>
          </div>

          {discount > 0 && (
            <div className="mt-3 text-green-600 font-semibold">
              Discount applied: ₹{discount.toFixed(2)} <br />
              Final total: ₹{finalPrice.toFixed(2)}
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Summary */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Experience</p>
          <h3 className="font-semibold">{st.title}</h3>
          <p className="text-sm">
            Date: {st.date} • Time: {st.time}
          </p>

          <div className="mt-4 text-gray-700 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Base Price</span> <span>₹{basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span> <span>₹{taxes}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span> <span>₹{finalPrice}</span>
            </div>
          </div>

          <div className="mt-4">
            <button
              disabled={loading}
              className="px-3 py-2 rounded bg-yellow-400 hover:bg-yellow-500 w-full font-medium"
              onClick={confirm}
            >
              {loading ? "Processing..." : "Pay and Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
