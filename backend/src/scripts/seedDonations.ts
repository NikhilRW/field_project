import "dotenv/config";
import { db, donations } from "../config/databaseSetup";

const donorNames = [
  "Rajesh Mehta", "Priya Sharma", "Amit Patel", "Sneha Gupta",
  "Vikram Singh", "Ananya Reddy", "Siddharth Joshi", "Kavita Nair",
  "Rohan Deshmukh", "Neha Kapoor", "Arun Kumar", "Meera Iyer",
  "Deepak Verma", "Pooja Malhotra", "Suresh Rao", "Lakshmi Menon",
  "Rahul Thakur", "Divya Agarwal", "Manish Tiwari", "Anjali Kulkarni",
  "Vivek Saxena", "Shweta Mishra", "Gaurav Patil", "Nandita Choudhury",
];

const categories = ["money", "books", "clothes", "grocery", "other_items"] as const;
type Cat = typeof categories[number];

const purposes: Record<Cat, string[]> = {
  money: [
    "Monthly donation for education drive",
    "Sponsor a child's schooling for one year",
    "Contribution to health camp fund",
    "General community support",
    "Disaster relief fund contribution",
    "Annual donation to support operations",
  ],
  books: [
    "Donated textbooks for village school library",
    "Storybooks and notebooks for children",
    "Reference books for rural learning center",
    "School stationery and educational kits",
  ],
  clothes: [
    "Winter clothing drive donation",
    "Uniforms for underprivileged students",
    "Festival clothing distribution",
    "Gently used clothes collection",
  ],
  grocery: [
    "Monthly ration kit for a family of five",
    "Grocery essentials for food distribution",
    "Rice, dal and cooking oil donation",
    "Nutritional supplement packs",
  ],
  other_items: [
    "School bags and water bottles",
    "First aid kits for health camps",
    "Sports equipment for community center",
    "Hygiene kit donation",
  ],
};

async function seed() {
  const rows = Array.from({ length: 24 }, (_, i) => {
    const cat = categories[i % categories.length];
    const catPurposes = purposes[cat];
    return {
      donorName: donorNames[i],
      purpose: catPurposes[i % catPurposes.length],
      amount: cat === "money" ? String((Math.floor(Math.random() * 9000) + 1000)) : "0",
      type: "incoming" as const,
      category: cat,
      verificationStatus: "verified" as const,
      paymentStatus: (cat === "money" ? "paid" : "not_applicable") as "paid" | "not_applicable",
      date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
    };
  });

  await db.insert(donations).values(rows);
  console.log(`Inserted ${rows.length} mock donations`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
