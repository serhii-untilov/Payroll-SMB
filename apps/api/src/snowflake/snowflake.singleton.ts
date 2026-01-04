import FlakeId = require('flake-idgen');
import intformat = require('biguint-format');

/**
 * IdGenerator Singleton
 */
export class IdGenerator {
    private static flake: FlakeId;

    static init(options?: { workerId?: number; epoch?: number }) {
        if (!this.flake) {
            this.flake = new FlakeId({
                worker: options?.workerId ?? 0,
                epoch: options?.epoch ?? 1577836800000, // 2020-01-01
            });
        }
    }

    static nextId(): string {
        if (!this.flake) {
            throw new Error('SnowflakeServiceSingleton not initialized');
        }
        return intformat(this.flake.next(), 'dec');
    }
}
