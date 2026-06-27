"use client";

// App frame built from Spectrum primitives (Spectrum has no single app-shell
// component). A persistent sidebar + main content region using Flex/View, with
// active-route styling driven by the current pathname. Spectrum's own design
// tokens (CSS custom properties) are used for colour so it tracks the theme.

import { Flex, View } from "@adobe/react-spectrum";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import type { ReactNode } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard#sites", label: "Sites" },
  { href: "/dashboard#reports", label: "Reports" },
];

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <NextLink
      href={href}
      style={{
        display: "block",
        padding: "8px 12px",
        borderRadius: 8,
        textDecoration: "none",
        fontSize: 14,
        color: active
          ? "var(--spectrum-gray-900)"
          : "var(--spectrum-gray-700)",
        background: active ? "var(--spectrum-gray-200)" : "transparent",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </NextLink>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <Flex direction="row" minHeight="100vh">
      <View
        width="size-3000"
        backgroundColor="gray-100"
        borderEndWidth="thin"
        borderEndColor="gray-300"
        UNSAFE_style={{ flexShrink: 0 }}
      >
        <Flex direction="column" height="100%">
          <View padding="size-300" borderBottomWidth="thin" borderBottomColor="gray-300">
            <Flex direction="row" alignItems="center" gap="size-100">
              <View
                width="size-350"
                height="size-350"
                borderRadius="small"
                UNSAFE_style={{
                  background: "var(--spectrum-gray-900)",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                A
              </View>
              <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>
                Auditr
              </span>
            </Flex>
          </View>

          <View padding="size-150" flex>
            <Flex direction="column" gap="size-50">
              {NAV.map((n) => (
                <NavItem
                  key={n.label}
                  href={n.href}
                  label={n.label}
                  active={pathname === n.href.split("#")[0] && n.href === "/dashboard"}
                />
              ))}
            </Flex>
          </View>

          <View
            padding="size-300"
            borderTopWidth="thin"
            borderTopColor="gray-300"
            UNSAFE_style={{ fontSize: 12, color: "var(--spectrum-gray-500)" }}
          >
            Built on Adobe Spectrum
          </View>
        </Flex>
      </View>

      <View flex minWidth={0} UNSAFE_style={{ background: "var(--spectrum-gray-50)" }}>
        {children}
      </View>
    </Flex>
  );
}
