import { read } from 'src/helpers/read';

async function part1() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const [_towels, _patterns] = file.split('\n\n');
	const towels = _towels.split(',').map((v) => v.trim());
	const patterns = _patterns.split('\n').map((v) => v.trim());

	function count(pattern: string): number {
		const dp = new Array(pattern.length + 1).fill(0);
		dp[0] = 1;

		for (let i = 1; i <= pattern.length; i++) {
			for (let j = 0; j < towels.length; j++) {
				const towel = towels[j];
				if (
					i >= towel.length &&
					pattern.slice(i - towel.length, i) === towel
				) {
					dp[i] += dp[i - towel.length];
				}
			}
		}

		return dp[pattern.length];
	}

	return patterns.reduce((total, pattern) => total + count(pattern), 0);
}

part1().then(console.log);
