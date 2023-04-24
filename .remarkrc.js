// replaces remark-preset-davidtheclark

const remarkFrontmatter =require('remark-frontmatter')
const remarkValidateLinks =require('remark-validate-links')
const remarkToc =require('remark-toc')
const remarkLintBlockquoteIndentation =require('remark-lint-blockquote-indentation')
const remarkLintFileExtension =require('remark-lint-file-extension')
const remarkLintFinalDefinition =require('remark-lint-final-definition')
const remarkLintNoDuplicateDefinitions =require('remark-lint-no-duplicate-definitions')
const remarkLintNoMultipleToplevelHeadings =require('remark-lint-no-multiple-toplevel-headings')
const remarkLintNoTabs =require('remark-lint-no-tabs')
const remarkLintNoUndefinedReferences =require('remark-lint-no-undefined-references')

exports.settings = {
    listItemIndent: 1,
    emphasis: '*',
    strong: '*',
    bullet: '-',
    fences: true
};

exports.plugins = [
    remarkFrontmatter,
    remarkValidateLinks,
    [remarkToc, { maxDepth: 3, tight: true }],
    [remarkLintBlockquoteIndentation, 2],
    [remarkLintFileExtension, 'md'],
    remarkLintFinalDefinition,
    remarkLintNoDuplicateDefinitions,
    remarkLintNoMultipleToplevelHeadings,
    remarkLintNoTabs,
    remarkLintNoUndefinedReferences,
];

