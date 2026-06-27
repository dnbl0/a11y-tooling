"use client";

// React Spectrum's Provider relies on React context, so it must live inside a
// client boundary. The root layout (a Server Component) renders this around the
// app. We wire Spectrum's `router` prop to Next's router so that Spectrum links
// (e.g. <Link>, pressable rows with href) perform client-side navigation
// instead of full page loads — and keep their built-in keyboard handling.

import { Provider, defaultTheme } from "@adobe/react-spectrum";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

declare module "react-aria-components" {
  interface RouterConfig {
    href: string;
  }
}

export function SpectrumProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <Provider
      theme={defaultTheme}
      colorScheme="light"
      locale="en-US"
      router={{ navigate: (href) => router.push(href) }}
      UNSAFE_style={{ minHeight: "100vh", background: "var(--spectrum-gray-50)" }}
    >
      {children}
    </Provider>
  );
}
