"use client";

// The issue inspector — signature screen. Left: the captured page screenshot
// with each issue drawn as an overlay box scaled to the rendered image. Right:
// a Spectrum issue list where selecting an item highlights its box and reveals
// the WCAG criterion, plain-language fix, and offending markup. Boxes are
// keyboard-focusable buttons. Spectrum supplies the surrounding components
// (Badge, Well, Link, Divider) so it reads as part of the system.

import { useRef, useState, useLayoutEffect } from "react";
import { Flex, View, Text, Well, Divider, Link } from "@adobe/react-spectrum";
import { SeverityBadge, ReviewBadge, WcagTag } from "@/components/ui/primitives";
import type { Severity } from "@prisma/client";

export interface InspectorIssue {
  id: string;
  ruleId: string;
  wcagRef: string;
  wcagLevel: string;
  severity: Severity;
  needsReview: boolean;
  help: string;
  helpUrl: string | null;
  target: string;
  html: string;
  boxX: number | null;
  boxY: number | null;
  boxW: number | null;
  boxH: number | null;
}

const SEV_BOX: Record<Severity, string> = {
  CRITICAL: "var(--spectrum-negative-color-900, #d31510)",
  SERIOUS: "var(--spectrum-orange-900, #d4500a)",
  MODERATE: "var(--spectrum-notice-color-900, #d97706)",
  MINOR: "var(--spectrum-gray-500, #909090)",
};

// Screenshots are captured at this viewport width (see scanner.ts).
const CAPTURE_WIDTH = 1280;

export function IssueInspector({
  screenshotPath,
  issues,
}: {
  screenshotPath: string | null;
  issues: InspectorIssue[];
}) {
  const [selected, setSelected] = useState<string | null>(issues[0]?.id ?? null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    function measure() {
      if (imgWrapRef.current) {
        setScale(imgWrapRef.current.clientWidth / CAPTURE_WIDTH);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Flex direction={{ base: "column", L: "row" }} gap="size-300" alignItems="start">
      {/* Screenshot with overlays */}
      <View
        flex
        borderWidth="thin"
        borderColor="gray-300"
        borderRadius="medium"
        overflow="hidden"
        UNSAFE_style={{ background: "var(--spectrum-gray-75)" }}
        width="100%"
      >
        <div ref={imgWrapRef} style={{ position: "relative", width: "100%" }}>
          {screenshotPath ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={screenshotPath} alt="Captured page" style={{ display: "block", width: "100%" }} />
          ) : (
            <Flex height="size-3600" alignItems="center" justifyContent="center">
              <Text UNSAFE_style={{ color: "var(--spectrum-gray-500)" }}>
                No screenshot for this source.
              </Text>
            </Flex>
          )}

          {screenshotPath &&
            issues.map((issue) => {
              if (issue.boxX == null || issue.boxY == null || issue.boxW == null || issue.boxH == null)
                return null;
              const isSel = issue.id === selected;
              const color = SEV_BOX[issue.severity];
              return (
                <button
                  key={issue.id}
                  onClick={() => setSelected(issue.id)}
                  aria-label={`Issue: ${issue.ruleId}, ${issue.severity.toLowerCase()}`}
                  aria-pressed={isSel}
                  style={{
                    position: "absolute",
                    left: issue.boxX * scale,
                    top: issue.boxY * scale,
                    width: issue.boxW * scale,
                    height: issue.boxH * scale,
                    border: `2px solid ${color}`,
                    background: isSel ? `${color}22` : "transparent",
                    boxShadow: isSel ? `0 0 0 3px ${color}33` : "none",
                    zIndex: isSel ? 10 : 1,
                    cursor: "pointer",
                    padding: 0,
                  }}
                />
              );
            })}
        </div>
      </View>

      {/* Issue list + detail */}
      <View width={{ base: "100%", L: "size-4600" }} UNSAFE_style={{ flexShrink: 0 }}>
        <Text UNSAFE_style={{ color: "var(--spectrum-gray-600)", fontSize: 14 }}>
          {issues.length} issues
        </Text>
        <Flex direction="column" gap="size-100" marginTop="size-150" UNSAFE_style={{ maxHeight: "70vh", overflow: "auto" }}>
          {issues.map((issue) => {
            const isSel = issue.id === selected;
            return (
              <View
                key={issue.id}
                borderWidth="thin"
                borderColor={isSel ? "blue-400" : "gray-300"}
                borderRadius="medium"
                backgroundColor={isSel ? "blue-100" : "gray-50"}
                UNSAFE_style={{ overflow: "hidden" }}
              >
                <button
                  onClick={() => setSelected(issue.id)}
                  aria-expanded={isSel}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: 0,
                    padding: 12,
                    cursor: "pointer",
                  }}
                >
                  <Flex gap="size-100" alignItems="center" wrap>
                    <SeverityBadge severity={issue.severity} />
                    {issue.needsReview && <ReviewBadge />}
                    <Text UNSAFE_style={{ fontFamily: "monospace", fontSize: 12, color: "var(--spectrum-gray-700)" }}>
                      {issue.ruleId}
                    </Text>
                  </Flex>
                  <Text UNSAFE_style={{ display: "block", marginTop: 8, fontSize: 14, color: "var(--spectrum-gray-800)" }}>
                    {issue.help}
                  </Text>

                  {isSel && (
                    <View marginTop="size-150">
                      <Divider size="S" marginBottom="size-150" />
                      <Flex direction="column" gap="size-100">
                        <WcagTag wcagRef={issue.wcagRef} level={issue.wcagLevel} />
                        <Text UNSAFE_style={{ fontFamily: "monospace", fontSize: 12, color: "var(--spectrum-gray-600)", wordBreak: "break-all" }}>
                          {issue.target}
                        </Text>
                        <Well UNSAFE_style={{ background: "var(--spectrum-gray-900)", color: "var(--spectrum-gray-50)", fontFamily: "monospace", fontSize: 12, overflow: "auto" }}>
                          {issue.html}
                        </Well>
                        {issue.helpUrl && (
                          <Link>
                            <a href={issue.helpUrl} target="_blank" rel="noreferrer">
                              How to fix this
                            </a>
                          </Link>
                        )}
                      </Flex>
                    </View>
                  )}
                </button>
              </View>
            );
          })}
        </Flex>
      </View>
    </Flex>
  );
}
