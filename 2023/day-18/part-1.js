import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-18';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();
const instructions = file.split(/\r?\n/).map((instruction) => {
	const [direction, steps, color] = instruction.split(/\s+/);
	return {
		direction,
		steps: Number(steps),
		color: color.match(/\((.*)\)/).pop(),
	};
});

const DIRS = {
	R: [1, 0],
	L: [-1, 0],
	U: [0, -1],
	D: [0, 1],
};

let currentPoint = [0, 0];
const polygon = [currentPoint];
const seen = new Set([key(currentPoint[0], currentPoint[1])]);
let instructionIndex = 0;

while (instructions[instructionIndex]) {
	const instruction = instructions[instructionIndex];
	const [dx, dy] = DIRS[instruction.direction];

	for (let i = 0; i < instruction.steps; i++) {
		const newPoint = [currentPoint[0] + dx, currentPoint[1] + dy];
		const seenKey = key(newPoint[0], newPoint[1]);

		if (!seen.has(seenKey)) {
			polygon.push(newPoint);
			seen.add(seenKey);
		}

		currentPoint = newPoint;
	}
	instructionIndex++;
}

let cubicMeters = polygon.length;

const minWidth = Math.min(...polygon.map(([x]) => x));
const minHeight = Math.min(...polygon.map(([, y]) => y));

const maxWidth = Math.max(...polygon.map(([x]) => x));
const maxHeight = Math.max(...polygon.map(([, y]) => y));

for (let x = minWidth; x <= maxWidth; x++) {
	for (let y = minHeight; y <= maxHeight; y++) {
		if (seen.has(key(x, y))) continue;
		if (isInsidePolygon([x, y], polygon)) {
			cubicMeters++;
		}
	}
}

console.log(cubicMeters);

function key() {
	return [...arguments].join('.');
}

function isInsidePolygon(point, poly) {
	let x = point[0],
		y = point[1];

	let inside = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const xi = poly[i][0],
			yi = poly[i][1];
		const xj = poly[j][0],
			yj = poly[j][1];

		let intersect =
			yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
		if (intersect) inside = !inside;
	}

	return inside;
}
