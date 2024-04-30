import { defineConfig, squooshImageService } from 'astro/config'
import icon from 'astro-icon'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  site: 'https://astro-studiocms.xyz',
  image: {
    service: squooshImageService(),
    remotePatterns: [
      {
        protocol: 'https',
      },
    ],
  },
  integrations: [icon(), tailwind()],
})
