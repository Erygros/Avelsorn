import { notFound } from "next/navigation";
import { DevMailbox } from "@/components/dev-mailbox";
export const metadata = {
    title: "Lokaler E-Mail-Ausgang",
    robots: { index: false, follow: false },
};
export default function LocalMailPage() {
    if (process.env.PLATFORM_ENV === "production" || process.env.VERCEL)
        notFound();
    return <DevMailbox />;
}
