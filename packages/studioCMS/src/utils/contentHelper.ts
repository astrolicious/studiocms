// @ts-expect-error - Some types can only be imported from the Astro runtime
import { PageData, PageContent, db, eq, asc, SiteConfig } from 'astro:db';
import { AstroError } from 'astro/errors';
import type { PageDataAndContent } from 'studiocms:helpers';

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

export type SiteConfigResponse = {
    siteTitle: string;
    siteDescription: string;
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

    const slugTouse = slug;

    const pageData: pageDataReponse = await db
        .select().from(PageData)
        .where(eq(PageData.slug, slugTouse))
        .get();

    if(!pageData) {
        return {} as ContentHelperTempResponse;
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

/**
 * Get page list helper function to get a list of all pages from Astro Studio's database.
 * 
 * @returns A Array of all pages in the database in ascending order of their published date.
 */
export async function getPageList(): Promise<pageDataReponse[]> {
    const pageData: pageDataReponse[] = await db
            .select()
            .from(PageData)
            .orderBy(asc(PageData.publishedAt));

    if(!pageData) {
        return [] as pageDataReponse[];
    }


    return pageData;
}

/**
 * Site Configuration helper function to get the site configuration data from Astro Studio's Database.
 * 
 * @returns The site configuration data. (Title, Description)
 */
export async function getSiteConfig(): Promise<SiteConfigResponse> {
    const config: PageDataAndContent["SiteConfig"] = await db
            .select()
            .from(SiteConfig)
            .where(eq(SiteConfig.id, 1))
            .get();
    
    if(!config) {
        return {} as SiteConfigResponse;
    }

    return {
        siteTitle: config.title,
        siteDescription: config.description,
    };
}