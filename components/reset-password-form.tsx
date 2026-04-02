"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold tracking-tight">
					Reset your password
				</h1>
				<p className="text-muted-foreground text-sm">
					Enter your new password below
				</p>
			</div>

			{state.error && (
				<p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-center text-sm">
					{state.error}
				</p>
			)}

			<form action={formAction}>
				<FieldGroup>
					<Field>
						<Label htmlFor="password">New Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							required
							disabled={pending}
						/>
						<FieldError>{state.fieldErrors?.password}</FieldError>
					</Field>
					<Field>
						<Label htmlFor="confirm-password">Confirm Password</Label>
						<Input
							id="confirm-password"
							name="confirm-password"
							type="password"
							required
							disabled={pending}
						/>
						<FieldError>{state.fieldErrors?.["confirm-password"]}</FieldError>
						<FieldError>{state.fieldErrors?._root}</FieldError>
						<FieldDescription>
							Must be at least 8 characters long.
						</FieldDescription>
					</Field>
					<Field>
						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? "Resetting..." : "Reset password"}
						</Button>
					</Field>
				</FieldGroup>
			</form>

			<div className="text-center text-sm">
				<a
					href="/login"
					className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
				>
					Back to sign in
				</a>
			</div>
		</div>
	);
}
