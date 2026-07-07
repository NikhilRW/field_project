import "dotenv/config";
import * as XLSX from "xlsx";
import { db, users } from "../config/databaseSetup";

const FILE_PATH = "./personal/data.xlsx"; // Set this to your Excel file path

async function importContacts() {
  if (!FILE_PATH) {
    console.error("Please set FILE_PATH to your Excel file");
    process.exit(1);
  }

  const workbook = XLSX.readFile(FILE_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

  let imported = 0;
  for (const row of rows) {
    console.log(row);
    const name = (
      row["helping  hand samajik seve sanstha donar"] ||
      row.Name || row.name || ""
    ).trim();
    const phone = (
      row.__EMPTY ||
      row["mob no"] || row["Mob no"] || row["Mob No"] || row.mobile || row.phone || ""
    );

    if (!name) continue;

    await db.insert(users).values({
      name,
      phone: phone || null,
      role: "User",
      isBlocked: false,
      isEmailVerified: false,
    });

    imported++;
  }

  console.log(`Imported ${imported} contacts`);
  process.exit(0);
}

importContacts().catch((err) => {
  console.error(err);
  process.exit(1);
});
