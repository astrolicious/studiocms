// @ts-expect-error - Some types can only be imported from the Astro runtime
import { PageData, PageContent, db, eq } from 'astro:db';
import { AstroError } from 'astro/errors';

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
    content: string;
}

/**
 * A helper function to get the content of a page by its slug.
 * 
 * @param slug The slug of the page to get the content of. Defined in the PageData table.
 * @param lang **Not implemented yet.** The language to get the content in. Default is 'default'. 
 * @returns The data and content of the page.
 * 
 * @example 
 * ```astro
 * ---
 * // Get the content of the index page:
 * import { StudioCMSRenderer, contentHelper } from 'studiocms:components'
 * 
 * const { title, description, heroImage, content } = await contentHelper("index")
 * ---
 * 
 * <h1>{title}</h1>
 * <p>{description}</p>
 * <img src={heroImage} alt={title} />
 * <StudioCMSRenderer content={content} />
 * 
 * ```
 */
export async function contentHelper( slug:string ): Promise<ContentHelperTempResponse>{

    let slugTouse = slug;

    const pageData: pageDataReponse = await db
        .select().from(PageData)
        .where(eq(PageData.slug, slugTouse))
        .get();

    if(!pageData) {
        throw new AstroError(`Page not found: ${slug}`, 
        `studioCMS contentHelper Failed to get page data for page ${slug}` );
    }

    const LangToGet = "default";

    const pageContent: pageContentReponse = await db
        .select().from(PageContent)
        .where(eq(PageContent.contentId, pageData.id)).get();

    if(!pageContent.content) {
        throw new AstroError(`Page Content not found: ${slug} with language ${LangToGet}`, 
        `studioCMS contentHelper Failed to get page content for page ${slug} with language ${LangToGet}` );
    }
    return { ...pageData, content: pageContent.content };
}