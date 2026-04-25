import type { Request, Response } from "express";
import { desc } from "drizzle-orm";
import { db, surveys } from "../config/databaseSetup";
import { formatDate } from "../utils/date";

export const getSurveys = async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(surveys).orderBy(desc(surveys.date));

    const data = rows.map((survey) => ({
      id: survey.id,
      date: formatDate(survey.date),
      location: survey.location,
      note: survey.note,
      beneficiariesCovered: survey.beneficiariesCovered,
      imageUrl: survey.imageUrl,
      geoTag: survey.geoTag,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch surveys:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch surveys" });
  }
};
