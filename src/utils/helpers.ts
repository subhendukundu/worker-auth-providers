type Request = {
	url: string;
}

export function parseQuerystring(request: Request): { url: URL; query: Record<string, string> } {
	const replacedUrl = request.url.replace(/#/g, '?');
	const url = new URL(replacedUrl);
	const query = Array.from(url.searchParams.entries()).reduce(
		(acc, [key, value]) => ({
			...acc,
			[key]: value
		}),
		{}
	);

	return { url, query };
}

export function getFixedDigitRandomNumber(n: number): string {
	return (`${  Math.random()}`).substring(2, 2 + n);
}
