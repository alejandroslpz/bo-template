import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function DashboardNotFound() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center p-6">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<div className="flex justify-center">
						<FileQuestion className="text-muted-foreground size-12" />
					</div>
					<CardTitle className="text-xl">Page not found</CardTitle>
					<CardDescription>
						The page you are looking for does not exist or has been moved.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button asChild>
						<Link href="/dashboard">Go to dashboard</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
