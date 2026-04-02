"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function formatSegment(segment: string): string {
	return segment
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function DynamicBreadcrumb() {
	const pathname = usePathname();
	const segments = pathname.split("/").filter(Boolean);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.length === 0 ? (
					<BreadcrumbItem>
						<BreadcrumbPage>Dashboard</BreadcrumbPage>
					</BreadcrumbItem>
				) : (
					segments.map((segment, index) => {
						const isLast = index === segments.length - 1;
						const href = `/${segments.slice(0, index + 1).join("/")}`;
						const label = formatSegment(segment);

						return (
							<Fragment key={href}>
								{index > 0 && (
									<BreadcrumbSeparator className="hidden md:block" />
								)}
								<BreadcrumbItem
									className={!isLast ? "hidden md:block" : undefined}
								>
									{isLast ? (
										<BreadcrumbPage>{label}</BreadcrumbPage>
									) : (
										<BreadcrumbLink href={href}>{label}</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</Fragment>
						);
					})
				)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
