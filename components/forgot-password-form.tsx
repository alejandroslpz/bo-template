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
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<form action={formAction} className="p-6 md:p-8">
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Forgot your password?</h1>
								<p className="text-muted-foreground text-balance">
									Enter your email and we&apos;ll send you a reset link
								</p>
							</div>
							{state.error && (
								<p className="text-destructive text-center text-sm">
									{state.error}
								</p>
							)}
							{state.success && (
								<p className="text-center text-sm text-green-600">
									{state.success}
								</p>
							)}
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="m@example.com"
									required
									disabled={pending}
								/>
							</Field>
							<Field>
								<Button type="submit" disabled={pending}>
									{pending ? "Sending..." : "Send Reset Link"}
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
							alt="Forgot password illustration"
							fill
							className="object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
