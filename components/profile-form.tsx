"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	type AuthResult,
	resetPassword,
	updateProfile,
} from "@/lib/supabase/actions";

export function ProfileForm({
	fullName,
	email,
}: {
	fullName: string;
	email: string;
}) {
	const [profileState, profileAction, profilePending] = useActionState<
		AuthResult,
		FormData
	>(updateProfile, {});

	const [passwordState, passwordAction, passwordPending] = useActionState<
		AuthResult,
		FormData
	>(resetPassword, {});

	useEffect(() => {
		if (profileState.success) {
			toast.success(profileState.success);
		}
	}, [profileState]);

	useEffect(() => {
		if (passwordState.success) {
			toast.success(passwordState.success);
		}
	}, [passwordState]);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your name and personal details.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={profileAction}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input id="email" type="email" value={email} disabled />
							</Field>
							<Field>
								<FieldLabel htmlFor="full_name">Full Name</FieldLabel>
								<Input
									id="full_name"
									name="full_name"
									type="text"
									placeholder="Your full name"
									defaultValue={fullName}
									required
									disabled={profilePending}
								/>
								<FieldError>{profileState.fieldErrors?.full_name}</FieldError>
							</Field>
							{profileState.error && (
								<p className="text-destructive text-sm">{profileState.error}</p>
							)}
							<Field>
								<Button type="submit" disabled={profilePending}>
									{profilePending ? "Saving..." : "Save Changes"}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Change Password</CardTitle>
					<CardDescription>
						Update your password to keep your account secure.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={passwordAction}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="password">New Password</FieldLabel>
								<Input
									id="password"
									name="password"
									type="password"
									placeholder="New password"
									required
									disabled={passwordPending}
								/>
								<FieldError>{passwordState.fieldErrors?.password}</FieldError>
							</Field>
							<Field>
								<FieldLabel htmlFor="confirm-password">
									Confirm Password
								</FieldLabel>
								<Input
									id="confirm-password"
									name="confirm-password"
									type="password"
									placeholder="Confirm new password"
									required
									disabled={passwordPending}
								/>
								<FieldError>
									{passwordState.fieldErrors?.["confirm-password"]}
								</FieldError>
								<FieldError>{passwordState.fieldErrors?._root}</FieldError>
							</Field>
							{passwordState.error && (
								<p className="text-destructive text-sm">
									{passwordState.error}
								</p>
							)}
							<Field>
								<Button type="submit" disabled={passwordPending}>
									{passwordPending ? "Updating..." : "Update Password"}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
