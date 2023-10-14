import { IUserLimit } from "./user-limit.interface";
import { UserLimit } from "../interfaces/user-limit";
// @ts-ignore
import NodeCache from "node-cache";
import {CacheService} from "./cache.service";

export class UserLimitRepository implements IUserLimit {
    create(userLimit: UserLimit): Promise<void> {
        CacheService.getCache().set(userLimit.userLimitId, userLimit);
        return;
    }

    get(userLimitId: string): UserLimit {
        return CacheService.getCache().get(userLimitId);
    }

    update(userLimitId: string, userLimit: Partial<UserLimit>): void {
        const cachedUserLimit: UserLimit = CacheService.getCache().get(userLimitId);
        CacheService.getCache().set(userLimitId, {...cachedUserLimit, ...userLimit});
        return;
    }

    delete(userLimitId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getAll(): UserLimit[] {
        const userLimits = CacheService.getCache().mget(CacheService.getCache().keys()) as UserLimit[];
        return Object.values(userLimits);
    }
}
