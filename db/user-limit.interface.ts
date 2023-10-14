import { UserLimit } from "../interfaces/user-limit";
export interface IUserLimit {
  create(userLimit: UserLimit): Promise<void>;
  get(userLimitId: string): UserLimit;
  getAll(): UserLimit[];
  update(userLimitId: string, userLimit: Partial<UserLimit>): void;
  delete(userLimitId: string): Promise<void>;
}