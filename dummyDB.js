import { hashSync } from "bcryptjs";
import "dotenv/config";

// [in-memory]
export let experiments = [
  { id: 1, scientist: "Aman", machine: "MRI", status: "Completed" },
];

export let regusers = [
  {
    id: 1,
    username: "admin",
    password: hashSync(process.env.ADMIN_PASSWORD, 10),
    role: "admin",
  },
];
