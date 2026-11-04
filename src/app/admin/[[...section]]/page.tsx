import { redirect, notFound } from "next/navigation";
import { currentUser } from "@/server/security";
import { PortalPage } from "@/components/portal-page";
export const metadata = {
    title: "Administration",
    robots: { index: false, follow: false },
};
export default async function AdminPage({
    params,
    searchParams,
}: {
    params: Promise<{ section?: string[] }>;
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const user = await currentUser();
    if (!user) redirect("/anmelden");
    if (user.role !== "admin") notFound();
    if (!user.adminVerified) redirect("/otp");
    const section = (await params).section?.join("/") ?? "";
    const query=await searchParams;
    return (
        <PortalPage
            user={user}
            admin
            section={section}
            query={query}
        />
    );
}
