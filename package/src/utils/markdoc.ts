import Markdoc from '@markdoc/markdoc';

export async function renderMarkDoc(input: string): Promise<string> {

    const ast = Markdoc.parse(input);
    
    const content = Markdoc.transform(ast);

    const html = Markdoc.renderers.html(content);

    return html;

}