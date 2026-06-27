// Figma plugin (design-time scanner) — reference implementation.
//
// Runs inside Figma's sandbox. Walks the current page's node tree and applies
// the checks that ARE decidable from a design file: text contrast, text size,
// and touch-target dimensions. It maps each finding to the same issue shape the
// live-site scanner produces, then posts to the platform's /api/sites/ingest
// endpoint so design-time issues land in the same dashboard as live-site ones.
//
// This is intentionally a focused subset. A design file can't tell you whether
// alt text is meaningful or whether focus order is logical, so we don't pretend
// to — those remain live-site / manual concerns.

// --- WCAG contrast math -----------------------------------------------------

function srgbToLinear(c) {
  const x = c / 255;
  return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r, g, b) {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg.r * 255, fg.g * 255, fg.b * 255);
  const l2 = relativeLuminance(bg.r * 255, bg.g * 255, bg.b * 255);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// --- Issue collection -------------------------------------------------------

function makeIssue(partial) {
  return Object.assign(
    {
      ruleId: "",
      wcagRef: "",
      wcagLevel: "AA",
      severity: "MODERATE",
      needsReview: false,
      help: "",
      helpUrl: "",
      target: "",
      html: "",
    },
    partial,
  );
}

function firstSolidFill(fills) {
  if (!Array.isArray(fills)) return null;
  const solid = fills.find((f) => f.type === "SOLID" && f.visible !== false);
  return solid ? solid.color : null;
}

// Best-effort background: walk up parents for the nearest solid fill.
function findBackground(node) {
  let cur = node.parent;
  while (cur) {
    if ("fills" in cur) {
      const c = firstSolidFill(cur.fills);
      if (c) return c;
    }
    cur = cur.parent;
  }
  return { r: 1, g: 1, b: 1 }; // assume white canvas
}

function checkNode(node, issues) {
  // Text contrast + size
  if (node.type === "TEXT") {
    const fg = firstSolidFill(node.fills);
    const bg = findBackground(node);
    if (fg) {
      const ratio = contrastRatio(fg, bg);
      const fontSize = typeof node.fontSize === "number" ? node.fontSize : 16;
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && node.fontName && node.fontName.style && /bold/i.test(node.fontName.style));
      const threshold = isLarge ? 3 : 4.5;
      if (ratio < threshold) {
        issues.push(
          makeIssue({
            ruleId: "color-contrast",
            wcagRef: "1.4.3",
            wcagLevel: "AA",
            severity: ratio < threshold - 1.5 ? "SERIOUS" : "MODERATE",
            help: `Text contrast ${ratio.toFixed(2)}:1 is below the ${threshold}:1 minimum.`,
            target: node.name,
            html: node.characters ? node.characters.slice(0, 80) : node.name,
          }),
        );
      }
    }
    // Tiny text
    if (typeof node.fontSize === "number" && node.fontSize < 12) {
      issues.push(
        makeIssue({
          ruleId: "text-size",
          wcagRef: "1.4.4",
          wcagLevel: "AA",
          severity: "MINOR",
          help: `Text size ${node.fontSize}px is very small and may be hard to read.`,
          target: node.name,
          html: node.characters ? node.characters.slice(0, 80) : node.name,
        }),
      );
    }
  }

  // Touch target size for interactive-looking frames/components.
  const looksInteractive = /button|btn|link|cta|tab|chip/i.test(node.name || "");
  if (looksInteractive && "width" in node && "height" in node) {
    if (node.width < 24 || node.height < 24) {
      issues.push(
        makeIssue({
          ruleId: "target-size",
          wcagRef: "2.5.8",
          wcagLevel: "AA",
          severity: "MODERATE",
          help: `Target is ${Math.round(node.width)}×${Math.round(node.height)}px; WCAG 2.2 asks for at least 24×24px.`,
          target: node.name,
          html: node.name,
        }),
      );
    }
  }

  if ("children" in node) {
    for (const child of node.children) checkNode(child, issues);
  }
}

async function run() {
  const issues = [];
  for (const node of figma.currentPage.children) checkNode(node, issues);

  const payload = {
    siteId: "REPLACE_WITH_SITE_ID",
    source: "FIGMA",
    pages: [
      {
        url: figma.currentPage.name,
        title: figma.root.name,
        screenshotPath: null,
        issues,
      },
    ],
  };

  // Send to UI thread, which performs the fetch (network is sandboxed here).
  figma.showUI(__html__, { width: 360, height: 480 });
  figma.ui.postMessage({ type: "results", payload });
}

run();
