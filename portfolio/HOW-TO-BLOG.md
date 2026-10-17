# How to publish a blog post (no tech setup needed)

Your posts are plain Markdown files in **`portfolio/content/blog/`**. Add one and the
site picks it up automatically on the next deploy — no code, no commands.

The easiest way is **straight from GitHub.com in your browser.**

## Publish a new post (the simple way)

1. Go to **github.com/HUNT-001/HUNT-001** → open the folder **`portfolio/content/blog/`**.
2. Click **Add file → Create new file**.
3. Name it something like `my-new-post.md` (lowercase, words joined by hyphens — this
   becomes the URL: `/writing/my-new-post`).
4. Open **`_TEMPLATE.md`** in that same folder, copy everything in it, and paste it into
   your new file.
5. Change the top block (between the `---` lines) and write your post below it:
   - **title** — the headline.
   - **type** — one of: `Case study`, `Project write-up`, `Technical blog`, `Data story`.
   - **date** — `YYYY-MM-DD` (newest posts show first).
   - **read** — rough reading time, e.g. `6 min`.
   - **tags** — a few keywords in `[ ]`.
   - **summary** — the one-line teaser shown on the card.
6. Scroll down, click **Commit changes**.

That's it. Vercel redeploys on its own in ~1 minute, and the post appears on
`/writing` and the homepage.

## Edit or delete a post

- **Edit:** open the file on GitHub → click the pencil ✏️ → change it → **Commit changes**.
- **Delete:** open the file → the **⋯** menu → **Delete file** → **Commit changes**.

## Rules of thumb

- Keep the top block (the part between `---`) intact — the site reads it.
- A **blank line** separates paragraphs.
- Files starting with `_` (like `_TEMPLATE.md`) are ignored, so the template never
  shows up as a real post.
- Want it featured on the homepage? The three **newest** posts show there automatically.

## If you'd rather use your computer

Drop a `.md` file into `portfolio/content/blog/`, then:

```bash
git add portfolio/content/blog/
git commit -m "New post: my-new-post"
git push
```
