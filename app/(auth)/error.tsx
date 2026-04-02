"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function AuthError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<Card className="w-full max-w-md mx-auto text-center">
			<CardHeader>
				<div className="flex justify-center">
					<AlertCircle className="text-destructive size-12" />
				</div>
				<CardTitle className="text-xl">Something went wrong</CardTitle>
				<CardDescription>{error.message}</CardDescription>
			</CardHeader>
			<CardContent>
				<Button onClick={reset}>Try again</Button>
			</CardContent>
		</Card>
	);
}
