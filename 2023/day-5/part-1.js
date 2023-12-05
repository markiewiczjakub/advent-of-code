import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-5';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const rows = file.split(/\r?\n\r?\n/);

let [, seeds] = rows.shift().split(':');
seeds = seeds.trim().split(' ').map(Number);

const steps = [];

for (const map of rows) {
	let [, values] = map.split(/:\r?\n/);
	values = values
		.split(/\r?\n/)
		.map((v) => v.split(' ').map(Number))
		.map(([destinationStart, sourceStart, range]) => ({
			destStart: destinationStart,
			destEnd: destinationStart + range - 1,
			sourceStart,
			sourceEnd: sourceStart + range - 1,
			delta: range,
		}));

	steps.push(values);
}

let minLocation = Infinity;
for (const seed of seeds) {
	let current = seed;

	for (const step of steps) {
		for (const { sourceStart, sourceEnd, destStart } of step) {
			if (current >= sourceStart && current <= sourceEnd) {
				const delta = current - sourceStart;
				const destination = destStart + delta;
				current = destination;

				break;
			}
		}
	}

	if (current < minLocation) minLocation = current;
}

console.log(minLocation);
