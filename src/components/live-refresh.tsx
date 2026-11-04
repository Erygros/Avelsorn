"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export function LiveRefresh({ seconds = 15 }: { seconds?: number }) {
    const router = useRouter();
    useEffect(() => {
        const handle = setInterval(() => {
            if (document.visibilityState === "visible") router.refresh();
        }, seconds * 1000);
        return () => clearInterval(handle);
    }, [router, seconds]);
    return null;
}
