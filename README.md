# TechToolSnap

Free, fast, and secure online tools. All processing happens entirely in your browser. Your files never leave your device.

## Features Built So Far
- Initial Project Setup (Next.js 15 App Router, Tailwind CSS, TypeScript, Static Export configured)
- Tools Configuration System (`src/tools.config.ts`)
- Reusable UI Components: `ToolLayout`, `FileDropzone`, `FAQ`, `AdSlot`
- 1st Tool: `/compress-image-to-100kb` (Using `browser-image-compression`)
- SEO-ready metadata and routing

## How to Run Locally

Since Next.js 15 uses React 19 by default and `browser-image-compression` might have peer dependency issues, it's recommended to install with `--legacy-peer-deps`:

```bash
cd techtoolsnap
npm install --legacy-peer-deps
npm run dev
```

Visit `http://localhost:3000` to see the site.

## How to Add a Tool

1. Open `src/tools.config.ts` and add a new entry to the `tools` array with a slug, title, description, keywords, and FAQs.
2. Create a new directory under `src/app/` matching your tool's slug (e.g., `src/app/my-new-tool/`).
3. Create a `page.tsx` inside that directory. Import `ToolLayout` and build your tool's UI using standard React components.
4. If your tool needs complex logic, create a client component in `src/components/tools/` and import it into your page.

## Deployment (Free on Cloudflare Pages / Vercel)

This project is configured for static export (`output: 'export'` in `next.config.ts`).

**To Vercel:**
1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Vercel will automatically detect Next.js and build it. (If you face errors with static export on Vercel, you can remove `output: 'export'` from `next.config.ts` as Vercel handles Next.js natively).

**To Cloudflare Pages:**
1. Push to GitHub.
2. Go to Cloudflare Pages -> Create a project -> Connect to Git.
3. Select your repository.
4. Build command: `npm run build`
5. Build output directory: `out`
6. Click Save and Deploy.
