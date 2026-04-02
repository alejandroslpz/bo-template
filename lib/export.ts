import * as XLSX from "xlsx";

export interface ExportColumn {
	key: string;
	header: string;
}

function extractRows<T extends Record<string, unknown>>(
	data: T[],
	columns: ExportColumn[],
): Record<string, unknown>[] {
	return data.map((row) => {
		const mapped: Record<string, unknown> = {};
		for (const col of columns) {
			mapped[col.header] = row[col.key] ?? "";
		}
		return mapped;
	});
}

function triggerDownload(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function exportToCSV<T extends Record<string, unknown>>(
	data: T[],
	columns: ExportColumn[],
	filename = "export",
): void {
	const headers = columns.map((col) => col.header);
	const rows = data.map((row) =>
		columns.map((col) => {
			const value = row[col.key] ?? "";
			const str = String(value);
			if (str.includes(",") || str.includes('"') || str.includes("\n")) {
				return `"${str.replace(/"/g, '""')}"`;
			}
			return str;
		}),
	);

	const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	triggerDownload(blob, `${filename}.csv`);
}

export function exportToExcel<T extends Record<string, unknown>>(
	data: T[],
	columns: ExportColumn[],
	filename = "export",
): void {
	const rows = extractRows(data, columns);
	const worksheet = XLSX.utils.json_to_sheet(rows);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
	const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	triggerDownload(blob, `${filename}.xlsx`);
}
