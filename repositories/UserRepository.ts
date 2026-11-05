import { regusers, DBUser } from "../dummyDB.js";

export class UserRepository {
  static findByUsername(username: string): DBUser | undefined {
    return regusers.find((u) => u.username === username);
  }

  static findById(id: number): DBUser | undefined {
    return regusers.find((u) => u.id === id);
  }

  static getCount(): number {
    return regusers.length;
  }

  static create(user: DBUser): DBUser {
    regusers.push(user);
    return user;
  }
}