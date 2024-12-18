import { read } from 'src/helpers/read';

const WIDTH = 71;
const HEIGHT = 71;

type Vec = [number, number];

const directions: Vec[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
];

class PriorityQueue<T> {
	private heap: { value: T; priority: number }[] = [];

	enqueue(value: T, priority: number) {
		this.heap.push({ value, priority });
		this.heap.sort((a, b) => a.priority - b.priority);
	}

	dequeue(): T | undefined {
		return this.heap.shift()?.value;
	}

	isEmpty(): boolean {
		return this.heap.length === 0;
	}
}

async function part2() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const coords = file.split('\n').map((r) => r.split(',').map(Number) as Vec);

	function toKey(...args: unknown[]) {
		return args.join('.');
	}

	const grid: string[][] = new Array(HEIGHT)
		.fill(null)
		.map(() => new Array(WIDTH).fill('.'));

	function heuristic([x1, y1]: Vec, [x2, y2]: Vec) {
		return Math.abs(x1 - x2) + Math.abs(y1 - y2);
	}

	function findPath() {
		const pq = new PriorityQueue<Vec>();
		const scores = new Map<string, number>();

		const [sx, sy] = [0, 0];
		scores.set(toKey(sx, sy), 1);

		const [ex, ey] = [WIDTH - 1, HEIGHT - 1];

		pq.enqueue([sx, sy], heuristic([sx, sy], [ex, ey]));

		while (!pq.isEmpty()) {
			const [x, y] = pq.dequeue();
			const key = toKey(x, y);

			if (x === ex && y === ey) {
				return scores.get(key) - 1;
			}

			for (let i = 0; i < directions.length; i++) {
				const [dx, dy] = directions[i];
				const [nx, ny] = [x + dx, y + dy];

				if (grid[ny]?.[nx] === undefined) continue;
				if (grid[ny][nx] === '#') continue;

				const neighborKey = toKey(nx, ny);

				const score = scores.get(key) + 1;
				if (
					!scores.has(neighborKey) ||
					score < scores.get(neighborKey)
				) {
					scores.set(neighborKey, score);
					pq.enqueue([nx, ny], score + heuristic([nx, ny], [ex, ey]));
				}
			}
		}

		return null;
	}

	for (let i = 0; i < coords.length; i++) {
		const [x, y] = coords[i];
		grid[y][x] = '#';

		if (i >= 1024) {
			const score = findPath();
			if (score === null) {
				return `${x},${y}`;
			}
		}
	}
}

part2().then(console.log);
