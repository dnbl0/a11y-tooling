"use client";

// Dashboard UI built on Spectrum. The page-level Server Component fetches data
// and passes plain props + the (server-rendered) chart elements as children;
// this client component arranges them with Spectrum layout + an interactive
// TableView for the site list (keyboard nav and row selection come for free).

import {
  Grid,
  View,
  Flex,
  Heading,
  Text,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  IllustratedMessage,
  Content,
} from "@adobe/react-spectrum";
import { useRouter } from "next/navigation";
import type { ReactNode, Key } from "react";
import type { Severity, ScanSource } from "@prisma/client";

const SOURCE_LABEL: Record<ScanSource, string> = {
  LIVE_SITE: "Live site",
  FIGMA: "Figma",
  COMPONENT: "Components",
};

interface SiteRow {
  id: string;
  name: string;
  baseUrl: string;
  source: ScanSource | null;
  score: number | null;
}

export function DashboardView({
  siteCount,
  overall,
  sevCounts,
  totalIssues,
  siteRows,
  ring,
  trend,
  trendCount,
}: {
  siteCount: number;
  overall: number;
  sevCounts: Record<Severity, number>;
  totalIssues: number;
  siteRows: SiteRow[];
  ring: ReactNode;
  trend: ReactNode | null;
  trendCount: number;
}) {
  const router = useRouter();

  return (
    <View padding="size-500" maxWidth="1200px">
      <Heading level={1} marginBottom="size-50">
        Dashboard
      </Heading>
      <Text UNSAFE_style={{ color: "var(--spectrum-gray-600)" }}>
        Accessibility across {siteCount} {siteCount === 1 ? "site" : "sites"}, design and live.
      </Text>

      <Grid
        columns={{ base: ["1fr"], M: ["1fr", "2fr"] }}
        gap="size-300"
        marginTop="size-400"
      >
        <Card>
          <Flex direction="column" alignItems="center" justifyContent="center" height="100%">
            {ring}
            <Text marginTop="size-200" UNSAFE_style={{ color: "var(--spectrum-gray-600)", textAlign: "center" }}>
              Weighted across all latest scans
            </Text>
          </Flex>
        </Card>

        <Card>
          <Flex justifyContent="space-between" alignItems="center" marginBottom="size-200">
            <Heading level={3} margin={0}>
              Score over time
            </Heading>
            <Text UNSAFE_style={{ fontSize: 12, color: "var(--spectrum-gray-500)" }}>
              {trendCount} scans
            </Text>
          </Flex>
          {trend ?? (
            <Flex height="size-2400" alignItems="center" justifyContent="center">
              <Text UNSAFE_style={{ color: "var(--spectrum-gray-500)" }}>
                Run more than one scan to see a trend.
              </Text>
            </Flex>
          )}
        </Card>
      </Grid>

      <Grid
        columns={{ base: ["1fr", "1fr"], M: ["1fr", "1fr", "1fr", "1fr"] }}
        gap="size-300"
        marginTop="size-300"
      >
        <Stat label="Critical" count={sevCounts.CRITICAL} tone="var(--spectrum-negative-color-900, #d31510)" />
        <Stat label="Serious" count={sevCounts.SERIOUS} tone="var(--spectrum-orange-900, #d4500a)" />
        <Stat label="Moderate" count={sevCounts.MODERATE} tone="var(--spectrum-notice-color-900, #d97706)" />
        <Stat label="Minor" count={sevCounts.MINOR} tone="var(--spectrum-gray-600, #6e6e6e)" />
      </Grid>

      <View marginTop="size-500" id="sites">
        <Heading level={2} marginBottom="size-200">
          Sites
        </Heading>

        {siteRows.length === 0 ? (
          <Card>
            <IllustratedMessage>
              <Heading>No sites yet</Heading>
              <Content>
                Run <code>npm run db:seed</code> to load sample data, then start the worker.
              </Content>
            </IllustratedMessage>
          </Card>
        ) : (
          <TableView
            aria-label="Sites"
            selectionMode="single"
            onAction={(key: Key) => router.push(`/sites/${key}`)}
            density="spacious"
          >
            <TableHeader>
              <Column>Site</Column>
              <Column>URL</Column>
              <Column align="end">Source</Column>
              <Column align="end">Score</Column>
            </TableHeader>
            <TableBody>
              {siteRows.map((s) => (
                <Row key={s.id}>
                  <Cell>{s.name}</Cell>
                  <Cell>{s.baseUrl}</Cell>
                  <Cell>{s.source ? SOURCE_LABEL[s.source] : "—"}</Cell>
                  <Cell>{s.score ?? "—"}</Cell>
                </Row>
              ))}
            </TableBody>
          </TableView>
        )}
      </View>

      {totalIssues > 0 && (
        <Text marginTop="size-300" UNSAFE_style={{ fontSize: 12, color: "var(--spectrum-gray-500)", display: "block" }}>
          {totalIssues} total issues recorded. Issues marked &ldquo;needs review&rdquo; require human
          verification and are not counted as automatic failures.
        </Text>
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

function Stat({ label, count, tone }: { label: string; count: number; tone: string }) {
  return (
    <Card>
      <Text UNSAFE_style={{ color: "var(--spectrum-gray-600)", fontSize: 14 }}>{label}</Text>
      <div style={{ marginTop: 4, fontSize: 30, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: tone }}>
        {count}
      </div>
    </Card>
  );
}
