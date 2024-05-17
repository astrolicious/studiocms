import type { ScryptOpts } from "@noble/hashes/scrypt";
import type { Input } from "@noble/hashes/utils";

export type usernameAndPasswordConfig = {
	salt: Input;
	opts: ScryptOpts;
}

export type ScryptOptsRemap = {
	cpu_mem: number;
	block_size: number;
	parallelization: number;
	output_key_length?: number;
	asyncTick?: number;
	max_mem?: number;
}

export type AuthConfigMap = {
	salt: string;
	opts: ScryptOptsRemap;
}