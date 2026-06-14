import {
  activities,
  beneficiaries,
  db,
  donations,
  emailVerificationTokens,
  monthlyDonations,
  notifications,
  passwordResetTokens,
  surveys,
  users,
} from "../config/databaseSetup";

const main = async () => {
  console.log("Clearing all data from database...");

  await db.delete(emailVerificationTokens);
  await db.delete(passwordResetTokens);
  await db.delete(notifications);
  await db.delete(surveys);
  await db.delete(donations);
  await db.delete(beneficiaries);
  await db.delete(activities);
  await db.delete(monthlyDonations);
  await db.delete(users);

  console.log("All data cleared successfully.");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to clear database:", error);
    process.exit(1);
  });
