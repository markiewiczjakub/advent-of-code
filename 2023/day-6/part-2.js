import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-6';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const [timeData, distanceData] = file.split(/\r?\n/);
const time = Number(timeData.split(':')[1].trim().replace(/\s+/g, ''));
const distance = Number(distanceData.split(':')[1].trim().replace(/\s+/g, ''));

const delta = time ** 2 - 4 * -1 * -distance;
const x1 = Math.ceil(((-time - Math.sqrt(delta)) / 2) * -1 - 1);
const x2 = Math.floor(((-time + Math.sqrt(delta)) / 2) * -1 + 1);

const diff = x1 - x2 + 1;

console.log(diff);
