import { z } from "astro/zod";

export const optionsSchema = z.object({
    /**
     * The Title of the Site
     */
    siteTitle: z.string().optional().default("Astro Studio Blog"),
    /**
     * The Description of the Site
     */
    siteDescription: z.string().optional().default("Welcome to my website!"),
    /** 
     * The GitHub Usernames that can have Admin Roles on this install 
     * @example ["Adammatthiesen", "ElianCodes"]
      */
    siteAdmins: z.array(z.string()).optional().default(['developer']),
    disableAuth: z.boolean().optional().default(false),
    verbose: z.boolean().optional().default(false),
});

export type Options = z.infer<typeof optionsSchema>;