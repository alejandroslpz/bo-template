"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
	{ name: "Active", value: 65, color: "hsl(var(--primary))" },
	{ name: "Inactive", value: 20, color: "hsl(var(--muted-foreground))" },
	{ name: "Pending", value: 15, color: "hsl(var(--accent-foreground))" },
];

export function UsersChart() {
	return (
		<div className="flex flex-col items-center gap-4">
			<ResponsiveContainer width="100%" height={250}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={60}
						outerRadius={100}
						paddingAngle={4}
						dataKey="value"
						strokeWidth={0}
					>
						{data.map((entry) => (
							<Cell key={entry.name} fill={entry.color} />
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--popover))",
							border: "1px solid hsl(var(--border))",
							borderRadius: "var(--radius)",
							color: "hsl(var(--popover-foreground))",
						}}
						formatter={(value) => [`${Number(value)}%`, ""]}
					/>
				</PieChart>
			</ResponsiveContainer>
			<div className="flex gap-4">
				{data.map((entry) => (
					<div key={entry.name} className="flex items-center gap-2 text-sm">
						<div
							className="size-3 rounded-full"
							style={{ backgroundColor: entry.color }}
						/>
						<span className="text-muted-foreground">
							{entry.name} ({entry.value}%)
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
