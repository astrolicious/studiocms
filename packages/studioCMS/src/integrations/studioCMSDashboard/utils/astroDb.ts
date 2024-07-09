import { PageContent, PageData, SiteConfig, db, eq } from 'astro:db';
import { randomUUID } from 'node:crypto';
import type { PageDataAndContent } from 'studiocms:helpers';
import { logger } from '@it-astro:logger:StudioCMS';
import { CMSSiteConfigId } from '../../../constVars';

type PageDataType = {
    id: string;
    package: string;
    title: string;
    description: string;
    showOnNav: boolean;
    publishedAt: Date;
    updatedAt: Date | null;
    slug: string;
    contentLang: string;
    heroImage: string;
};

type PageDataInsert = {
    title: string;
    description: string;
    slug: string;
    package: string;
    showOnNav: boolean;
    publishedAt: Date;
    contentLang: string;
    heroImage: string;
}

type PageDataReturnID = {
    id: string;
};

type PageContentInsert = { 
    id: string, 
    lang: string, 
    content: string 
}

type PageContentUpdate = { 
    content: string, 
    id: string 
}

type SiteConfigUpdate = {
    title: string;
    description: string;
}

type SiteConfigReturn = {
    id: number;
    title: string;
    description: string;
};

export const astroDb = () => {
	return {
		pageData() {
			return {
				async getBySlug(slug: string, pkg: string): Promise<PageDataType | undefined> {
					const pageData = await db.select().from(PageData).where(eq(PageData.slug, slug)).get();

                    if (pageData?.package !== pkg) {
                        return undefined;
                    }
                    return pageData;
				},
                async insertPageData(data: PageDataInsert): Promise<PageDataReturnID | undefined> {

                    // TODO: This is for i18n support in the future
                    const contentLang = "default";

                    const newEntry = await db.insert(PageData).values({
                        id: randomUUID(),
                        slug: data.slug,
                        title: data.title,
                        package: data.package,
                        description: data.description,
                        contentLang: contentLang,
                        heroImage: data.heroImage,
                        publishedAt: data.publishedAt,
                        showOnNav: data.showOnNav,
                    }).returning({ id: PageData.id }).catch((error) => {
                        logger.error(error);
                        return [];
                    });

                    return newEntry.pop();
                },
                async delete(id: string) {
                    return await db.delete(PageData).where(eq(PageData.id, id));
                }
			};
		},
        pageContent() {
            return {
                async insert(data: PageContentInsert) {
                    return await db.insert(PageContent).values({ 
                        id: randomUUID(), 
                        contentId: data.id, 
                        contentLang: data.lang, 
                        content: data.content 
                    }).catch((error) => {
                        logger.error(error);
                    });
                },
                async update(data: PageContentUpdate) {
                    return await db.update(PageContent).set({ content: data.content }).where(eq(PageContent.contentId, data.id ))
                },
                async delete(id: string) {
                    return await db.delete(PageContent).where(eq(PageContent.contentId, id));
                }
            }
        },
        siteConfig() {
            return {
                async update(data: SiteConfigUpdate): Promise<SiteConfigReturn | undefined>{
                    return await db.update(SiteConfig).set(data).where(eq(SiteConfig.id, CMSSiteConfigId)).returning().get();
                }
            }
        }
	};
};
