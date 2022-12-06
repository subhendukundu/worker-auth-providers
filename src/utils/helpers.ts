export function parseQuerystring(request) {
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

export function getFixedDigitRandomNumber(n) {
	return (`${  Math.random()}`).substring(2, 2 + n);
}
