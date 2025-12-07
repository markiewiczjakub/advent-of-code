import { read } from '../helpers/read';

type Position = [number, number];
type Entities = 'S' | '.' | '^';
async function part1() {
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
	const [sx, sy] = startPoint;

	type Beam = { pos: Position; done: boolean };
	let beams: Beam[] = [{ pos: [sx, sy + 1], done: false }];

	let splits = 0;

	function addBeam(b: Beam, bs: Beam[]) {
		if (bs.some((bc) => bc.pos[0] === b.pos[0] && bc.pos[1] === b.pos[1]))
			return false;
		bs.push(b);
	}

	while (!beams.every((b) => b.done)) {
		const newBeams: Beam[] = [];

		for (const {
			pos: [x, y],
		} of beams) {
			const [nx, ny] = [x, y + 1];

			if (grid[ny]?.[nx] === undefined) {
				newBeams.push({ pos: [nx, ny], done: true });
				continue;
			}

			if (grid[ny][nx] === '^') {
				splits++;

				addBeam(
					{
						pos: [nx - 1, ny],
						done: false,
					},
					newBeams
				);
				addBeam(
					{
						pos: [nx + 1, ny],
						done: false,
					},
					newBeams
				);
			} else if (grid[ny][nx] === '.') {
				addBeam({ pos: [nx, ny], done: false }, newBeams);
			}
		}

		beams = newBeams;
	}

	console.log(beams);

	return splits;
}

part1().then(console.log);
