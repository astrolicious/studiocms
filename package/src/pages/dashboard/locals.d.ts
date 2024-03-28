export type Locals = {
    isLoggedIn: boolean;
    dbUser: {
      id: string;
      url: string | null;
      name: string;
      email: string | null;
      avatar: string | null;
      githubId: number;
      githubURL: string | null;
      username: string;
      updatedAt: Date | null;
      createdAt: Date | null;
    };
    user: {
      id: number;
      username: string;
      githubId: number;
    };
    runtime: {
      env: {
        CMS_GITHUB_CLIENT_ID: string;
        CMS_GITHUB_CLIENT_SECRET: string;
        CMS_CLOUDINARY_CLOUDNAME: string;
      }
    }
};