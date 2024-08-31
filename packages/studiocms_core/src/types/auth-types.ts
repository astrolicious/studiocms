import type { ScryptOpts } from '@noble/hashes/scrypt';
import type { Input } from '@noble/hashes/utils';

/**
 * Username and Password Configuration Type
 */
export type usernameAndPasswordConfig = {
	salt: Input;
	opts: ScryptOpts;
};

/**
 * Auth Configuration Type
 */
export type ScryptOptsRemap = {
	cpu_mem: number;
	block_size: number;
	parallelization: number;
	output_key_length?: number;
	asyncTick?: number;
	max_mem?: number;
};

/**
 * Auth Configuration Map Type
 */
export type AuthConfigMap = {
	salt: string;
	opts: ScryptOptsRemap;
};
