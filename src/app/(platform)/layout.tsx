import { AppShell } from "@/components/AppShell";

// Platform layout: wraps all logged-in app pages (dashboard, sites, scans) in
// the sidebar app frame. Marketing pages live in a sibling route group and do
// not get this chrome.
export default function PlatformLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
