---
title: Appropriate images
description: Another basic Batfish example.
prependJs:
- "import AppropriateImage from '../components/appropriate-image';"
---

# {{ props.frontMatter.title }}

{{
  <AppropriateImage
    imageId="header-image"
    alt="If you can read this then the image did not load :("
  />
}}
