import {
	Activity,
	DollarSign,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { UsersChart } from "@/components/charts/users-chart";
import { DataTable } from "@/components/data-table";
import { ExportButton } from "@/components/export-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { columns, type User } from "./columns";

const mockUsers: User[] = [
	{
		id: 1,
		name: "Alice Johnson",
		email: "alice@example.com",
		status: "active",
		createdAt: "2025-01-15",
	},
	{
		id: 2,
		name: "Bob Smith",
		email: "bob@example.com",
		status: "inactive",
		createdAt: "2025-02-03",
	},
	{
		id: 3,
		name: "Charlie Brown",
		email: "charlie@example.com",
		status: "active",
		createdAt: "2025-02-18",
	},
	{
		id: 4,
		name: "Diana Prince",
		email: "diana@example.com",
		status: "pending",
		createdAt: "2025-03-01",
	},
	{
		id: 5,
		name: "Edward Norton",
		email: "edward@example.com",
		status: "active",
		createdAt: "2025-03-10",
	},
	{
		id: 6,
		name: "Fiona Apple",
		email: "fiona@example.com",
		status: "inactive",
		createdAt: "2025-03-22",
	},
	{
		id: 7,
		name: "George Lucas",
		email: "george@example.com",
		status: "active",
		createdAt: "2025-04-05",
	},
	{
		id: 8,
		name: "Hannah Montana",
		email: "hannah@example.com",
		status: "pending",
		createdAt: "2025-04-12",
	},
	{
		id: 9,
		name: "Ivan Drago",
		email: "ivan@example.com",
		status: "active",
		createdAt: "2025-04-20",
	},
	{
		id: 10,
		name: "Julia Roberts",
		email: "julia@example.com",
		status: "inactive",
		createdAt: "2025-05-01",
	},
	{
		id: 11,
		name: "Kevin Hart",
		email: "kevin@example.com",
		status: "active",
		createdAt: "2025-05-14",
	},
	{
		id: 12,
		name: "Laura Palmer",
		email: "laura@example.com",
		status: "pending",
		createdAt: "2025-05-25",
	},
	{
		id: 13,
		name: "Michael Scott",
		email: "michael@example.com",
		status: "active",
		createdAt: "2025-06-02",
	},
	{
		id: 14,
		name: "Nancy Drew",
		email: "nancy@example.com",
		status: "inactive",
		createdAt: "2025-06-15",
	},
	{
		id: 15,
		name: "Oscar Wilde",
		email: "oscar@example.com",
		status: "active",
		createdAt: "2025-06-28",
	},
	{
		id: 16,
		name: "Pam Beesly",
		email: "pam@example.com",
		status: "pending",
		createdAt: "2025-07-04",
	},
	{
		id: 17,
		name: "Quinn Hughes",
		email: "quinn@example.com",
		status: "active",
		createdAt: "2025-07-18",
	},
	{
		id: 18,
		name: "Rachel Green",
		email: "rachel@example.com",
		status: "inactive",
		createdAt: "2025-08-01",
	},
	{
		id: 19,
		name: "Steve Rogers",
		email: "steve@example.com",
		status: "active",
		createdAt: "2025-08-12",
	},
	{
		id: 20,
		name: "Tina Fey",
		email: "tina@example.com",
		status: "pending",
		createdAt: "2025-08-22",
	},
	{
		id: 21,
		name: "Uma Thurman",
		email: "uma@example.com",
		status: "active",
		createdAt: "2025-09-03",
	},
	{
		id: 22,
		name: "Victor Hugo",
		email: "victor@example.com",
		status: "inactive",
		createdAt: "2025-09-15",
	},
	{
		id: 23,
		name: "Wendy Darling",
		email: "wendy@example.com",
		status: "active",
		createdAt: "2025-09-28",
	},
	{
		id: 24,
		name: "Xavier Charles",
		email: "xavier@example.com",
		status: "pending",
		createdAt: "2025-10-05",
	},
	{
		id: 25,
		name: "Yara Shahidi",
		email: "yara@example.com",
		status: "active",
		createdAt: "2025-10-18",
	},
	{
		id: 26,
		name: "Zack Morris",
		email: "zack@example.com",
		status: "inactive",
		createdAt: "2025-11-01",
	},
	{
		id: 27,
		name: "Amy Santiago",
		email: "amy@example.com",
		status: "active",
		createdAt: "2025-11-12",
	},
	{
		id: 28,
		name: "Bruce Wayne",
		email: "bruce@example.com",
		status: "pending",
		createdAt: "2025-11-25",
	},
];

const stats = [
	{
		title: "Total Users",
		value: "1,234",
		change: "+12%",
		changeLabel: "from last month",
		trend: "up" as const,
		icon: Users,
	},
	{
		title: "Revenue",
		value: "$45,231",
		change: "+8.2%",
		changeLabel: "from last month",
		trend: "up" as const,
		icon: DollarSign,
	},
	{
		title: "Active Sessions",
		value: "573",
		change: "+3.1%",
		changeLabel: "from last hour",
		trend: "up" as const,
		icon: Activity,
	},
	{
		title: "Conversion Rate",
		value: "12.5%",
		change: "-0.4%",
		changeLabel: "from last month",
		trend: "down" as const,
		icon: TrendingUp,
	},
];

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Overview of your application metrics and recent activity.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<Card key={stat.title}>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardDescription className="text-sm font-medium">
								{stat.title}
							</CardDescription>
							<stat.icon className="text-muted-foreground size-4" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{stat.value}</div>
							<p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
								{stat.trend === "up" ? (
									<>
										<TrendingUp className="size-3 text-emerald-500" />
										<span className="text-emerald-500">{stat.change}</span>
									</>
								) : (
									<>
										<TrendingDown className="size-3 text-red-500" />
										<span className="text-red-500">{stat.change}</span>
									</>
								)}
								<span>{stat.changeLabel}</span>
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Revenue Overview</CardTitle>
						<CardDescription>
							Monthly revenue for the last 6 months.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<RevenueChart />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Users by Status</CardTitle>
						<CardDescription>
							Distribution of users by their current status.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<UsersChart />
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader className="flex flex-row items-center justify-between">
						<div className="space-y-1">
							<CardTitle>Recent Users</CardTitle>
							<CardDescription>
								A list of all registered users with their current status.
							</CardDescription>
						</div>
						<ExportButton
							data={mockUsers}
							columns={[
								{ key: "name", header: "Name" },
								{ key: "email", header: "Email" },
								{ key: "status", header: "Status" },
								{ key: "createdAt", header: "Created At" },
							]}
							filename="users"
						/>
					</CardHeader>
					<CardContent>
						<DataTable
							columns={columns}
							data={mockUsers}
							searchKey="name"
							searchPlaceholder="Search by name..."
						/>
					</CardContent>
				</Card>
				<ActivityFeed />
			</div>
		</div>
	);
}
