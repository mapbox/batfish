## Heavy Site

This example is used for stress testing `batfish`. Please look at other examples for a user land examples.

### Usage

```bash
node scripts/generate-pages --numberOfPages=100 --maxPageSentences=200

npm run batfish start
# or
npm run batfish build
```

`numberOfPages` is the number of static pages to produce. Note each page is a randomly generated with lorem ipsum content.

`maxPageSentences` is the maximum number of lorem ipsum sentences. The script randomly generates sentences between 1 to `maxPageSentences`.
