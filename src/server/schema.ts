import {
    pgTable,
    text,
    timestamp,
    integer,
    boolean,
    jsonb,
    index,
    uniqueIndex,
    check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

const id = () => text("id").primaryKey().$defaultFn(randomUUID);
const created = () =>
    timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated = () =>
    timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();
const date = (name: string) => timestamp(name, { withTimezone: true });

export const users = pgTable(
    "users",
    {
        id: id(),
        name: text().notNull(),
        email: text().notNull().unique(),
        passwordHash: text("password_hash").notNull(),
        role: text().notNull().default("customer"),
        phone: text(),
        company: text(),
        introCredits: integer("intro_credits").notNull().default(0),
        birthDate: text("birth_date").notNull(),
        customerType: text("customer_type").notNull().default("consumer"),
        billingAddress: text("billing_address"),
        verifiedAt: date("verified_at"),
        guardianApprovedAt: date("guardian_approved_at"),
        onboardingAt: date("onboarding_at"),
        disabledAt: date("disabled_at"),
        termsAt: date("terms_at").notNull(),
        createdAt: created(),
        updatedAt: updated(),
    },
    (t) => [
        check("users_role_check", sql`${t.role} IN ('customer','admin')`),
        uniqueIndex("one_admin")
            .on(t.role)
            .where(sql`${t.role} = 'admin'`),
    ],
);
export const sessions = pgTable("sessions", {
    id: id(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    adminVerified: boolean("admin_verified").notNull().default(false),
    expiresAt: date("expires_at").notNull(),
    createdAt: created(),
});
export const tokens = pgTable("tokens", {
    id: id(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    purpose: text().notNull(),
    hash: text().notNull().unique(),
    attempts: integer().notNull().default(0),
    expiresAt: date("expires_at").notNull(),
    usedAt: date("used_at"),
    createdAt: created(),
});
export const settings = pgTable("settings", {
    key: text().primaryKey(),
    value: jsonb().notNull(),
    updatedAt: updated(),
});
export const locks = pgTable("business_locks", {
    name: text().primaryKey(),
    version: integer().notNull().default(0),
});
export const auditEvents = pgTable("audit_events", {
    id: id(),
    actorId: text("actor_id").references(() => users.id, {
        onDelete: "set null",
    }),
    action: text().notNull(),
    resource: text().notNull(),
    resourceId: text("resource_id"),
    metadata: jsonb(),
    createdAt: created(),
});
export const rateLimits = pgTable("rate_limits", {
    key: text().primaryKey(),
    count: integer().notNull().default(1),
    expiresAt: date("expires_at").notNull(),
});
export const onboarding = pgTable("onboarding", {
    userId: text("user_id")
        .primaryKey()
        .references(() => users.id, { onDelete: "cascade" }),
    answers: jsonb().$type<Record<string, string>>().notNull(),
    completedAt: date("completed_at"),
    updatedAt: updated(),
});
export const guardianConsents = pgTable("guardian_consents", {
    id: id(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    email: text().notNull(),
    name: text().notNull(),
    scope: text().notNull(),
    status: text().notNull().default("pending"),
    confirmedAt: date("confirmed_at"),
    reviewedAt: date("reviewed_at"),
    createdAt: created(),
});
export const availability = pgTable("availability", {
    id: id(),
    weekday: integer(),
    day: text().unique(),
    start: text(),
    end: text(),
    blocked: boolean().notNull().default(false),
    reason: text(),
});
export const calendarBlocks = pgTable(
    "calendar_blocks",
    {
        id: id(),
        startsAt: date("starts_at").notNull(),
        endsAt: date("ends_at").notNull(),
        kind: text().notNull().default("blocked"),
        reason: text().notNull().default(""),
        createdAt: created(),
    },
    (t) => [
        check("calendar_block_duration", sql`${t.endsAt} > ${t.startsAt}`),
        check("calendar_block_kind", sql`${t.kind} IN ('blocked','open')`),
        index("calendar_blocks_range").on(t.startsAt, t.endsAt),
    ],
);
export const orders = pgTable(
    "orders",
    {
        id: id(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id),
        reference: text().notNull().unique(),
        product: text().notNull(),
        amountCents: integer("amount_cents").notNull(),
        paidCents: integer("paid_cents").notNull().default(0),
        status: text().notNull().default("open"),
        contract: jsonb().notNull(),
        acceptedAt: date("accepted_at").notNull(),
        paidAt: date("paid_at"),
        cancelledAt: date("cancelled_at"),
        createdAt: created(),
    },
    (t) => [
        check(
            "positive_order_amount",
            sql`${t.amountCents} >= 0 AND ${t.paidCents} >= 0`,
        ),
    ],
);
export const bookings = pgTable(
    "bookings",
    {
        id: id(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id),
        orderId: text("order_id")
            .unique()
            .references(() => orders.id),
        packageId: text("package_id"),
        serviceOrderId: text("service_order_id").references(() => orders.id),
        product: text().notNull(),
        channel: text().notNull(),
        startsAt: date("starts_at").notNull(),
        endsAt: date("ends_at").notNull(),
        status: text().notNull(),
        reservedUntil: date("reserved_until"),
        sequence: integer().notNull().default(0),
        notes: text(),
        company: text(),
        topic: text(),
        contactName: text("contact_name"),
        contactEmail: text("contact_email"),
        contactPhone: text("contact_phone"),
        createdAt: created(),
        updatedAt: updated(),
    },
    (t) => [
        index("bookings_calendar").on(t.startsAt, t.endsAt),
        check("booking_positive_duration", sql`${t.endsAt} > ${t.startsAt}`),
    ],
);
export const packages = pgTable(
    "packages",
    {
        id: id(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id),
        orderId: text("order_id")
            .notNull()
            .unique()
            .references(() => orders.id),
        product: text().notNull(),
        startsAt: date("starts_at").notNull(),
        expiresAt: date("expires_at").notNull(),
        allowanceSeconds: integer("allowance_seconds"),
        usedSeconds: integer("used_seconds").notNull().default(0),
        status: text().notNull().default("active"),
        cancelledAt: date("cancelled_at"),
        createdAt: created(),
    },
    (t) => [
        check(
            "package_usage",
            sql`${t.usedSeconds} >= 0 AND (${t.allowanceSeconds} IS NULL OR ${t.usedSeconds} <= ${t.allowanceSeconds})`,
        ),
    ],
);
export const payments = pgTable("payments", {
    id: id(),
    orderId: text("order_id")
        .notNull()
        .references(() => orders.id),
    adminId: text("admin_id")
        .notNull()
        .references(() => users.id),
    amountCents: integer("amount_cents").notNull(),
    bankReference: text("bank_reference").notNull(),
    idempotencyKey: text("idempotency_key").notNull().unique(),
    receivedAt: date("received_at").notNull(),
    kind: text().notNull().default("receipt"),
    createdAt: created(),
});
export const projects = pgTable(
    "projects",
    {
        id: id(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id),
        adminId: text("admin_id")
            .notNull()
            .references(() => users.id),
        name: text().notNull(),
        description: text().notNull(),
        category: text().notNull(),
        status: text().notNull().default("requested"),
        progressOverride: integer("progress_override"),
        completedAt: date("completed_at"),
        createdAt: created(),
        updatedAt: updated(),
    },
    (t) => [
        check(
            "progress_range",
            sql`${t.progressOverride} IS NULL OR ${t.progressOverride} BETWEEN 0 AND 100`,
        ),
    ],
);
export const tasks = pgTable("tasks", {
    id: id(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id),
    createdBy: text("created_by")
        .notNull()
        .references(() => users.id),
    title: text().notNull(),
    description: text(),
    status: text().notNull().default("requested"),
    milestone: boolean().notNull().default(false),
    dueAt: date("due_at"),
    createdAt: created(),
    updatedAt: updated(),
});
export const timeEntries = pgTable(
    "time_entries",
    {
        id: id(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id),
        projectId: text("project_id")
            .notNull()
            .references(() => projects.id),
        adminId: text("admin_id")
            .notNull()
            .references(() => users.id),
        packageId: text("package_id").references(() => packages.id),
        startsAt: date("starts_at").notNull(),
        endsAt: date("ends_at"),
        segmentAt: date("segment_at"),
        durationSeconds: integer("duration_seconds").notNull().default(0),
        status: text().notNull().default("stopped"),
        activity: text().notNull(),
        description: text(),
        adminComment: text("admin_comment"),
        source: text().notNull(),
        charged: boolean().notNull().default(false),
        createdAt: created(),
        updatedAt: updated(),
        chargedSeconds: integer("charged_seconds").notNull().default(0),
        revision: integer().notNull().default(0),
        segments: jsonb()
            .$type<{ start: string; end: string }[]>()
            .notNull()
            .default([]),
    },
    (t) => [
        check("nonnegative_time", sql`${t.durationSeconds} >= 0`),
        uniqueIndex("single_running_timer")
            .on(t.adminId)
            .where(sql`${t.status} IN ('running','paused')`),
    ],
);
export const projectComments = pgTable("project_comments", {
    id: id(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    body: text().notNull(),
    createdAt: created(),
});
export const approvals = pgTable("approvals", {
    id: id(),
    projectId: text("project_id")
        .notNull()
        .references(() => projects.id),
    requestedBy: text("requested_by")
        .notNull()
        .references(() => users.id),
    respondedBy: text("responded_by").references(() => users.id),
    version: text().notNull(),
    description: text().notNull(),
    comment: text(),
    status: text().notNull().default("pending"),
    respondedAt: date("responded_at"),
    createdAt: created(),
});
export const files = pgTable("files", {
    id: id(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    uploadedBy: text("uploaded_by")
        .notNull()
        .references(() => users.id),
    projectId: text("project_id").references(() => projects.id),
    name: text().notNull(),
    key: text().notNull().unique(),
    mime: text().notNull(),
    size: integer().notNull(),
    sha256: text().notNull(),
    category: text().notNull().default("project"),
    deleteAfter: date("delete_after"),
    noticeAt: date("notice_at"),
    deletedAt: date("deleted_at"),
    createdAt: created(),
});
export const messages = pgTable(
    "messages",
    {
        id: id(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id),
        senderId: text("sender_id")
            .notNull()
            .references(() => users.id),
        projectId: text("project_id").references(() => projects.id),
        fileId: text("file_id").references(() => files.id),
        body: text().notNull(),
        readAt: date("read_at"),
        createdAt: created(),
    },
    (t) => [index("chat_customer").on(t.userId, t.createdAt)],
);
export type DocumentItem = {
    description: string;
    quantity: number;
    unitCents: number;
};
export const documents = pgTable("documents", {
    id: id(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    orderId: text("order_id").references(() => orders.id),
    parentId: text("parent_id"),
    kind: text().notNull(),
    number: text().unique(),
    status: text().notNull().default("draft"),
    items: jsonb().$type<DocumentItem[]>().notNull(),
    amountCents: integer("amount_cents").notNull(),
    description: text().notNull(),
    snapshot: jsonb(),
    issuedAt: date("issued_at"),
    dueAt: date("due_at"),
    validUntil: date("valid_until"),
    finalizedAt: date("finalized_at"),
    respondedAt: date("responded_at"),
    acceptance: text(),
    pdfKey: text("pdf_key"),
    pdfHash: text("pdf_hash"),
    createdAt: created(),
    updatedAt: updated(),
});
export const sequences = pgTable("sequences", {
    name: text().primaryKey(),
    value: integer().notNull().default(0),
});
export const notifications = pgTable("notifications", {
    id: id(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    type: text().notNull(),
    title: text().notNull(),
    body: text().notNull(),
    url: text().notNull(),
    eventKey: text("event_key").notNull().unique(),
    readAt: date("read_at"),
    createdAt: created(),
});
export const outbox = pgTable("mail_outbox", {
    id: id(),
    userId: text("user_id").references(() => users.id, {
        onDelete: "set null",
    }),
    to: text().notNull(),
    subject: text().notNull(),
    encryptedBody: text("encrypted_body").notNull(),
    ctaUrl: text("cta_url"),
    eventKey: text("event_key").notNull().unique(),
    calendarEvent: jsonb("calendar_event").$type<{
        bookingId?: string;
        guestBookingId?: string;
        sequence: number;
        kind: "confirmation" | "reminder" | "cancellation";
    }>(),
    attachmentKeys: jsonb("attachment_keys")
        .$type<string[]>()
        .notNull()
        .default([]),
    status: text().notNull().default("queued"),
    attempts: integer().notNull().default(0),
    availableAt: date("available_at").notNull(),
    claimedAt: date("claimed_at"),
    sentAt: date("sent_at"),
    errorCode: text("error_code"),
    createdAt: created(),
});
// Free introductory calls are not customer accounts and grant no portal access.
export const guestBookings = pgTable(
    "guest_bookings",
    {
        id: id(),
        firstName: text("first_name").notNull(),
        lastName: text("last_name").notNull(),
        email: text().notNull(),
        phone: text().notNull(),
        topic: text().notNull(),
        notes: text().notNull().default(""),
        startsAt: date("starts_at").notNull(),
        endsAt: date("ends_at").notNull(),
        status: text().notNull().default("confirmed"),
        sequence: integer().notNull().default(0),
        tokenHash: text("token_hash").notNull().unique(),
        accessExpiresAt: date("access_expires_at").notNull(),
        requestId: text("request_id").notNull().unique(),
        createdAt: created(),
        updatedAt: updated(),
    },
    (t) => [
        index("guest_bookings_range").on(t.startsAt, t.endsAt),
        index("guest_bookings_email").on(t.email),
        check(
            "guest_booking_duration",
            sql`${t.endsAt} = ${t.startsAt} + interval '15 minutes'`,
        ),
        check(
            "guest_booking_status",
            sql`${t.status} IN ('confirmed','cancelled','completed')`,
        ),
    ],
);
export const posts = pgTable("posts", {
    id: id(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    category: text().notNull(),
    excerpt: text().notNull(),
    body: text().notNull(),
    seoTitle: text("seo_title"),
    metaDescription: text("meta_description"),
    status: text().notNull().default("draft"),
    publishAt: date("publish_at"),
    createdAt: created(),
    updatedAt: updated(),
});
export const pages = pgTable("pages", {
    id: id(),
    slug: text().notNull().unique(),
    title: text().notNull(),
    description: text().notNull(),
    body: text().notNull(),
    updatedAt: updated(),
});
export const media = pgTable("media", {
    id: id(),
    fileId: text("file_id")
        .notNull()
        .references(() => files.id),
    origin: text().notNull(),
    source: text().notNull(),
    createdOn: date("created_on").notNull(),
    publishedAt: date("published_at"),
    disclosure: text(),
    alt: text().notNull().default(""),
});
export const contacts = pgTable("contacts", {
    id: id(),
    name: text().notNull(),
    email: text().notNull(),
    subject: text().notNull(),
    body: text().notNull(),
    status: text().notNull().default("open"),
    createdAt: created(),
});
export const privacyRequests = pgTable("privacy_requests", {
    id: id(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    type: text().notNull(),
    body: text(),
    status: text().notNull().default("open"),
    resolution: text(),
    completedAt: date("completed_at"),
    createdAt: created(),
});
export const consents = pgTable("consents", {
    id: id(),
    visitorId: text("visitor_id").notNull(),
    userId: text("user_id").references(() => users.id, {
        onDelete: "set null",
    }),
    statistics: boolean().notNull().default(false),
    version: text().notNull(),
    createdAt: created(),
});
export const statistics = pgTable(
    "statistics",
    {
        id: id(),
        day: text().notNull(),
        path: text().notNull(),
        views: integer().notNull().default(1),
    },
    (t) => [uniqueIndex("daily_page").on(t.day, t.path)],
);
export const withdrawals = pgTable("withdrawals", {
    id: id(),
    userId: text("user_id").references(() => users.id),
    orderId: text("order_id").references(() => orders.id),
    reference: text().notNull().unique(),
    name: text().notNull(),
    email: text().notNull(),
    contractReference: text("contract_reference").notNull(),
    statement: text().notNull(),
    status: text().notNull().default("received"),
    createdAt: created(),
});
export const jobReceipts = pgTable("job_receipts", {
    key: text().primaryKey(),
    completedAt: date("completed_at").notNull(),
});
export const backups = pgTable("backups", {
    id: id(),
    key: text(),
    status: text().notNull(),
    sha256: text(),
    size: integer(),
    errorCode: text("error_code"),
    restoredAt: date("restored_at"),
    createdAt: created(),
});
export const videoSignals = pgTable(
    "video_signals",
    {
        id: id(),
        bookingId: text("booking_id")
            .notNull()
            .references(() => bookings.id),
        senderId: text("sender_id")
            .notNull()
            .references(() => users.id),
        payload: text().notNull(),
        createdAt: created(),
        expiresAt: date("expires_at").notNull(),
    },
    (t) => [index("room_signals").on(t.bookingId, t.createdAt)],
);
export const videoRooms = pgTable("video_rooms", {
    bookingId: text("booking_id")
        .primaryKey()
        .references(() => bookings.id),
    generation: integer().notNull().default(1),
    customerJoinedAt: date("customer_joined_at"),
    adminJoinedAt: date("admin_joined_at"),
    updatedAt: updated(),
});

export type User = typeof users.$inferSelect;
