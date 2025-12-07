import { read } from '../helpers/read';

type Position = [number, number];
type Entities = 'S' | '.' | '^';
async function part2() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });

	const grid = content.split('\n').map((v) => v.split('') as Entities[]);

	let startPoint: Position = [0, 0];
	loop: for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			if (grid[y][x] === 'S') {
				startPoint = [x, y];
				break loop;
			}
		}
	}

	const cache = new Map<string, number>();
	type Beam = [number, number];
	function dfs(beam: Beam): number {
		const [x, y] = beam;
		const [nx, ny] = [x, y + 1];

		const cacheKey = `${nx}.${ny}`;
		if (cache.has(cacheKey)) return cache.get(cacheKey);

		if (grid[ny]?.[nx] === undefined) {
			return 1;
		}

		if (grid[ny][nx] === '^') {
			const result = dfs([nx - 1, ny]) + dfs([nx + 1, ny]);
			cache.set(cacheKey, result);
			return result;
		} else if (grid[ny][nx] === '.') {
			const result = dfs([nx, ny]);
			cache.set(cacheKey, result);
			return result;
		}
	}

	return dfs(startPoint);
}

part2().then(console.log);
