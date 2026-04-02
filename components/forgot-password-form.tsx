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
import { type AuthResult, forgotPassword } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [state, formAction, pending] = useActionState<AuthResult, FormData>(
		forgotPassword,
		{},
	);

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold tracking-tight">
					Forgot your password?
				</h1>
				<p className="text-muted-foreground text-sm">
					Enter your email and we&apos;ll send you a reset link
				</p>
			</div>

			{state.error && (
				<p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-center text-sm">
					{state.error}
				</p>
			)}
			{state.success && (
				<p className="rounded-md bg-green-500/10 px-3 py-2 text-center text-sm text-green-600 dark:text-green-400">
					{state.success}
				</p>
			)}

			<form action={formAction}>
				<FieldGroup>
					<Field>
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="name@example.com"
							required
							disabled={pending}
						/>
						<FieldError>{state.fieldErrors?.email}</FieldError>
					</Field>
					<Field>
						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? "Sending..." : "Send reset link"}
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

			<FieldDescription className="text-muted-foreground/70 text-center text-xs">
				We&apos;ll send a password reset link to your email address.
			</FieldDescription>
		</div>
	);
}
