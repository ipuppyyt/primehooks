import { remarkImage, remarkMdxFiles } from "fumadocs-core/mdx-plugins";
import { remarkTypeScriptToJavaScript } from "fumadocs-docgen/remark-ts2js";
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkPlugins: [remarkTypeScriptToJavaScript, remarkMdxFiles, remarkImage],
  },
});
