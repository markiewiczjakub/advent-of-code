import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-12';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const { springs, numbers } = file
	.split(/\r?\n/)
	.map((value) => {
		const [spring, number] = value.split(' ').map((v) => v.trim());
		return [spring, number.split(',').map(Number)];
	})
	.reduce(
		(acc, value) => {
			acc.springs.push(value[0]);
			acc.numbers.push(value[1]);
			return acc;
		},
		{
			springs: [],
			numbers: [],
		}
	);

function countGroups(springArray) {
	return springArray
		.join('')
		.replace(/\.+/g, ' ')
		.trim()
		.split(' ')
		.map((group) => group.length);
}

function generateCombinationsCount(spring, num, index = 0, count = 0) {
	if (index === spring.length) {
		if (areCountsSame(countGroups(spring), num)) return 1;
		return 0;
	}

	const incIndex = index + 1;
	if (spring[index] === '?') {
		for (const char of ['.', '#']) {
			spring[index] = char;
			count += generateCombinationsCount([...spring], num, incIndex);
		}

		spring[index] = '?';
	} else {
		count += generateCombinationsCount(spring, num, incIndex);
	}

	return count;
}

function areCountsSame(c1, c2) {
	if (c1.length !== c2.length) return false;
	return c1.every((value, i) => value === c2[i]);
}

let sum = 0;
for (let i = 0; i < springs.length; i++) {
	const springArray = springs[i].split('');
	const combinations = generateCombinationsCount(springArray, numbers[i]);
	sum += combinations;
}

console.log(sum);
