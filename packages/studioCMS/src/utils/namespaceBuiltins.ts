import { builtinModules as builtins } from 'node:module';
import type { Plugin } from 'vite';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function namespaceBuiltinsPlugin(): Plugin<any> {

    return {
        name: 'namespace-builtins',
        enforce: 'pre',
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        resolveId(id: any) {
            if (id[0] === '.' || id[0] === '/') return;
    
            if (builtins.includes(id)) {
                return { id: `node:${id}`, external: true };
            }
        },
    }
}