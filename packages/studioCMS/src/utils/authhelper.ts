// @ts-expect-error - Types are only available during runtime
import { Permissions, db, eq } from 'astro:db';
import type { Locals } from '../schemas/locals';
import { lucia } from 'studiocms-dashboard:auth';
import type { Session } from 'lucia';

type authHelperResponse = {
    username: string|null;
    name: string|null;
    email: string|null;
    avatar: string|null;
    githubURL: string|null;
    permissionLevel: 'admin'|'editor'|'visitor'|'unknown';
    currentUserSession: Session|undefined;
}

export default async function authHelper(locals: Locals): Promise<authHelperResponse> {
    const isLoggedIn = locals.isLoggedIn;
    
    if (isLoggedIn) {
        const sessionArray = await lucia.getUserSessions(locals.dbUser.id);
        const username = locals.dbUser.username;
        const name = locals.dbUser.name;
        const email = locals.dbUser.email;
        const avatar = locals.dbUser.avatar;
        const githubURL = locals.dbUser.githubURL;
        const currentUserSession = sessionArray[0];
        let permissionLevel: 'admin'|'editor'|'visitor'|'unknown' = 'unknown';
        const permissions = await db
            .select()
            .from(Permissions)
            .where(eq(Permissions.username, username))
            .catch(() => { permissionLevel = 'visitor'; });

        if (permissions[0] && permissions[0].username === username) {
            if (permissions[0].rank === 'admin') {
                permissionLevel = 'admin';
            }
            if (permissions[0].rank === 'editor') {
                permissionLevel = 'editor';
            }
            if (permissions[0].rank === 'visitor') {
                permissionLevel = 'visitor';
            }
        } else {
            permissionLevel = 'visitor';
        }
        return {
            username,
            name,
            email,
            avatar,
            githubURL,
            permissionLevel,
            currentUserSession
        }
    }
    return {
        username: null,
        name: null,
        email: null,
        avatar: null,
        githubURL: null,
        permissionLevel: 'unknown',
        currentUserSession: undefined
    }
}