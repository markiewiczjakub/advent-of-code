import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-6';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const [timeData, distanceData] = file.split(/\r?\n/);
const times = timeData.split(':')[1].trim().split(/\s+/).map(Number);
const distances = distanceData.split(':')[1].trim().split(/\s+/).map(Number);

let timeMultiply = 1;

for (let i = 0; i < times.length; i++) {
	const time = times[i];
	const distance = distances[i];

	// -x^2 + tx - d = 0, where
	// x - how long button should be pressed
	// t - time
	// d - distance
	const delta = time ** 2 - 4 * -1 * -distance;
	const x1 = Math.ceil(((-time - Math.sqrt(delta)) / 2) * -1 - 1);
	const x2 = Math.floor(((-time + Math.sqrt(delta)) / 2) * -1 + 1);

	const diff = x1 - x2 + 1;
	timeMultiply *= diff;
}

console.log(timeMultiply);
