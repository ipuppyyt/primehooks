import { Breadcrumb } from "@components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageImage, source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  async function getRepoLastUpdate() {
    const response = await fetch(
      "https://api.github.com/repos/ipuppyyt/primehooks",
      {
        next: { revalidate: 3600 },
      },
    );
    const data = await response.json();
    return new Date(data.pushed_at);
  }

  const lastUpdate = await getRepoLastUpdate();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        enabled: true,
        style: "clerk",
      }}
      breadcrumb={{
        enabled: true,
        component: <Breadcrumb tree={source.pageTree} />,
      }}
      editOnGithub={{
        owner: "ipuppyyt",
        repo: "primehooks",
        sha: "main",
        path: `docs/content/docs/${page.path}`,
      }}
      lastUpdate={
        page.data.lastModified ? new Date(page.data.lastModified) : lastUpdate
      }
      full={page.data.full}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}

export const runtime = 'edge';