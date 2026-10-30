# Repository illustrations

The research-map and learning-transfer figures are original explanatory diagrams, available in English and Chinese. They illustrate the collection's scope; they do not report experimental findings.

- `research-map.en.svg` / `research-map.zh.svg`: one research situation, four capabilities, and the artifact each produces.
- `learning-transfer.en.svg` / `learning-transfer.zh.svg`: improvement within one task and evidence of improvement on a new task.
- `social-preview.svg`: editable source for the repository sharing card.
- `social-preview.png`: 1200 × 630 PNG ready for GitHub's repository social-preview setting.

Edit the labels and layout in `scripts/build-figures.mjs`, then run from the repository root:

```sh
node scripts/build-figures.mjs
node scripts/build-figures.mjs --check
```

The SVGs use local system fonts, include accessible titles and descriptions, and have no external image or script dependencies. README image alt text supplies a prose equivalent.

The PNG is a raster export of `social-preview.svg`. If the sharing card changes, re-export it at 1200 × 630 with an SVG-capable renderer and inspect the result. The Node check validates the SVG sources and generated files; it does not regenerate or verify the PNG.

Original artwork is covered by the repository's MIT License.
