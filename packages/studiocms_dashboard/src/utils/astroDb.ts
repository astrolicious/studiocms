import { randomUUID } from 'node:crypto';
import { logger } from '@it-astro:logger:StudioCMS';
import { StudioCMSPageContent, StudioCMSPageData, StudioCMSSiteConfig, db, eq } from 'astro:db';
import { CMSSiteConfigId } from '@studiocms/core';

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
};

type PageDataUpdate = {
	id: string;
	package: string;
	title: string;
	description: string;
	showOnNav: boolean;
	updatedAt: Date | null;
	slug: string;
	heroImage: string;
};

type PageDataReturnID = {
	id: string;
};

type PageContentInsert = {
	id: string;
	lang: string;
	content: string;
};

type PageContentUpdate = {
	content: string;
	id: string;
};

type SiteConfigUpdate = {
	title: string;
	description: string;
};

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
					const pageData = await db
						.select()
						.from(StudioCMSPageData)
						.where(eq(StudioCMSPageData.slug, slug))
						.get();

					if (pageData?.package !== pkg) {
						return undefined;
					}
					return pageData;
				},
				async insertPageData(data: PageDataInsert): Promise<PageDataReturnID | undefined> {
					// TODO: This is for i18n support in the future
					const contentLang = 'default';

					const newEntry = await db
						.insert(StudioCMSPageData)
						.values({
							id: randomUUID(),
							slug: data.slug,
							title: data.title,
							package: data.package,
							description: data.description,
							contentLang: contentLang,
							heroImage: data.heroImage,
							publishedAt: data.publishedAt,
							showOnNav: data.showOnNav,
						})
						.returning({ id: StudioCMSPageData.id })
						.catch((error) => {
							logger.error(error);
							return [];
						});

					return newEntry.pop();
				},
				async update(data: PageDataUpdate) {
					await db
						.update(StudioCMSPageData)
						.set({
							title: data.title,
							description: data.description,
							slug: data.slug,
							package: data.package,
							showOnNav: data.showOnNav,
							heroImage: data.heroImage,
							updatedAt: data.updatedAt,
						})
						.where(eq(StudioCMSPageData.id, data.id))
						.catch((error) => {
							logger.error(error);
						});
				},
				async delete(id: string) {
					await db.delete(StudioCMSPageData).where(eq(StudioCMSPageData.id, id));
				},
			};
		},
		pageContent() {
			return {
				async insert(data: PageContentInsert) {
					await db
						.insert(StudioCMSPageContent)
						.values({
							id: randomUUID(),
							contentId: data.id,
							contentLang: data.lang,
							content: data.content,
						})
						.catch((error) => {
							logger.error(error);
						});
				},
				async update(data: PageContentUpdate) {
					await db
						.update(StudioCMSPageContent)
						.set({ content: data.content })
						.where(eq(StudioCMSPageContent.contentId, data.id));
				},
				async delete(id: string) {
					await db.delete(StudioCMSPageContent).where(eq(StudioCMSPageContent.contentId, id));
				},
			};
		},
		siteConfig() {
			return {
				async update(data: SiteConfigUpdate): Promise<SiteConfigReturn | undefined> {
					return await db
						.update(StudioCMSSiteConfig)
						.set(data)
						.where(eq(StudioCMSSiteConfig.id, CMSSiteConfigId))
						.returning()
						.get();
				},
			};
		},
	};
};
