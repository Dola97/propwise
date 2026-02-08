import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { createHash } from 'crypto';

const VERSION_KEY = 'customers:version';
const DETAIL_PREFIX = 'customers:byId';
const LIST_PREFIX = 'customers:list';
const DEFAULT_TTL = 60_000; // 60 seconds

@Injectable()
export class CustomerCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  // --- Version management ---

  private async getVersion(): Promise<number> {
    const version = await this.cache.get<number>(VERSION_KEY);
    if (version !== undefined && version !== null) return version;

    // Initialize version if not set
    await this.cache.set(VERSION_KEY, 1, 0); // TTL 0 = no expiry
    return 1;
  }

  /**
   * Increment version to invalidate all list caches.
   * Old versioned keys expire naturally via TTL.
   */
  /*

- Increment version to invalidate all list caches.
- Note: Non-atomic read+write. Concurrent mutations could lose one increment.
- Acceptable because TTL (60s) self-heals stale data. For strict consistency,
- use Redis INCR directly.
Fix: Use Redis INCR or implement proper locking mechanism.

*/

  async invalidateListCaches(): Promise<void> {
    const current = await this.getVersion();
    await this.cache.set(VERSION_KEY, current + 1, 0);
  }

  // --- Key builders ---

  private hashParams(params: Record<string, unknown>): string {
    const sorted = JSON.stringify(params, Object.keys(params).sort());
    return createHash('md5').update(sorted).digest('hex').slice(0, 12);
  }

  private async buildListKey(
    params: Record<string, unknown>,
    isInternal: boolean,
  ): Promise<string> {
    const version = await this.getVersion();
    const hash = this.hashParams(params);
    return `${LIST_PREFIX}:v${version}:${hash}:internal=${isInternal}`;
  }

  private buildDetailKey(id: string, isInternal: boolean): string {
    return `${DETAIL_PREFIX}:${id}:internal=${isInternal}`;
  }

  // --- List cache ---

  async getList<T>(
    params: Record<string, unknown>,
    isInternal: boolean,
  ): Promise<T | null> {
    const key = await this.buildListKey(params, isInternal);
    const cached = await this.cache.get<T>(key);
    return cached ?? null;
  }

  async setList<T>(
    params: Record<string, unknown>,
    isInternal: boolean,
    data: T,
  ): Promise<void> {
    const key = await this.buildListKey(params, isInternal);
    await this.cache.set(key, data, DEFAULT_TTL);
  }

  // --- Detail cache ---

  async getDetail<T>(id: string, isInternal: boolean): Promise<T | null> {
    const key = this.buildDetailKey(id, isInternal);
    const cached = await this.cache.get<T>(key);
    return cached ?? null;
  }

  async setDetail<T>(id: string, isInternal: boolean, data: T): Promise<void> {
    const key = this.buildDetailKey(id, isInternal);
    await this.cache.set(key, data, DEFAULT_TTL);
  }

  /**
   * Invalidate detail caches for specific customer IDs.
   * Deletes both internal and public variants.
   */
  async invalidateDetail(id: string): Promise<void> {
    await Promise.all([
      this.cache.del(this.buildDetailKey(id, true)),
      this.cache.del(this.buildDetailKey(id, false)),
    ]);
  }

  /**
   * Invalidate detail caches for multiple IDs.
   */
  async invalidateDetails(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.invalidateDetail(id)));
  }

  /**
   * Full invalidation: bump list version + clear specific detail keys.
   * Used on create/update/delete operations.
   */
  async invalidateForMutation(affectedIds: string[] = []): Promise<void> {
    await Promise.all([
      this.invalidateListCaches(),
      ...(affectedIds.length > 0 ? [this.invalidateDetails(affectedIds)] : []),
    ]);
  }
}
