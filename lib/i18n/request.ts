import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
	const locale = "en"; // default locale, can be made dynamic later
	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
});
