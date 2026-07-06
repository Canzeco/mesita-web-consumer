import { redirect } from "next/navigation";
import { CONSUMER_ROUTES } from "@/lib/consumer-route-contract";

// The page is named Share — /share is canonical. /invite was the old path,
// kept as a redirect for saved links.
export default function InviteLegacyPage() {
  redirect(CONSUMER_ROUTES.share);
}
