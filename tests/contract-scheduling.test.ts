import { it, expect } from "vitest";
import { regularWorkStart } from "../src/server/contracts";

it.each([
    ["2026-11-05T10:00:00Z", "2026-11-19T23:00:00.000Z"],
    ["2026-11-05T23:30:00Z", "2026-11-20T23:00:00.000Z"],
    ["2026-03-15T12:00:00Z", "2026-03-30T22:00:00.000Z"],
    ["2026-03-20T12:00:00Z", "2026-04-07T22:00:00.000Z"],
    ["2026-04-17T12:00:00Z", "2026-05-04T22:00:00.000Z"],
    ["2026-12-18T12:00:00Z", "2027-01-04T23:00:00.000Z"],
])(
    "plant einen Beginn nach vollständigen Kalendertagen und vorsorglich berücksichtigten Feiertagen: %s",
    (accepted, expected) => {
        expect(regularWorkStart(new Date(accepted)).toISOString()).toBe(
            expected,
        );
    },
);
