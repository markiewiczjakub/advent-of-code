import { read } from '../helpers/read';

async function part2() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	function toKey(...args: unknown[]) {
		return args.join('.');
	}

	function blink(
		stone: number,
		blinks: number,
		cache = new Map<string, number>()
	): number {
		if (blinks === 0) return 1;

		const key = toKey(stone, blinks);
		if (cache.has(key)) return cache.get(key);

		if (stone === 0) {
			const result = blink(1, blinks - 1, cache);
			cache.set(toKey(stone, blinks), result);
			return result;
		}

		const stoneString = String(stone);
		if (stoneString.length % 2 === 0) {
			const half = stoneString.length / 2;
			const left = stoneString.slice(0, half);
			const right = stoneString.slice(half);

			const result =
				blink(Number(left), blinks - 1, cache) +
				blink(Number(right), blinks - 1, cache);
			cache.set(key, result);
			return result;
		}

		const result = blink(stone * 2024, blinks - 1, cache);
		cache.set(key, result);
		return result;
	}

	let sum = 0;
	const stones = file.split(/\s+/).map(Number);

	for (let i = 0; i < stones.length; i++) {
		sum += blink(stones[i], 75);
	}

	return sum;
}

part2().then(console.log);
