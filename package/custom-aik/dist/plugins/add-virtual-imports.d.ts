import { Plugin } from '../core/types.js';
import { addVirtualImports } from '../utilities/add-virtual-imports.js';
import 'astro';
import '../internal/types.js';

declare const addVirtualImportsPlugin: Plugin<"addVirtualImports", "astro:config:setup", (imports: Parameters<typeof addVirtualImports>[0]["imports"]) => void>;

export { addVirtualImportsPlugin };
