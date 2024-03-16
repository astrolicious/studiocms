## AstroDB / Studio CMS Prototype

This is a SSR Blog CMS built with AstroDB / Lucia Auth / Cloudinary CDN / Astro

### Authentication

Lucia Auth - requires two .env tokens

```
# credentials for GitHub OAuth App
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Images - CDN

Cloudinary - Requires one .env token

```
CLOUDINARY_CLOUD_NAME=
```

### Add githubUsername's to seed file who you want to be an admin(be able to create posts and edit)!