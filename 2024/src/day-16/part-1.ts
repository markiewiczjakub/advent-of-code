import { read } from 'src/helpers/read';

type Vec = [number, number];
type Direction = 'N' | 'E' | 'S' | 'W';

type State = {
	x: number;
	y: number;
	dir: Direction;
	score: number;
};

const directions: Record<Direction, Vec> = {
	N: [0, -1],
	E: [1, 0],
	S: [0, 1],
	W: [-1, 0],
};

const rotateRight: Record<Direction, Direction> = {
	N: 'E',
	E: 'S',
	S: 'W',
	W: 'N',
};

const rotateLeft: Record<Direction, Direction> = {
	N: 'W',
	W: 'S',
	S: 'E',
	E: 'N',
};

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

async function part1() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const map = file.split('\n');

	function toKey(...args: unknown[]) {
		return args.join('.');
	}

	function findLowestScore(maze: string[]): number | null {
		let [sx, sy] = [0, 0];
		for (let y = 0; y < maze.length; y++) {
			for (let x = 0; x < maze[0].length; x++) {
				if (maze[y][x] === 'S') {
					sx = x;
					sy = y;
					break;
				}
			}
		}

		const queue = new PriorityQueue<State>();
		queue.enqueue({ x: sx, y: sy, dir: 'E', score: 0 }, 0);

		const visited = new Set<string>();

		const isValid = ([x, y]: Vec) =>
			maze[y]?.[x] !== undefined && maze[y][x] !== '#';

		while (!queue.isEmpty()) {
			const current = queue.dequeue()!;
			const { x, y, dir, score } = current;

			if (maze[y][x] === 'E') {
				return score;
			}

			const stateKey = toKey(x, y, dir);
			if (visited.has(stateKey)) continue;
			visited.add(stateKey);

			// step
			const [dx, dy] = directions[dir];
			const newX = x + dx;
			const newY = y + dy;
			if (isValid([newX, newY])) {
				queue.enqueue(
					{ x: newX, y: newY, dir, score: score + 1 },
					score + 1
				);
			}

			// clockwise
			const rightDir = rotateRight[dir];
			if (!visited.has(toKey(x, y, rightDir))) {
				queue.enqueue(
					{ x, y, dir: rightDir, score: score + 1000 },
					score + 1000
				);
			}

			// counterclockwise
			const leftDir = rotateLeft[dir];
			if (!visited.has(toKey(x, y, leftDir))) {
				queue.enqueue(
					{ x, y, dir: leftDir, score: score + 1000 },
					score + 1000
				);
			}
		}

		return null;
	}

	return findLowestScore(map);
}

part1().then(console.log);
