// @ts-expect-error - Some types can only be imported from the Astro runtime
import { PageData, PageContent, SiteConfig, db, eq } from 'astro:db';

export type pageDataReponse = {
    id: string;
    package: string;
    title: string;
    description: string;
    publishedAt: Date;
    updatedAt: Date | null;
    slug: string;
    contentLang: string;
    heroImage: string;
}

export type pageContentReponse = {
    id: string;
    contentId: string;
    contentLang: string;
    content: string | null;
}

// To be used in the future
//
// export type ContentHelperResponse = {
//     pageData: pageDataReponse;
//     pageContent: pageContentReponse[];
// }

export type ContentHelperTempResponse = {
    id: string;
    package: string;
    title: string;
    description: string;
    publishedAt: Date;
    updatedAt: Date | null;
    slug: string;
    heroImage: string;
    content: string | null;
}

/**
 * A helper function to get the content of a page by its slug.
 * 
 * @param slug The slug of the page to get the content of. Defined in the PageData table.
 * @param lang **Not implemented yet.** The language to get the content in. Default is 'default'. 
 * @returns The data and content of the page.
 * 
 * @example Get the content of the index page:
 * ```astro
 * --- 
 * import { StudioCMSRenderer, contentHelper } from 'studiocms:components'
 * 
 * const {page} = await contentHelper("index")
 * --- 
 * <Default 
 *     title={title} 
 *     description={description} 
 *     heroImage={heroImage}>
 * <main>
 *    <StudioCMSRenderer content={content||"No Content"}
 * </main>
 * </Default>
 * ```
 */
export async function contentHelper( slug:string ): Promise<ContentHelperTempResponse>{

    const pageData: pageDataReponse = await db
        .select().from(PageData)
        .where(eq(PageData.slug, slug))
        .get();

    if(!pageData) {
        throw new Error('Page not found');
    }

    const LangToGet = "default";

    const pageContent: pageContentReponse = await db
        .select().from(PageContent)
        .where(eq(PageContent.contentId, pageData.id) && eq(PageContent.contentLang, LangToGet)).get();

    return { ...pageData, content: pageContent.content };
}