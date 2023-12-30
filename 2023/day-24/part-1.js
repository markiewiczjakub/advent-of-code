import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-24';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const linear = file.split(/\r?\n/).map((row) => {
	const [left, right] = row.split(' @ ');
	const [x, y] = left.split(', ').map((s) => Number(s.trim()));
	const [dx, dy] = right.split(', ').map((s) => Number(s.trim()));

	const a = dy / dx;
	const b = y - a * x;

	return {
		x,
		y,
		dx,
		dy,
		a,
		b,
	};
});

const [MIN, MAX] = [2_000_000_000_000_00, 4_000_000_000_000_00];
// const [MIN, MAX] = [7, 27];
let count = 0;
for (let i = 0; i < linear.length; i++) {
	for (let j = i + 1; j < linear.length; j++) {
		const { x: x1, dx: dx1, a: a1, b: b1 } = linear[i];
		const { x: x2, dx: dx2, a: a2, b: b2 } = linear[j];

		const x = (b2 - b1) / (a1 - a2);
		const y = a1 * x + b1;

		if (!isFinite(x) || !isFinite(y)) continue;
		if (x < MIN || x > MAX || y < MIN || y > MAX) continue;

		const t1 = (x - x1) / dx1;
		const t2 = (x - x2) / dx2;

		if (t1 < 0 || t2 < 0) continue;

		count++;
	}
}

console.log(count);
