import { Plugin } from '../core/types.js';
import 'astro';
import '../internal/types.js';

declare const addDtsPlugin: Plugin<"addDts", "astro:config:setup", ({ name, content }: {
    name: string;
    content: string;
}) => void>;

export { addDtsPlugin };
