# CSS updates

In order to update CSS, you will need to modify the JSON file(s) in `_data/`. Then, run the `jsonToCss.mjs` script to update or create new CSS files. For example:

```js
npm run dev:transform-json
```

Although it may seem tedius, doing so eliminates the duplicate task of sync'ing CSS files and JSON files. JSON files are used by the templating system to populate information in HTML pages.
If you are adding **new CSS** files, don't forget to add an import statement in `css/styles.css`.
