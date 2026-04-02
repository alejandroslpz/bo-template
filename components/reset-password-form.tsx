"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type AuthResult, resetPassword } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [state, formAction, pending] = useActionState<AuthResult, FormData>(
		resetPassword,
		{},
	);

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<form action={formAction} className="p-6 md:p-8">
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Reset your password</h1>
								<p className="text-muted-foreground text-balance">
									Enter your new password below
								</p>
							</div>
							{state.error && (
								<p className="text-destructive text-center text-sm">
									{state.error}
								</p>
							)}
							<Field>
								<FieldLabel htmlFor="password">New Password</FieldLabel>
								<Input
									id="password"
									name="password"
									type="password"
									required
									disabled={pending}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="confirm-password">
									Confirm Password
								</FieldLabel>
								<Input
									id="confirm-password"
									name="confirm-password"
									type="password"
									required
									disabled={pending}
								/>
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>
							<Field>
								<Button type="submit" disabled={pending}>
									{pending ? "Resetting..." : "Reset Password"}
								</Button>
							</Field>
							<FieldDescription className="text-center">
								<a href="/login">Back to login</a>
							</FieldDescription>
						</FieldGroup>
					</form>
					<div className="bg-muted relative hidden md:block">
						<Image
							src="/placeholder.svg"
							alt="Reset password illustration"
							fill
							className="object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
