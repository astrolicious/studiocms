interface ImportMetaEnv {
	readonly PROD: boolean;
	readonly BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		isLoggedIn: boolean;
		dbUser?: {
			id: string;
			url: string | null;
			name: string;
			email: string | null;
			avatar: string | null;
			githubId: number | null;
			githubURL: string | null;
			discordId: string | null;
			googleId: string | null;
			auth0Id: string | null;
			username: string;
			password: string | null;
			updatedAt: Date | null;
			createdAt: Date | null;
		} | null;
		user?: {
			id: string;
			username?: string;
			githubId?: number;
		} | null;
		session?: {
			id: string;
			userId: string;
			fresh: boolean;
			expiresAt: Date;
		} | null;
	}
}
