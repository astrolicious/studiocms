/// <reference types="@astrojs/db" />
import { eq, lte } from 'astro:db';

import type { Database, Table } from '@astrojs/db/runtime';
import type { Adapter, DatabaseSession, DatabaseUser, UserId } from 'lucia';

export class AstroDBAdapter implements Adapter {
	private db: Database;

	private sessionTable: SessionTable;
	private userTable: UserTable;

	constructor(db: Database, sessionTable: SessionTable, userTable: UserTable) {
		this.db = db;
		this.sessionTable = sessionTable;
		this.userTable = userTable;
	}

	public async deleteSession(sessionId: string): Promise<void> {
		await this.db.delete(this.sessionTable).where(eq(this.sessionTable.id, sessionId));
	}

	public async deleteUserSessions(userId: UserId): Promise<void> {
		await this.db.delete(this.sessionTable).where(eq(this.sessionTable.userId, userId));
	}

	public async getSessionAndUser(
		sessionId: string
	): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
		const result = await this.db
			.select({
				user: this.userTable,
				session: this.sessionTable,
			})
			.from(this.sessionTable)
			.innerJoin(this.userTable, eq(this.sessionTable.userId, this.userTable.id))
			.where(eq(this.sessionTable.id, sessionId))
			.get();
		if (!result) return [null, null];
		return [transformIntoDatabaseSession(result.session), transformIntoDatabaseUser(result.user)];
	}

	public async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
		const result = await this.db
			.select()
			.from(this.sessionTable)
			.where(eq(this.sessionTable.userId, userId))
			.all();
		return result.map((val) => {
			return transformIntoDatabaseSession(val);
		});
	}

	public async setSession(session: DatabaseSession): Promise<void> {
		await this.db
			.insert(this.sessionTable)
			.values({
				id: session.id,
				userId: session.userId,
				expiresAt: session.expiresAt,
				...session.attributes,
			})
			.run();
	}

	public async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
		await this.db
			.update(this.sessionTable)
			.set({
				expiresAt: expiresAt,
			})
			.where(eq(this.sessionTable.id, sessionId))
			.run();
	}

	public async deleteExpiredSessions(): Promise<void> {
		await this.db.delete(this.sessionTable).where(lte(this.sessionTable.expiresAt, new Date()));
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function transformIntoDatabaseSession(raw: any): DatabaseSession {
	const { id, userId, expiresAt, ...attributes } = raw;
	return {
		userId,
		id,
		expiresAt,
		attributes,
	};
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function transformIntoDatabaseUser(raw: any): DatabaseUser {
	const { id, ...attributes } = raw;
	return {
		id,
		attributes,
	};
}

export type UserTable = Table<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	any,
	{
		id: {
			type: UserIdColumnType;
			schema: {
				unique: false;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				deprecated: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				name: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				collection: any;
				primaryKey: true;
			};
		};
	}
>;

export type SessionTable = Table<
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	any,
	{
		id: {
			type: 'text';
			schema: {
				unique: false;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				deprecated: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				name: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				collection: any;
				primaryKey: true;
			};
		};
		expiresAt: {
			type: 'date';
			schema: {
				optional: false;
				unique: false;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				deprecated: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				name: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				collection: any;
			};
		};
		userId: {
			type: UserIdColumnType;
			schema: {
				unique: false;
				deprecated: false;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				name: any;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				collection: any;
				primaryKey: false;
				optional: false;
				references: {
					type: UserIdColumnType;
					schema: {
						unique: false;
						deprecated: false;
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						name: any;
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						collection: any;
						primaryKey: true;
					};
				};
			};
		};
	}
>;

type UserIdColumnType = UserId extends string ? 'text' : UserId extends number ? 'number' : never;
