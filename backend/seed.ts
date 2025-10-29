import mongoose from "mongoose";
import dotenv from "dotenv";

import { Promo } from "./src/index"; // adjust path

dotenv.config();
const ExperienceSchema = new mongoose.Schema({
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

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  await Promo.deleteMany();

  await Promo.insertMany([
    { code: "ADNAN10", type: "percent", amount: 10 },
    { code: "ADNAN100", type: "flat", amount: 100 },
  ]);

  console.log("✅ Promo codes seeded!");
  process.exit(0);
};

seed();

const Experience = mongoose.model("Experience", ExperienceSchema);

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB for seeding...");

    await Experience.deleteMany({});

    await Experience.insertMany([
      {
        title: "Highway Delite",
        description: "Roadside food and rest experience for travelers across India’s highways.",
        price: 1200,
      images: [
  "https://images.unsplash.com/photo-1563242152-568e5de6f2b8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
],


        
        slots: [
          { date: "2025-10-29", time: "10:00 AM", capacity: 10 },
                    { date: "2025-10-29", time: "11:00 AM", capacity: 10 },

          { date: "2025-10-30", time: "02:00 PM", capacity: 8 },
          { date: "2025-10-31", time: "02:00 PM", capacity: 5 },

          
        ],
      },
      {
        title: "LPU Journey",
        description: "Campus life exploration at Lovely Professional University with local food court experiences.",
        price: 1500,
        images: [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=800&q=80"
],
        slots: [
                              { date: "2025-10-28", time: "03:00 PM", capacity: 10 },

          { date: "2025-10-31", time: "11:00 AM", capacity: 12 },
          { date: "2025-10-31", time: "03:00 PM", capacity: 10 },
                    { date: "2025-10-31", time: "05:00 PM", capacity: 10 },
                              { date: "2025-10-31", time: "06:00 PM", capacity: 10 },



        ],
      },
      {
        title: "Mountain Trekking",
        description: "A scenic trek through the lower Himalayas with a guide and local snacks.",
        price: 2500,
        images: [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=800&q=80"
],

        slots: [
          { date: "2025-11-02", time: "07:00 AM", capacity: 15 },
          { date: "2025-11-03", time: "08:00 AM", capacity: 15 },
                    { date: "2025-11-03", time: "09:00 AM", capacity: 15 },
                                        { date: "2025-11-03", time: "10:00 AM", capacity: 15 },


        ],
      },
      {
        title: "Backyard BBQ Night",
        description: "A cozy barbecue evening with live music and grilled delights under the stars.",
        price: 1800,
        images: [
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",

"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
         
        ],
        slots: [
          { date: "2025-11-05", time: "06:00 PM", capacity: 20 },
          { date: "2025-11-06", time: "06:00 PM", capacity: 20 },
                    { date: "2025-11-06", time: "7:00 PM", capacity: 20 },
                                        { date: "2025-11-06", time: "8:00 PM", capacity: 20 },


        ],
      },
      {
        title: "Art & Coffee Workshop",
        description: "A creative evening learning painting while enjoying freshly brewed coffee.",
        price: 1000,
        images: [
          "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",

"https://images.unsplash.com/photo-1513530171079-3c0b6ae2fb5e?auto=format&fit=crop&w=800&q=80",
       
        ],
        slots: [
          { date: "2025-11-07", time: "04:00 PM", capacity: 10 },
          { date: "2025-11-08", time: "04:00 PM", capacity: 10 },
                    { date: "2025-11-08", time: "05:00 PM", capacity: 10 },
                              { date: "2025-11-08", time: "06:00 PM", capacity: 10 },


        ],
      },
      {
        title: "Sunset Boat Ride",
        description: "Relaxing sunset cruise with scenic views and light refreshments.",
        price: 2200,
        images: [
          "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      
        ],
        slots: [
          { date: "2025-11-09", time: "05:30 PM", capacity: 12 },
          { date: "2025-11-10", time: "05:30 PM", capacity: 12 },
                    { date: "2025-11-10", time: "06:30 PM", capacity: 12 },
                                        { date: "2025-11-10", time: "08:30 PM", capacity: 12 },


        ],
      },
    ]);

    console.log("🌱 Seeding complete!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
})();
