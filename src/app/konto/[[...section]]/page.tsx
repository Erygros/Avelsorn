import { redirect } from "next/navigation";
import { currentUser } from "@/server/security";
import { PortalPage } from "@/components/portal-page";
export const metadata = {
    title: "Dein Kundenkonto",
    robots: { index: false, follow: false },
};
export default async function CustomerPage({
    params,
    searchParams,
}: {
    params: Promise<{ section?: string[] }>;
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const user = await currentUser();
    if (!user) redirect("/anmelden");
    if (user.role === "admin") redirect(user.adminVerified ? "/admin" : "/otp");
    const section = (await params).section?.join("/") ?? "";
    const query = await searchParams;
    if (
        section === "buchen" &&
        ["package12", "unlimited", "upgrade", "consultation"].includes(query.product ?? "")
    )
        redirect("/konto/pakete");
    return (
        <PortalPage user={user} admin={false} section={section} query={query} />
    );
}
