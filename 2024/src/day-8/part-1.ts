import { readByLine } from '../helpers/readByLine';

type Vec = [number, number];

async function part1() {
	const antennas = new Map<string, Vec[]>();
	const grid: string[] = [];

	function isOutOfBounds([x, y]: Vec) {
		return grid[y]?.[x] === undefined;
	}

	function isAntenna(vec: Vec) {
		const [x, y] = vec;
		return !isOutOfBounds(vec) && grid[y]?.[x] !== '.' ? grid[y][x] : false;
	}

	await new Promise<void>((resolve) => {
		let lineIndex = -1;
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine: (line) => {
				lineIndex++;
				grid.push(line);

				for (let i = 0; i < line.length; i++) {
					const position: Vec = [i, lineIndex];
					const antenna = isAntenna(position);
					if (!antenna) continue;

					if (antennas.has(antenna))
						antennas.get(antenna).push(position);
					else antennas.set(antenna, [position]);
				}
			},
			onClose: resolve,
		});
	});

	function sub(vec1: Vec, vec2: Vec): Vec {
		const [a, b] = vec1;
		const [c, d] = vec2;
		return [a - c, b - d];
	}

	function add(vec1: Vec, vec2: Vec): Vec {
		const [a, b] = vec1;
		const [c, d] = vec2;
		return [a + c, b + d];
	}

	const antinodes = new Set<string>();
	for (const [, positions] of antennas) {
		for (let i = 0; i < positions.length; i++) {
			for (let j = i + 1; j < positions.length; j++) {
				const delta = sub(positions[j], positions[i]);

				const pos1 = sub(positions[i], delta);
				const pos2 = add(positions[j], delta);

				if (!isOutOfBounds(pos1)) antinodes.add(pos1.join('.'));
				if (!isOutOfBounds(pos2)) antinodes.add(pos2.join('.'));
			}
		}
	}

	return antinodes.size;
}

part1().then(console.log);