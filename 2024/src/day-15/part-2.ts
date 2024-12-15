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

async function part2() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const [_map, _steps] = file.split('\n\n');

	const map = _map.split('\n').map((v) =>
		v.split('').flatMap((tile) => {
			if (tile === '#') return ['#', '#'];
			if (tile === 'O') return ['[', ']'];
			if (tile === '.') return ['.', '.'];
			if (tile === '@') return ['@', '.'];
		})
	);
	const steps = _steps
		.replace(/\n+/g, '')
		.split('')
		.map((v) => {
			if (isStep(v)) return v;
			throw new Error(`Unknown step '${v}'`);
		});

	draw();

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

	function findConnectedBoxes(
		[x, y]: Vec,
		[dx, dy]: Vec,
		boxes: Array<[Vec, Vec]> = [],
		visited = new Set<string>()
	) {
		const tile = map[y][x];
		if (tile === '[' || tile === ']') {
			if (visited.has(`${x}.${y}`)) return;

			const box: Vec[] = [[x, y]];
			if (tile === ']') {
				box.unshift([x - 1, y]);
				visited.add(`${x - 1}.${y}`);
			} else {
				box.push([x + 1, y]);
				visited.add(`${x + 1}.${y}`);
			}

			boxes.push(box as [Vec, Vec]);

			for (let i = 0; i < 2; i++) {
				const [bx, by] = box[i];
				findConnectedBoxes(
					[bx + dx, by + dy],
					[dx, dy],
					boxes,
					visited
				);
			}
		}

		return boxes;
	}
	function move([x, y]: Vec, [dx, dy]: Vec): boolean {
		const boxes = findConnectedBoxes([x, y], [dx, dy]);

		let canMove = true;
		for (let i = 0; i < boxes.length; i++) {
			const [[x1, y1], [x2, y2]] = boxes[i];
			const [[nx1, ny1], [nx2, ny2]] = [
				[x1 + dx, y1 + dy],
				[x2 + dx, y2 + dy],
			];

			const n1 = map[ny1][nx1];
			const n2 = map[ny2][nx2];

			if (n1 === '#' || n2 === '#') {
				canMove = false;
				break;
			}
		}

		if (canMove) {
			// clear area
			for (let i = 0; i < boxes.length; i++) {
				const [[x1, y1], [x2, y2]] = boxes[i];
				map[y1][x1] = '.';
				map[y2][x2] = '.';
			}

			for (let i = 0; i < boxes.length; i++) {
				const [[x1, y1], [x2, y2]] = boxes[i];
				const [[nx1, ny1], [nx2, ny2]] = [
					[x1 + dx, y1 + dy],
					[x2 + dx, y2 + dy],
				];

				map[ny1][nx1] = '[';
				map[ny2][nx2] = ']';
			}
		}
		return canMove;
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

		if (neighbor !== '[' && neighbor !== ']') continue;

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
			if (v[x] === '[') {
				acc += 100 * y + x;
			}
		}

		return acc;
	}, 0);
}

part2().then(console.log);
