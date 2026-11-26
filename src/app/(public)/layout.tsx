import { PublicPage } from "@/components/public";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PublicPage>{children}</PublicPage>;
}
