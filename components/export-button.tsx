"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ExportColumn, exportToCSV, exportToExcel } from "@/lib/export";

interface ExportButtonProps<T extends Record<string, unknown>> {
	data: T[];
	columns: ExportColumn[];
	filename?: string;
}

export function ExportButton<T extends Record<string, unknown>>({
	data,
	columns,
	filename = "export",
}: ExportButtonProps<T>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<Download data-icon="inline-start" />
					Export
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => exportToCSV(data, columns, filename)}>
					Export as CSV
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => exportToExcel(data, columns, filename)}
				>
					Export as Excel
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
