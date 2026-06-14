import { randomUUID } from "crypto";
import {
  activityStatusEnum,
  activities,
  beneficiaryCategoryEnum,
  beneficiaries,
  db,
  donationTypeEnum,
  donations,
  healthStatusEnum,
  monthlyDonations,
  surveys,
  userRoleEnum,
  users,
} from "../config/databaseSetup";
import { hashPassword } from "../utils/password";

const parseDate = (value: string) => new Date(value);

type UserRole = (typeof userRoleEnum.enumValues)[number];
type BeneficiaryCategory = (typeof beneficiaryCategoryEnum.enumValues)[number];
type HealthStatus = (typeof healthStatusEnum.enumValues)[number];
type ActivityStatus = (typeof activityStatusEnum.enumValues)[number];
type DonationType = (typeof donationTypeEnum.enumValues)[number];

const beneficiariesData: Array<{
  name: string;
  age: number;
  category: BeneficiaryCategory;
  healthStatus: HealthStatus;
  address: string;
  initials: string;
  color: string;
}> = [
  {
    name: "Sunita Patil",
    age: 72,
    category: "Elderly",
    healthStatus: "Good",
    address: "Chikanghar, Kalyan East",
    initials: "SP",
    color: "#1B6CA8",
  },
  {
    name: "Rahul Sharma",
    age: 8,
    category: "Children",
    healthStatus: "Moderate",
    address: "Swanand Colony, Kalyan",
    initials: "RS",
    color: "#27AE60",
  },
  {
    name: "Kamla Devi",
    age: 65,
    category: "Elderly",
    healthStatus: "Critical",
    address: "Khadakpada, Kalyan West",
    initials: "KD",
    color: "#E74C3C",
  },
  {
    name: "Priya Gupta",
    age: 5,
    category: "Children",
    healthStatus: "Good",
    address: "Dombivli East, Thane",
    initials: "PG",
    color: "#F39C12",
  },
  {
    name: "Ramesh Jadhav",
    age: 45,
    category: "PWD",
    healthStatus: "Moderate",
    address: "Titwala, Thane District",
    initials: "RJ",
    color: "#9B59B6",
  },
  {
    name: "Meena Wagh",
    age: 28,
    category: "Mothers",
    healthStatus: "Good",
    address: "Ulhasnagar, Thane",
    initials: "MW",
    color: "#E91E63",
  },
  {
    name: "Aakash More",
    age: 17,
    category: "Youth",
    healthStatus: "Good",
    address: "Ambernath, Thane",
    initials: "AM",
    color: "#00ACC1",
  },
  {
    name: "Lata Bhosle",
    age: 70,
    category: "Elderly",
    healthStatus: "Moderate",
    address: "Shahad, Kalyan",
    initials: "LB",
    color: "#FF5722",
  },
];

const activitiesData: Array<{
  name: string;
  date: string;
  status: ActivityStatus;
  description: string;
}> = [
  {
    name: "Study Kit Distribution",
    date: "Feb 25, 2026",
    status: "Upcoming",
    description:
      "Distribution of study kits including notebooks, stationery, and school bags to underprivileged children.",
  },
  {
    name: "Sanitary Pad Drive",
    date: "Feb 20, 2026",
    status: "Completed",
    description:
      "Hygiene awareness and free sanitary pad distribution for women and adolescent girls.",
  },
  {
    name: "Health Checkup Camp",
    date: "Mar 3, 2026",
    status: "Upcoming",
    description:
      "Free health checkup camp for elderly beneficiaries with basic medicine distribution.",
  },
  {
    name: "Donation Drive",
    date: "Feb 10, 2026",
    status: "Completed",
    description:
      "Collection and distribution of clothes, food items, and essential supplies to needy families.",
  },
  {
    name: "Youth Awareness Workshop",
    date: "Mar 12, 2026",
    status: "Upcoming",
    description:
      "Workshop on career guidance, digital literacy, and health awareness for youth aged 15-24.",
  },
  {
    name: "Senior Citizen Meet",
    date: "Feb 14, 2026",
    status: "Completed",
    description:
      "Social gathering and recreational activities for elderly beneficiaries with basic health monitoring.",
  },
];

