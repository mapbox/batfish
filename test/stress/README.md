## Heavy Site

For stress testing `batfish`.

### Usage

```bash
node ./scripts/generate-pages --numberOfPages=100 --maxPageSentences=200

node ./index start
# or
node ./index build
```

`numberOfPages` is the number of static pages to produce. Note each page is a randomly generated with lorem ipsum content.

`maxPageSentences` is the maximum number of lorem ipsum sentences. The script randomly generates sentences between 1 to `maxPageSentences`.
