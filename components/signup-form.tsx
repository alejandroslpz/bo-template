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
import { type AuthResult, signup } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [state, formAction, pending] = useActionState<AuthResult, FormData>(
		signup,
		{},
	);

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold tracking-tight">
					Create your account
				</h1>
				<p className="text-muted-foreground text-sm">
					Enter your details below to get started
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
						<FieldDescription>
							We&apos;ll use this to contact you. We will not share your email
							with anyone else.
						</FieldDescription>
					</Field>
					<Field>
						<Field className="grid grid-cols-2 gap-4">
							<Field>
								<Label htmlFor="password">Password</Label>
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
								<Label htmlFor="confirm-password">Confirm</Label>
								<Input
									id="confirm-password"
									name="confirm-password"
									type="password"
									required
									disabled={pending}
								/>
								<FieldError>
									{state.fieldErrors?.["confirm-password"]}
								</FieldError>
							</Field>
						</Field>
						<FieldError>{state.fieldErrors?._root}</FieldError>
						<FieldDescription>
							Must be at least 8 characters long.
						</FieldDescription>
					</Field>
					<Field>
						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? "Creating account..." : "Create account"}
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
				<span className="text-muted-foreground">Already have an account? </span>
				<a
					href="/login"
					className="text-foreground font-medium underline-offset-4 hover:underline"
				>
					Sign in
				</a>
			</div>

			<FieldDescription className="text-muted-foreground/70 text-center text-xs">
				By continuing, you agree to our Terms of Service and Privacy Policy.
			</FieldDescription>
		</div>
	);
}
