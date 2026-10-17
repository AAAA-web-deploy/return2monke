import { Landing } from "@/components/Landing";
import { loadContent } from "@/lib/content";

export default function Page() {
  return <Landing content={loadContent()} />;
}
