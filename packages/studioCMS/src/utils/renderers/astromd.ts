import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import markdownConfig from "virtual:studiocms/astromdremarkConfig";
import { HTMLString } from "../html-string";

export async function renderAstroMD( content: string ) {
    const processor = await createMarkdownProcessor({
        ...markdownConfig
    })

    const result = await processor.render(content);
    return new HTMLString(result.code)
}