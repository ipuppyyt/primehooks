import { BadgesList, CodeRunner } from "@components";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    Tabs,
    Tab,
    CodeRunner,
    Button,
    Input,
    BadgesList,
  };
}
