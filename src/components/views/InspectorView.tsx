"use client";

// Inspector page chrome on Spectrum: breadcrumbs back to the site, a page
// header with score, and a page switcher (when a scan covers multiple pages)
// built from Spectrum's accessible Tabs. The inspector itself does the heavy
// lifting of overlay rendering.

import {
  View,
  Heading,
  Text,
  Flex,
  Breadcrumbs,
  Item,
  Tabs,
  TabList,
} from "@adobe/react-spectrum";
import { useRouter } from "next/navigation";
import type { Key } from "react";
import { IssueInspector, type InspectorIssue } from "@/components/IssueInspector";

interface PageMeta {
  id: string;
  url: string;
  title: string | null;
  score: number | null;
}

export function InspectorView({
  scanId,
  siteId,
  siteName,
  pages,
  activePageId,
  screenshotPath,
  issues,
}: {
  scanId: string;
  siteId: string;
  siteName: string;
  pages: PageMeta[];
  activePageId: string | null;
  screenshotPath: string | null;
  issues: InspectorIssue[];
}) {
  const router = useRouter();
  const active = pages.find((p) => p.id === activePageId) ?? pages[0] ?? null;

  if (!active) {
    return (
      <View padding="size-500">
        <Text UNSAFE_style={{ color: "var(--spectrum-gray-500)" }}>This scan has no pages.</Text>
      </View>
    );
  }

  return (
    <View padding="size-500" maxWidth="1200px">
      <Breadcrumbs
        onAction={(key: Key) => {
          if (key === "dashboard") router.push("/dashboard");
          if (key === "site") router.push(`/sites/${siteId}`);
        }}
      >
        <Item key="dashboard">Dashboard</Item>
        <Item key="site">{siteName}</Item>
        <Item key="page">{active.title || active.url}</Item>
      </Breadcrumbs>

      <Heading level={1} marginTop="size-200" marginBottom="size-50">
        {active.title || active.url}
      </Heading>
      <Flex gap="size-150" alignItems="center">
        <Text UNSAFE_style={{ color: "var(--spectrum-gray-600)", fontSize: 14 }}>{active.url}</Text>
        <Text UNSAFE_style={{ color: "var(--spectrum-gray-400)" }}>·</Text>
        <Text UNSAFE_style={{ fontWeight: 600, fontSize: 14 }}>Score {active.score ?? "—"}</Text>
      </Flex>

      {pages.length > 1 && (
        <View marginTop="size-300">
          <Tabs
            aria-label="Pages in scan"
            selectedKey={active.id}
            onSelectionChange={(key) => router.push(`/scans/${scanId}?page=${key}`)}
          >
            <TabList>
              {pages.map((p) => (
                <Item key={p.id}>{p.title || p.url}</Item>
              ))}
            </TabList>
          </Tabs>
        </View>
      )}

      <View marginTop="size-300">
        <IssueInspector screenshotPath={screenshotPath} issues={issues} />
      </View>
    </View>
  );
}
