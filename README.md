# my-personal-website

Eva Yang's personal site: an animated one-page portfolio built with Next.js, TypeScript and Framer Motion, exported as static files and hosted on GitHub Pages.

## Edit the content

All text lives in [`content/site.ts`](content/site.ts). Anything marked `placeholder: true` shows a dashed **placeholder** badge on the page; replace the text and delete the flag when it is real. Contact buttons (email, LinkedIn, résumé) appear only once you fill in those fields.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages at `https://yangkeren0720.github.io/my-personal-website/`.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

## What's animated

- Hero: letter-by-letter name reveal, rotating role, drifting gradient blobs with scroll parallax
- Scroll progress bar, pointer-following glow, nav pill that slides to the current section
- Sections fade up as they enter; stats count up; the experience timeline draws itself as you scroll
- Featured project showcase that auto-cycles through animated mock screens
- Tilt-and-glow project cards, a two-way skills marquee, and a magnetic contact button

Animations are reduced for visitors who turn on "reduce motion" in their OS.
