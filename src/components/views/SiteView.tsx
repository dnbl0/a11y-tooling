"use client";

// Site detail UI on Spectrum: latest-score card, scan history table, and a
// pages table that deep-links into the inspector. Breadcrumbs use Spectrum's
// Breadcrumbs for accessible back-navigation.

import {
  View,
  Flex,
  Grid,
  Heading,
  Text,
  Link,
  Breadcrumbs,
  Item,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
} from "@adobe/react-spectrum";
import { useRouter } from "next/navigation";
import type { ReactNode, Key } from "react";
import type { ScanSource, ScanStatus } from "@prisma/client";

const SOURCE_LABEL: Record<ScanSource, string> = {
  LIVE_SITE: "Live site",
  FIGMA: "Figma",
  COMPONENT: "Components",
};

interface ScanRow {
  id: string;
  source: ScanSource;
  status: ScanStatus;
  score: number | null;
  startedAt: string;
  pageCount: number;
  issueCount: number;
}

interface PageRow {
  id: string;
  scanId: string;
  url: string;
  title: string | null;
  score: number | null;
  issueCount: number;
}

export function SiteView({
  name,
  baseUrl,
  ring,
  scanRows,
  pageRows,
}: {
  name: string;
  baseUrl: string;
  ring: ReactNode | null;
  scanRows: ScanRow[];
  pageRows: PageRow[];
}) {
  const router = useRouter();

  return (
    <View padding="size-500" maxWidth="1200px">
      <Breadcrumbs onAction={(key: Key) => key === "dashboard" && router.push("/dashboard")}>
        <Item key="dashboard">Dashboard</Item>
        <Item key="site">{name}</Item>
      </Breadcrumbs>

      <Heading level={1} marginTop="size-200" marginBottom="size-50">
        {name}
      </Heading>
      <Link>
        <a href={baseUrl} target="_blank" rel="noreferrer">
          {baseUrl}
        </a>
      </Link>

      <Grid columns={{ base: ["1fr"], M: ["1fr", "2fr"] }} gap="size-300" marginTop="size-400">
        <Card>
          <Flex direction="column" alignItems="center" justifyContent="center" height="100%" minHeight="size-2400">
            {ring ?? <Text UNSAFE_style={{ color: "var(--spectrum-gray-500)" }}>No completed scans yet.</Text>}
          </Flex>
        </Card>

        <Card>
          <Heading level={3} marginTop={0} marginBottom="size-200">
            Scan history
          </Heading>
          {scanRows.length === 0 ? (
            <Text UNSAFE_style={{ color: "var(--spectrum-gray-500)" }}>No scans yet.</Text>
          ) : (
            <TableView aria-label="Scan history" density="compact">
              <TableHeader>
                <Column>Source</Column>
                <Column>Started</Column>
                <Column align="end">Pages</Column>
                <Column align="end">Issues</Column>
                <Column align="end">Score</Column>
              </TableHeader>
              <TableBody>
                {scanRows.map((s) => (
                  <Row key={s.id}>
                    <Cell>{SOURCE_LABEL[s.source]}</Cell>
                    <Cell>{s.startedAt}</Cell>
                    <Cell>{s.pageCount}</Cell>
                    <Cell>{s.issueCount}</Cell>
                    <Cell>{s.score ?? "—"}</Cell>
                  </Row>
                ))}
              </TableBody>
            </TableView>
          )}
        </Card>
      </Grid>

      {pageRows.length > 0 && (
        <View marginTop="size-500">
          <Heading level={2} marginBottom="size-200">
            Pages in latest scan
          </Heading>
          <TableView
            aria-label="Pages in latest scan"
            selectionMode="single"
            onAction={(key: Key) => {
              const row = pageRows.find((p) => p.id === key);
              if (row) router.push(`/scans/${row.scanId}?page=${row.id}`);
            }}
            density="spacious"
          >
            <TableHeader>
              <Column>Page</Column>
              <Column>URL</Column>
              <Column align="end">Issues</Column>
              <Column align="end">Score</Column>
            </TableHeader>
            <TableBody>
              {pageRows.map((p) => (
                <Row key={p.id}>
                  <Cell>{p.title || p.url}</Cell>
                  <Cell>{p.url}</Cell>
                  <Cell>{p.issueCount}</Cell>
                  <Cell>{p.score ?? "—"}</Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        </View>
      )}
    </View>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <View
      backgroundColor="gray-50"
      borderWidth="thin"
      borderColor="gray-300"
      borderRadius="medium"
      padding="size-300"
      UNSAFE_style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {children}
    </View>
  );
}
