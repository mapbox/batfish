---
title: Markdown Page
description: This is a basic Batfish example
published: true
summary: This is a Markdown page
modules:
  - import PageShell from '../components/page-shell';
---
{{<PageShell
    title="Markdown Page"
    description="This is a basic Batfish example">}}

<h1 class="customHeading">{{frontMatter.title}}</h1>

{{frontMatter.summary}}

**You can mix JSX with Markdown!**

{{</PageShell>}}
