import { read } from '../helpers/read';

async function part1() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	function blink(stone: number): number[] {
		if (stone === 0) return [1];

		const stoneString = String(stone);
		if (stoneString.length % 2 === 0) {
			const half = stoneString.length / 2;
			const left = stoneString.slice(0, half);
			const right = stoneString.slice(half);

			return [Number(left), Number(right)];
		}

		return [stone * 2024];
	}

	let stones = file.split(/\s+/).map(Number);

	let i = 0;
	while (i < 25) {
		const newStones: number[] = [];
		for (let i = 0; i < stones.length; i++) {
			newStones.push(...blink(stones[i]));
		}
		stones = newStones;

		i++;
	}

	return stones.length;
}

part1().then(console.log);
