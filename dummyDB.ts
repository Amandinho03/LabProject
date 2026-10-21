import { hashSync } from "bcryptjs";
import "dotenv/config";

export interface DBExperiment {
  id: number;
  scientist: string;
  machine: string;
  status: string;
  scientistEmail?: string;
}

export interface DBUser {
  id: number;
  username: string;
  password?: string;
  role: string;
  refreshToken?: string;
}

// [in-memory]
export let experiments: DBExperiment[] = [
  { id: 1, scientist: "Aman", machine: "MRI", status: "Completed" },
];

export let regusers: DBUser[] = [
  {
    id: 1,
    username: "admin",
    password: hashSync(process.env.ADMIN_PASSWORD || "admin123", 10),
    role: "admin",
  },
];
