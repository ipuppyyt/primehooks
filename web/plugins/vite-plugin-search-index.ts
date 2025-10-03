import { categoryOrderMap } from '../../docs';
import { type Plugin } from 'vite';
import matter from 'gray-matter';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  category: string;
}

interface NavItem {
  title: string;
  href: string;
  items?: NavItem[];
}

interface NavItemWithOrder {
  title: string;
  href: string;
  order?: number;
}

export function searchIndexPlugin(): Plugin {
  const virtualSearchModuleId = 'virtual:search-index';
  const resolvedSearchModuleId = '\0' + virtualSearchModuleId;

  const virtualNavModuleId = 'virtual:navigation';
  const resolvedNavModuleId = '\0' + virtualNavModuleId;

  async function generateData() {
    const contentDir = path.join(process.cwd(), '../docs');

    if (!fs.existsSync(contentDir)) {
      console.warn(`Content directory not found: ${contentDir}`);
      return { searchIndex: [], sidebarNav: [] };
    }

    const mdxFiles = await glob('**/*.mdx', {
      cwd: contentDir,
      absolute: true,
    });

    const searchIndex: SearchResult[] = [];
    const categoryMap = new Map<string, { order: number; items: NavItemWithOrder[] }>();


    for (const filePath of mdxFiles) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);
        const relativePath = path.relative(contentDir, filePath);

        const urlPath = relativePath
          .replace(/\.mdx$/, '')
          .replace(/\\/g, '/');

        const url = `/docs/${urlPath}`;

        let category = data.category;
        if (!category) {
          const pathParts = relativePath.split(/[/\\]/);
          if (pathParts.length > 1) {
            // If in a subfolder, use folder name as category
            const folderName = pathParts[0];
            category = folderName.charAt(0).toUpperCase() + folderName.slice(1);
          } else {
            category = 'Getting Started';
          }
        }

        const title = data.title || path.basename(filePath, '.mdx');
        const description = data.description || '';

        searchIndex.push({
          title,
          description,
          url,
          category,
        });

        const categoryOrder = data.categoryOrder ?? categoryOrderMap[category] ?? 999;

        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            order: categoryOrder,
            items: [],
          });
        }

        const categoryData = categoryMap.get(category)!;

        categoryData.items.push({
          title,
          href: url,
          order: data.order,
        });
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
      }
    }

    searchIndex.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.title.localeCompare(b.title);
    });

    const sidebarNav: NavItem[] = Array.from(categoryMap.entries())
      .map(([categoryName, data]) => ({
        title: categoryName,
        href: `/docs/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
        order: data.order,
        items: data.items
          .sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            return a.title.localeCompare(b.title);
          })
          .map(({ title, href }) => ({ title, href })),
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => a.order - b.order)
      .map(({ title, href, items }) => ({ title, href, items }));

    return { searchIndex, sidebarNav };
  }

  return {
    name: 'vite-plugin-search-index',

    resolveId(id) {
      if (id === virtualSearchModuleId) {
        return resolvedSearchModuleId;
      }
      if (id === virtualNavModuleId) {
        return resolvedNavModuleId;
      }
    },

    async load(id) {
      if (id === resolvedSearchModuleId) {
        const { searchIndex } = await generateData();

        return `
export const searchIndex = ${JSON.stringify(searchIndex)};

export function searchDocs(query) {
  if (!query || query.trim() === '') {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  return searchIndex.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = item.description.toLowerCase().includes(lowerQuery);
    const categoryMatch = item.category.toLowerCase().includes(lowerQuery);

    return titleMatch || descriptionMatch || categoryMatch;
  });
}
        `;
      }

      if (id === resolvedNavModuleId) {
        const { sidebarNav } = await generateData();

        return `
export const sidebarNav = ${JSON.stringify(sidebarNav)};
        `;
      }
    },

    async handleHotUpdate({ file, server }) {
      // Regenerate when MDX files change
      if (file.endsWith('.mdx') && file.includes('docs')) {
        const searchModule = server.moduleGraph.getModuleById(resolvedSearchModuleId);
        const navModule = server.moduleGraph.getModuleById(resolvedNavModuleId);

        if (searchModule) {
          server.moduleGraph.invalidateModule(searchModule);
        }
        if (navModule) {
          server.moduleGraph.invalidateModule(navModule);
        }

        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
      }
    },
  };
}
