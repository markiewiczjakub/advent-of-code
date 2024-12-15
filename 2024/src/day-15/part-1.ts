import { read } from 'src/helpers/read';

type Vec = [number, number];
const dirByStep = {
	'>': [1, 0],
	'^': [0, -1],
	v: [0, 1],
	'<': [-1, 0],
};
type Step = keyof typeof dirByStep;

function isStep(value: string): value is Step {
	return value in dirByStep;
}

async function part1() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const [_map, _steps] = file.split('\n\n');

	const map = _map.split('\n').map((v) => v.split(''));
	const steps = _steps
		.replace(/\n+/g, '')
		.split('')
		.map((v) => {
			if (isStep(v)) return v;
			throw new Error(`Unknown step '${v}'`);
		});

	const current = [0, 0];
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[0].length; x++) {
			if (map[y][x] === '@') {
				current[0] = x;
				current[1] = y;
				break;
			}
		}
	}

	function move([x, y]: Vec, [dx, dy]: Vec, trail: Vec[] = []): boolean {
		if (map[y][x] === 'O') {
			trail.push([x, y]);
			return move([x + dx, y + dy], [dx, dy], trail);
		}

		if (map[y][x] === '#') {
			return false;
		}

		if (map[y][x] === '.') {
			let [sx, sy] = [x, y];
			while (trail.length) {
				const [tx, ty] = trail.pop();

				map[sy][sx] = 'O';
				map[ty][tx] = '.';

				[sx, sy] = [tx, ty];
			}

			return true;
		}

		return false;
	}

	function draw() {
		console.log(map.map((v) => v.join('')).join('\n'));
		console.log();
	}

	for (let i = 0; i < steps.length; i++) {
		const [x, y] = current;
		const [dx, dy] = dirByStep[steps[i]];
		const [nx, ny] = [x + dx, y + dy];

		const neighbor = map[ny][nx];
		if (neighbor === '#') continue;
		if (neighbor === '.') {
			map[y][x] = '.';
			map[ny][nx] = '@';
			current[0] = nx;
			current[1] = ny;
			continue;
		}

		if (neighbor !== 'O') continue;

		const hasMoved = move([nx, ny], [dx, dy]);
		if (hasMoved) {
			map[y][x] = '.';
			map[ny][nx] = '@';
			current[0] = nx;
			current[1] = ny;
			continue;
		}
	}
	draw();

	return map.reduce((acc, v, y) => {
		for (let x = 0; x < v.length; x++) {
			if (v[x] === 'O') {
				acc += 100 * y + x;
			}
		}

		return acc;
	}, 0);
}

part1().then(console.log);
