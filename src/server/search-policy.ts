export function searchIndexingAllowed() {
    return (
        process.env.PRODUCTION_APPROVED === "true" &&
        process.env.PLATFORM_ENV !== "preview" &&
        process.env.VERCEL_ENV !== "preview"
    );
}
