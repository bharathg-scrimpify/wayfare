# Continue in Claude Code

From the project folder:

```bash
cd wayfare
npm install
claude
```

Then paste:

> Read CLAUDE.md and docs/Product_Document.xlsx. Use the taste-skill and ui-ux-pro-max skills. Run `npm run dev`, open the app, and do a design review pass: list the 10 weakest moments for a client demo, fix them in order, and run `npm run build` after each batch.

Good next tasks:
1. Replace placeholder photos in `src/lib/images.ts` with curated licensed images.
2. Real drag-and-drop between days in the itinerary.
3. Dark mode tokens (taste-skill requires both modes for consumer pages).
4. Code-split routes with `React.lazy`.
5. Add a Switzerland trip to prove multi-destination beyond London.
