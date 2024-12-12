import { readByLine } from 'src/helpers/readByLine';

type Vec = [number, number];
type Region = {
	id: string;
	perimeter: number;
	area: number;
};

const dirs: Vec[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

async function part1() {
	const grid: string[] = [];

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine: (line) => grid.push(line),
			onClose: resolve,
		})
	);

	function toKey(...args: unknown[]) {
		return args.join('.');
	}
	function isOutOfBounds(x: number, y: number) {
		return grid[y]?.[x] === undefined;
	}

	const visited = new Set<string>();

	function findRegion(x: number, y: number, region: Region) {
		const key = toKey(x, y);
		if (visited.has(key)) return;
		visited.add(key);

		region.area++;

		for (let i = 0; i < dirs.length; i++) {
			const [dx, dy] = dirs[i];
			const [nx, ny] = [x + dx, y + dy];

			if (isOutOfBounds(nx, ny)) {
				region.perimeter++;
				continue;
			}

			const neighbor = grid[ny][nx];
			if (neighbor !== region.id) {
				region.perimeter++;
				continue;
			}

			findRegion(nx, ny, region);
		}

		return region;
	}

	let price = 0;

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			const key = toKey(x, y);
			if (visited.has(key)) continue;

			const region = findRegion(x, y, {
				id: grid[y][x],
				perimeter: 0,
				area: 0,
			});

			price += region.perimeter * region.area;
		}
	}

	return price;
}

part1().then(console.log);
