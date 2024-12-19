import { read } from 'src/helpers/read';

async function part1() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const [_towels, _patterns] = file.split('\n\n');
	const towels = _towels.split(',').map((v) => v.trim());
	const patterns = _patterns.split('\n').map((v) => v.trim());

	function isPatternValid(
		pattern: string,
		cache = new Map<string, boolean>()
	): boolean {
		if (pattern === '') return true;
		if (cache.has(pattern)) return cache.get(pattern);

		for (let i = 0; i < towels.length; i++) {
			const towel = towels[i];

			if (!pattern.startsWith(towel)) continue;

			const remaining = pattern.slice(towel.length);
			if (isPatternValid(remaining, cache)) {
				cache.set(pattern, true);
				return true;
			}
		}

		cache.set(pattern, false);
		return false;
	}

	return patterns.filter((p) => isPatternValid(p)).length;
}

part1().then(console.log);
