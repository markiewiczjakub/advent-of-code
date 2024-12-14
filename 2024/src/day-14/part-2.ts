import { writeFile, writeFileSync } from 'fs';
import { dirname } from 'path';
import { readByLine } from 'src/helpers/readByLine';
import { fileURLToPath } from 'url';

type Robot = {
	x: number;
	y: number;
	vx: number;
	vy: number;
};

const WIDTH = 101;
const HEIGHT = 103;

async function part1() {
	const robots: Robot[] = [];

	await new Promise<void>((resolve) =>
		readByLine({
			scope: import.meta.url,
			name: 'input.txt',
			onLine: (line) => {
				const [left, right] = line.split(/\s+/);

				const [x, y] = left.split('=')[1].split(',').map(Number);
				const [vx, vy] = right.split('=')[1].split(',').map(Number);

				robots.push({ x, y, vx, vy });
			},
			onClose: resolve,
		})
	);

	function getPositionAfterTime(
		robot: Robot,
		seconds: number
	): [number, number] {
		const { x, y, vx, vy } = robot;

		const dx = (x + seconds * vx) % WIDTH;
		const dy = (y + seconds * vy) % HEIGHT;

		const nx = dx < 0 ? WIDTH + dx : dx;
		const ny = dy < 0 ? HEIGHT + dy : dy;

		return [nx, ny];
	}

	function draw(robots: Robot[]): [boolean, string] {
		const map = new Array(HEIGHT)
			.fill(null)
			.map(() => new Array(WIDTH).fill('.'));

		// Find picture where no robots are in top of each other
		let hasTwo = false;

		for (let i = 0; i < robots.length; i++) {
			const { x, y } = robots[i];
			const item = map[y][x];
			if (item === '.') map[y][x] = 1;
			if (item !== '.') {
				map[y][x] = item + 1;
				hasTwo = true;
			}
		}

		return [hasTwo, map.map((e) => e.join('')).join('\n')];
	}

	const __dirname = dirname(fileURLToPath(import.meta.url));
	let t = 1;
	while (true) {
		for (let i = 0; i < robots.length; i++) {
			const [x, y] = getPositionAfterTime(robots[i], 1);
			robots[i].x = x;
			robots[i].y = y;
		}

		const [hasTwo, drawing] = draw(robots);
		if (!hasTwo) {
			writeFileSync(`${__dirname}/snap/${t}`, drawing);
			break;
		}
		t++;
	}
}

part1().then(console.log);
