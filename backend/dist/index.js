"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Promo = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
}));
// ✅ Connect MongoDB
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
// =============================
// MODELS
// =============================
const ExperienceSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    images: [String],
    slots: [
        {
            date: String,
            time: String,
            capacity: Number,
            booked: { type: Number, default: 0 },
        },
    ],
});
const BookingSchema = new mongoose_1.default.Schema({
    experienceId: String,
    date: String,
    time: String,
    quantity: Number,
    customerName: String,
    customerEmail: String,
    subtotal: Number,
    taxes: Number,
    discount: Number,
    total: Number,
    createdAt: { type: Date, default: Date.now },
});
const Experience = mongoose_1.default.model("Experience", ExperienceSchema);
const Booking = mongoose_1.default.model("Booking", BookingSchema);
const promoSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["percent", "flat"], required: true }, // 'percent' or 'flat'
    amount: { type: Number, required: true },
});
exports.Promo = mongoose_1.default.model("Promo", promoSchema);
// =============================
// ROUTES
// =============================
// ✅ Get all experiences
app.get("/experiences", async (req, res) => {
    const exps = await Experience.find();
    const mapped = exps.map((e) => {
        // Compute total remaining capacity (sum of capacity - booked)
        const remainingSlots = e.slots?.map((s) => (s.capacity ?? 0) - (s.booked ?? 0)) || [];
        const totalAvailable = remainingSlots.reduce((a, b) => a + b, 0);
        return {
            id: e._id,
            title: e.title,
            priceFrom: e.price,
            thumbnail: e.images?.[0] || "",
            capacity: totalAvailable, // ✅ add this field for frontend
        };
    });
    res.json(mapped);
});
// ✅ Get experience details + slots
app.get("/experiences/:id", async (req, res) => {
    const e = await Experience.findById(req.params.id);
    if (!e)
        return res.status(404).json({ message: "Not found" });
    // Group slots by date
    const slotGroups = {};
    e.slots.forEach((s) => {
        if (!slotGroups[s.date])
            slotGroups[s.date] = [];
        slotGroups[s.date].push({
            time: s.time,
            capacity: s.capacity,
            booked: s.booked,
        });
    });
    const slots = Object.keys(slotGroups).map((d) => ({
        date: d,
        times: slotGroups[d],
    }));
    res.json({
        id: e._id,
        title: e.title,
        description: e.description,
        images: e.images,
        price: e.price,
        slots,
    });
});
app.post("/promo/validate", async (req, res) => {
    const { code } = req.body;
    if (!code || code.trim() === "")
        return res.status(400).json({ valid: false, message: "Promo code required" });
    const promo = await exports.Promo.findOne({ code: code.toUpperCase() });
    if (!promo) {
        return res.json({ valid: false, message: "Invalid promo code" });
    }
    res.json({
        valid: true,
        type: promo.type,
        amount: promo.amount,
        message: promo.type === "percent"
            ? `${promo.amount}% discount applied!`
            : `₹${promo.amount} off applied!`,
    });
});
app.post("/bookings", async (req, res) => {
    try {
        const { experienceId, date, time, quantity, customer, promoCode } = req.body;
        console.log("Booking payload received:", req.body);
        const exp = await Experience.findById(experienceId);
        if (!exp)
            return res.status(400).json({ message: "Experience not found" });
        const slot = exp.slots.find((s) => s.date === date && s.time === time);
        if (!slot) {
            console.error("Slot not found for:", date, time);
            return res.status(400).json({ message: "Slot not found" });
        }
        const capacity = typeof slot.capacity === "number" ? slot.capacity : 0;
        const bookedNum = Number(slot.booked ?? 0);
        const quantityNum = Number(quantity ?? 0);
        if (bookedNum + quantityNum > capacity)
            return res.status(400).json({ message: "Slot sold out or insufficient capacity" });
        // Calculate totals
        let discount = 0;
        if (promoCode) {
            const p = await exports.Promo.findOne({ code: promoCode.toUpperCase() });
            if (p) {
                const priceNum = Number(exp.price ?? 0);
                discount = p.type === "percent"
                    ? Math.round(priceNum * quantityNum * (Number(p.amount ?? 0) / 100))
                    : Number(p.amount ?? 0);
            }
        }
        const priceNum = Number(exp.price ?? 0);
        const subtotal = priceNum * quantityNum;
        const taxes = Math.round(subtotal * 0.05);
        const total = Math.max(0, subtotal + taxes - discount);
        slot.booked = bookedNum + quantityNum;
        await exp.save();
        const booking = await Booking.create({
            experienceId,
            date,
            time,
            quantity: quantityNum,
            customerName: customer.name,
            customerEmail: customer.email,
            subtotal,
            taxes,
            discount,
            total,
        });
        console.log("✅ Booking created:", booking._id);
        res.json(booking);
    }
    catch (err) {
        console.error("BOOKING ERROR:", err);
        res.status(500).json({ message: err.message || "Booking failed" });
    }
});
// =============================
// SERVER START
// =============================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
