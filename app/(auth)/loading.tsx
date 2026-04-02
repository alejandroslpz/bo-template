import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
	return (
		<div className="flex items-center justify-center">
			<Skeleton className="h-10 w-10 rounded-full" />
		</div>
	);
}
