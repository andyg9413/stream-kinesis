// @ts-ignore
import NodeCache from "node-cache";

export class CacheService {
    private static cache: NodeCache;

    private constructor() {}

    public static getCache(): NodeCache {
        if (!CacheService.cache) {
            this.cache = new NodeCache({stdTTL: 60 * 60 * 24, checkperiod: 60 * 60 * 24 * 0.2, useClones: false});
        }

        return CacheService.cache;
    }
}
