# Static files deployed to URLs

- Places non-page files within the pages directory in order to deploy them to specific URLs.
  Then uses those files within pages.
- Uses the [`unprocessedPageFiles`] configuration option to cause a file that would otherwise be processed as a page to be treated as another static file.
- Uses the [`ignoreWithinPagesDirectory`] configuration option to cause non-page files within the pages directory, which would otherwise be copied as-is to the output directory, to be ignored.

[`unprocessedpagefiles`]: ../../docs/configuration.md#unprocessedpagefiles

[`ignorewithinpagesdirectory`]: ../../docs/configuration.md#ignorewithinpagesdirectory
