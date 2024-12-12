import { readByLine } from 'src/helpers/readByLine';

type Vec = [number, number];
type Region = {
	id: string;
	edges: number;
	area: number;
};

const dirs: Vec[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

const convexCorners: Vec[][] = [
	//	__
	//	 |
	[
		[0, -1],
		[1, 0],
	],
	//	  |
	//	--
	[
		[1, 0],
		[0, 1],
	],
	//  |
	//	--
	[
		[0, 1],
		[-1, 0],
	],
	//	__
	// |
	[
		[-1, 0],
		[0, -1],
	],
];

const concaveCorners: Vec[][] = [
	//  |
	//	--
	[
		[0, -1],
		[1, 0],
		[1, -1],
	],
	//  --
	// |
	[
		[1, 0],
		[0, 1],
		[1, 1],
	],
	//  --
	//   |
	[
		[0, 1],
		[-1, 0],
		[-1, 1],
	],
	//   |
	// --
	[
		[-1, 0],
		[0, -1],
		[-1, -1],
	],
];

async function part2() {
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

		for (let i = 0; i < convexCorners.length; i++) {
			const [[ax, ay], [bx, by]] = concaveCorners[i];

			const [p1x, p1y] = [x + ax, y + ay];
			const [p2x, p2y] = [x + bx, y + by];

			const p1neighbor = grid[p1y]?.[p1x];
			const p2neighbor = grid[p2y]?.[p2x];
			if (
				(isOutOfBounds(p1x, p1y) || p1neighbor !== region.id) &&
				(isOutOfBounds(p2x, p2y) || p2neighbor !== region.id)
			) {
				region.edges++;
			}
		}

		for (let i = 0; i < convexCorners.length; i++) {
			const [[ax, ay], [bx, by], [cx, cy]] = concaveCorners[i];

			const [p1x, p1y] = [x + ax, y + ay];
			const [p2x, p2y] = [x + bx, y + by];
			const [p3x, p3y] = [x + cx, y + cy];

			const p1neighbor = grid[p1y]?.[p1x];
			const p2neighbor = grid[p2y]?.[p2x];
			const p3neighbor = grid[p3y]?.[p3x];
			if (
				(isOutOfBounds(p3x, p3y) || p3neighbor !== region.id) &&
				p1neighbor === region.id &&
				p2neighbor === region.id
			) {
				region.edges++;
			}
		}

		for (let i = 0; i < dirs.length; i++) {
			const [dx, dy] = dirs[i];
			const [nx, ny] = [x + dx, y + dy];

			if (isOutOfBounds(nx, ny)) {
				continue;
			}

			const neighbor = grid[ny][nx];
			if (neighbor !== region.id) {
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
				edges: 0,
				area: 0,
			});

			price += region.edges * region.area;
		}
	}

	return price;
}

part2().then(console.log);
