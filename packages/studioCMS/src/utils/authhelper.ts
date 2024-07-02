import { Permissions, db, eq } from 'astro:db';
import type { Locals } from '../schemas/locals';
import { lucia } from 'studiocms-dashboard:auth';
import type { Session } from 'lucia';

type authHelperResponse = {
    id: string;
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
        if (locals.dbUser) {
            const sessionArray = await lucia.getUserSessions(locals.dbUser.id);
            const id = locals.dbUser.id;
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
                .get()
    
            if (permissions) {
                if (permissions && permissions.username === username) {
                    if (permissions.rank === 'admin') {
                        permissionLevel = 'admin';
                    }
                    if (permissions.rank === 'editor') {
                        permissionLevel = 'editor';
                    }
                    if (permissions.rank === 'visitor') {
                        permissionLevel = 'visitor';
                    }
                } else {
                    permissionLevel = 'visitor';
                }
            }
            return {
                id,
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
            id: '',
            username: null,
            name: null,
            email: null,
            avatar: null,
            githubURL: null,
            permissionLevel: 'unknown',
            currentUserSession: undefined
        }
    }
    return {
        id: '',
        username: null,
        name: null,
        email: null,
        avatar: null,
        githubURL: null,
        permissionLevel: 'unknown',
        currentUserSession: undefined
    }
}