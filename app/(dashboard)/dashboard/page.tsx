import { DataTable } from "@/components/data-table";
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

export default function DashboardPage() {
	return (
		<div className="space-y-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">
					Sample data table with sorting, filtering, and pagination.
				</p>
			</div>
			<DataTable
				columns={columns}
				data={mockUsers}
				searchKey="name"
				searchPlaceholder="Search by name..."
			/>
		</div>
	);
}
