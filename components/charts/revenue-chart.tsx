"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const data = [
	{ month: "Jan", revenue: 4000 },
	{ month: "Feb", revenue: 3000 },
	{ month: "Mar", revenue: 5000 },
	{ month: "Apr", revenue: 4500 },
	{ month: "May", revenue: 6000 },
	{ month: "Jun", revenue: 5500 },
];

export function RevenueChart() {
	return (
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart data={data}>
				<defs>
					<linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
						<stop
							offset="5%"
							stopColor="hsl(var(--primary))"
							stopOpacity={0.3}
						/>
						<stop
							offset="95%"
							stopColor="hsl(var(--primary))"
							stopOpacity={0}
						/>
					</linearGradient>
				</defs>
				<CartesianGrid
					strokeDasharray="3 3"
					stroke="hsl(var(--border))"
					vertical={false}
				/>
				<XAxis
					dataKey="month"
					stroke="hsl(var(--muted-foreground))"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="hsl(var(--muted-foreground))"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => `$${value}`}
				/>
				<Tooltip
					contentStyle={{
						backgroundColor: "hsl(var(--popover))",
						border: "1px solid hsl(var(--border))",
						borderRadius: "var(--radius)",
						color: "hsl(var(--popover-foreground))",
					}}
					formatter={(value) => [
						`$${Number(value).toLocaleString()}`,
						"Revenue",
					]}
				/>
				<Area
					type="monotone"
					dataKey="revenue"
					stroke="hsl(var(--primary))"
					strokeWidth={2}
					fill="url(#revenueGradient)"
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
