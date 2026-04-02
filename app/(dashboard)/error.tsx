"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center p-6">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<div className="flex justify-center">
						<AlertCircle className="text-destructive size-12" />
					</div>
					<CardTitle className="text-xl">Something went wrong</CardTitle>
					<CardDescription>{error.message}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-3">
					<Button onClick={reset}>Try again</Button>
					<Button variant="ghost" asChild>
						<Link href="/dashboard">Go to dashboard</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
