import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-19';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();
let [conditions, parts] = file.split(/\r?\n\r?\n/);

conditions = conditions.split(/\r?\n/).reduce((acc, s) => {
	const [, from, list] = s.match(/(\w+){(.*)}/);

	const ifs = list.split(',');
	const defaultValue = ifs.pop();
	acc[from] = {
		ifs: ifs.map((ifString) => {
			const [c, v] = ifString.split(':');
			const [left, sign, right] = c.match(/([a-zA-Z]+)|([<>])|(\d+)/g);
			return {
				left,
				sign,
				right: Number(right),
				ok: v,
			};
		}),
		defaultValue,
	};

	return acc;
}, {});

parts = parts.split(/\r?\n/).map((s) => {
	const [, list] = s.match(/{(.*)}/);

	return list.split(',').reduce((acc, part) => {
		const [variable, value] = part.split('=');
		acc[variable] = Number(value);

		return acc;
	}, {});
});

function runCondition(left, sign, right, post) {
	left = post[left];

	if (sign === '>') return left > right;
	else if (sign === '<') return left < right;

	throw new Error(`Unknown sign "${sign}"`);
}

let sum = 0;
for (const part of parts) {
	let current = 'in';

	while (current !== 'A' && current !== 'R') {
		const { ifs, defaultValue } = conditions[current];

		let evaluation = false;
		for (const { left, sign, right, ok } of ifs) {
			evaluation = runCondition(left, sign, right, part);
			if (evaluation === true) {
				current = ok;
				break;
			}
		}

		if (evaluation === false) {
			current = defaultValue;
		}
	}

	if (current === 'R') continue;
	sum += Object.values(part).reduce((s, v) => (s += v), 0);
}

console.log(sum);
