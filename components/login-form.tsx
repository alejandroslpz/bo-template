"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type AuthResult, login } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

function AuthMessage() {
	const searchParams = useSearchParams();
	const message = searchParams.get("message");
	if (!message) return null;
	return <p className="text-muted-foreground text-center text-sm">{message}</p>;
}

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [state, formAction, pending] = useActionState<AuthResult, FormData>(
		login,
		{},
	);

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
				<p className="text-muted-foreground text-sm">
					Sign in to your account to continue
				</p>
			</div>

			{state.error && (
				<p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-center text-sm">
					{state.error}
				</p>
			)}
			<Suspense>
				<AuthMessage />
			</Suspense>

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
						<div className="flex items-center justify-between">
							<Label htmlFor="password">Password</Label>
							<a
								href="/forgot-password"
								className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
							>
								Forgot password?
							</a>
						</div>
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
						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? "Signing in..." : "Sign in"}
						</Button>
					</Field>

					{/* OAuth buttons — uncomment when providers are configured in Supabase */}
					{/* <FieldSeparator>Or continue with</FieldSeparator>
					<Field className="grid grid-cols-3 gap-3">
						<Button variant="outline" type="button" disabled={pending}>Apple</Button>
						<Button variant="outline" type="button" disabled={pending}>Google</Button>
						<Button variant="outline" type="button" disabled={pending}>Meta</Button>
					</Field> */}
				</FieldGroup>
			</form>

			<div className="text-center text-sm">
				<span className="text-muted-foreground">
					Don&apos;t have an account?{" "}
				</span>
				<a
					href="/signup"
					className="text-foreground font-medium underline-offset-4 hover:underline"
				>
					Sign up
				</a>
			</div>

			<FieldDescription className="text-muted-foreground/70 text-center text-xs">
				By continuing, you agree to our Terms of Service and Privacy Policy.
			</FieldDescription>
		</div>
	);
}
