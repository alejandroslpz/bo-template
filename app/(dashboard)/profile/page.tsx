import { ProfileForm } from "@/components/profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	const fullName = user?.user_metadata?.full_name ?? "";
	const email = user?.email ?? "";
	const avatarUrl = user?.user_metadata?.avatar_url ?? "";

	return (
		<div className="mx-auto w-full max-w-2xl space-y-6">
			<div>
				<h1 className="text-2xl font-bold">Profile</h1>
				<p className="text-muted-foreground text-sm">
					Manage your account settings and change your password.
				</p>
			</div>
			<ProfileForm fullName={fullName} email={email} avatarUrl={avatarUrl} />
		</div>
	);
}
