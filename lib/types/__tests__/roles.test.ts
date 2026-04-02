import { describe, expect, it } from "vitest";
import { hasPermission, hasRole } from "../roles";

describe("hasPermission", () => {
	it("grants manage_users to admin", () => {
		expect(hasPermission("admin", "manage_users")).toBe(true);
	});

	it("denies manage_users to viewer", () => {
		expect(hasPermission("viewer", "manage_users")).toBe(false);
	});
});

describe("hasRole", () => {
	it("editor meets viewer requirement", () => {
		expect(hasRole("editor", "viewer")).toBe(true);
	});

	it("viewer does not meet admin requirement", () => {
		expect(hasRole("viewer", "admin")).toBe(false);
	});
});
