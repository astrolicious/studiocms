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
};