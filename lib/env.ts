import { z } from "zod";

const envSchema = z.object({
	NEXT_PUBLIC_SUPABASE_URL: z.string().url("Must be a valid URL"),
	NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Must not be empty"),
});

const parsed = envSchema.safeParse({
	NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
	NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
	const missing = parsed.error.issues
		.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
		.join("\n");

	throw new Error(
		`\n❌ Invalid environment variables:\n${missing}\n\nPlease check your .env file.\n`,
	);
}

export const env = parsed.data;