const donationsData: Array<{
  donor: string;
  purpose: string;
  amount: number;
  type: DonationType;
  date: string;
}> = [
  {
    donor: "Tata Trust",
    purpose: "Medical Supplies",
    amount: 50000,
    type: "incoming",
    date: "Feb 15, 2026",
  },
  {
    donor: "Reliance Foundation",
    purpose: "Sanitary Pad Drive",
    amount: 35000,
    type: "incoming",
    date: "Feb 12, 2026",
  },
  {
    donor: "Admin",
    purpose: "Transportation",
    amount: 8500,
    type: "outgoing",
    date: "Feb 11, 2026",
  },
  {
    donor: "Infosys Foundation",
    purpose: "Study Kits",
    amount: 25000,
    type: "incoming",
    date: "Feb 8, 2026",
  },
  {
    donor: "Admin",
    purpose: "Office Supplies",
    amount: 3200,
    type: "outgoing",
    date: "Feb 7, 2026",
  },
  {
    donor: "CSR Fund - HDFC",
    purpose: "Health Camp",
    amount: 100000,
    type: "incoming",
    date: "Feb 5, 2026",
  },
  {
    donor: "Admin",
    purpose: "Medical Kits",
    amount: 12000,
    type: "outgoing",
    date: "Feb 4, 2026",
  },
  {
    donor: "Bajaj Foundation",
    purpose: "Youth Workshop",
    amount: 18000,
    type: "incoming",
    date: "Feb 3, 2026",
  },
];

const surveysData = [
  {
    date: "Feb 18, 2026",
    location: "Chikanghar, Kalyan East",
    note: "Assessed 15 elderly households. 3 require urgent medical attention.",
    beneficiariesCovered: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
    geoTag: "19.2437° N, 73.1355° E",
  },
  {
    date: "Feb 16, 2026",
    location: "Swanand Colony, Kalyan",
    note: "Hygiene awareness survey. 8 families identified for sanitary pad distribution program.",
    beneficiariesCovered: 32,
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
    geoTag: "19.2501° N, 73.1412° E",
  },
  {
    date: "Feb 14, 2026",
    location: "Khadakpada, Kalyan West",
    note: "Child nutrition survey. 12 children found malnourished, enrolled in support program.",
    beneficiariesCovered: 24,
    imageUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400",
    geoTag: "19.2389° N, 73.1298° E",
  },
  {
    date: "Feb 10, 2026",
    location: "Dombivli East, Thane",
    note: "PWD household mapping completed. Accessibility improvements recommended.",
    beneficiariesCovered: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400",
    geoTag: "19.2183° N, 73.0867° E",
  },
];

const monthlyDonationsData = [
  { month: "Sep", monthIndex: 9, received: 45000, spent: 20000 },
  { month: "Oct", monthIndex: 10, received: 62000, spent: 35000 },
  { month: "Nov", monthIndex: 11, received: 38000, spent: 28000 },
  { month: "Dec", monthIndex: 12, received: 90000, spent: 55000 },
  { month: "Jan", monthIndex: 13, received: 74000, spent: 42000 },
  { month: "Feb", monthIndex: 14, received: 228000, spent: 23700 },
];

const main = async () => {
  await db.delete(donations);
  await db.delete(surveys);
  await db.delete(beneficiaries);
  await db.delete(activities);
  await db.delete(monthlyDonations);
  await db.delete(users);

  const adminUserId = randomUUID();
  const adminPasswordHash = await hashPassword("#Nikhil009");

  await db.insert(users).values({
    id: adminUserId,
    name: "Nikhil Ramesh Wankhede",
    email: "nikhilwankhede0707@gmail.com",
    passwordHash: adminPasswordHash,
    role: "Admin",
    isEmailVerified: true,
  });

  // const activitiesWithIds = activitiesData.map((activity) => ({
  //   id: randomUUID(),
  //   name: activity.name,
  //   date: parseDate(activity.date),
  //   status: activity.status,
  //   description: activity.description,
  // }));

  // await db.insert(activities).values(activitiesWithIds);

  // await db.insert(beneficiaries).values(
  //   beneficiariesData.map((beneficiary) => ({
  //     id: randomUUID(),
  //     ...beneficiary,
  //   })),
  // );

  // await db.insert(donations).values(
  //   donationsData.map((donation) => ({
  //     id: randomUUID(),
  //     donorName: donation.donor,
  //     purpose: donation.purpose,
  //     amount: String(donation.amount),
  //     type: donation.type,
  //     date: parseDate(donation.date),
  //   })),
  // );

  // await db.insert(surveys).values(
  //   surveysData.map((survey) => ({
  //     id: randomUUID(),
  //     date: parseDate(survey.date),
  //     location: survey.location,
  //     note: survey.note,
  //     beneficiariesCovered: survey.beneficiariesCovered,
  //     imageUrl: survey.imageUrl,
  //     geoTag: survey.geoTag,
  //     createdByUserId: adminUserId,
  //   })),
  // );

  // await db.insert(monthlyDonations).values(
  //   monthlyDonationsData.map((month) => ({
  //     id: randomUUID(),
  //     month: month.month,
  //     monthIndex: month.monthIndex,
  //     received: String(month.received),
  //     spent: String(month.spent),
  //   })),
  // );
};

main()
  .then(() => {
    console.log("Mock data seeded successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed to seed mock data:", error);
    process.exit(1);
  });
