import { readByLine } from 'src/helpers/readByLine';

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

	for (let i = 0; i < robots.length; i++) {
		const [x, y] = getPositionAfterTime(robots[i], 100);
		robots[i].x = x;
		robots[i].y = y;
	}

	const halfWidth = (WIDTH - 1) / 2;
	const halfHeight = (HEIGHT - 1) / 2;
	const quadrants = [
		[0, 0, halfWidth - 1, halfHeight - 1],
		[halfWidth + 1, 0, WIDTH - 1, halfHeight - 1],
		[0, halfHeight + 1, halfWidth - 1, HEIGHT - 1],
		[halfWidth + 1, halfHeight + 1, WIDTH - 1, HEIGHT - 1],
	];

	let safetyScore: number = 1;
	for (let i = 0; i < quadrants.length; i++) {
		const [x, y, ex, ey] = quadrants[i];

		let sum = 0;
		for (let j = 0; j < robots.length; j++) {
			const { x: rx, y: ry } = robots[j];
			if (rx >= x && rx <= ex && ry >= y && ry <= ey) sum++;
		}
		safetyScore *= sum;
	}

	return safetyScore;
}

part1().then(console.log);
