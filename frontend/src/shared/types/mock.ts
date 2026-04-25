export type BeneficiaryCategory = "Elderly" | "Children" | "Youth" | "PWD" | "Mothers";
export type HealthStatus = "Good" | "Moderate" | "Critical";
export type ActivityStatus = "Upcoming" | "Completed" | "Ongoing";
export type DonationType = "incoming" | "outgoing";

export interface Beneficiary {
  id: string;
  name: string;
  age: number;
  category: BeneficiaryCategory;
  healthStatus: HealthStatus;
  address: string;
  initials: string;
  color: string;
}

export interface Activity {
  id: string;
  name: string;
  date: string;
  volunteers: number;
  status: ActivityStatus;
  description: string;
}

export interface Donation {
  id: string;
  donor: string;
  purpose: string;
  amount: number;
  type: DonationType;
  date: string;
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  skill: string;
  assignedActivity: string;
  available: boolean;
  initials: string;
  color: string;
}

export interface Survey {
  id: string;
  date: string;
  location: string;
  note: string;
  beneficiariesCovered: number;
  imageUrl: string;
  geoTag: string;
}
