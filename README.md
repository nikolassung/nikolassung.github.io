# Nikolas Sung: personal site

Two pages, plain HTML, CSS, and JavaScript. No build step, so GitHub Pages serves it as-is.

- `index.html`: home page (bio, photo, icon links)
- `publications.html`: publications and honors thesis on top, presentations below

## Your photo
Save a portrait as `assets/images/headshot.jpg` (about 1000 x 1250 px, under 300 KB).
If part of your face is cropped, change `--photo-pos` at the top of `css/style.css`
(for example `40% 25%` or `65% 25%`) and save.

## Edit your content
- **Bio text, links, icons:** `index.html`
- **Presentations and in-review/in-prep papers:** `js/data.js` (copy a block, paste it at the top)
- **Thesis title and abstract:** `publications.html`
- **Navigation:** `NAV` list at the top of `js/main.js`
- **Colors and fonts:** the variables at the top of `css/style.css`

## Preview in VS Code
Install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".

## Publish
    git add .
    git commit -m "Update site"
    git push

## Note on your URL
Your repo is `niksung.github.io` under the account `nsung724`, so it is served at
`https://nsung724.github.io/niksung.github.io/`. All links here are relative, so that works.
For the shorter `https://nsung724.github.io/`, name the repo `nsung724.github.io`.
