import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Can } from "../can";

describe("Can", () => {
	it("renders children when permission is granted", () => {
		render(
			<Can role="admin" permission="manage_users">
				<p>Admin content</p>
			</Can>,
		);

		expect(screen.getByText("Admin content")).toBeInTheDocument();
	});

	it("renders nothing when permission is denied", () => {
		const { container } = render(
			<Can role="viewer" permission="manage_users">
				<p>Admin content</p>
			</Can>,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("renders fallback when permission is denied", () => {
		render(
			<Can role="viewer" permission="manage_users" fallback={<p>No access</p>}>
				<p>Secret content</p>
			</Can>,
		);

		expect(screen.queryByText("Secret content")).not.toBeInTheDocument();
		expect(screen.getByText("No access")).toBeInTheDocument();
	});
});
