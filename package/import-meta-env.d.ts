interface ImportMetaEnv {
    readonly CMS_GITHUB_CLIENT_ID: string;
    readonly CMS_GITHUB_CLIENT_SECRET: string;
    readonly CMS_CLOUDINARY_CLOUDNAME: string;
    readonly PROD: boolean;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }