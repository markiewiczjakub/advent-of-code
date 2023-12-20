import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-20';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const modules = file.split(/\r?\n/).reduce((acc, row) => {
	let [from, to] = row.split(' -> ');

	let type = 'none';
	if (from === 'broadcaster') type = 'broadcast';

	const types = {
		'%': 'flip-flop',
		'&': 'conjunction',
	};
	if (types[from[0]] !== undefined) {
		type = types[from[0]];
		from = from.slice(1);
	}

	acc[from] = {
		type,
		state: type === 'flip-flop' ? 0 : {},
		inputs: [],
		outputs: to.split(', '),
	};

	return acc;
}, {});

for (const [, m] of Object.entries(modules)) {
	for (const output of m.outputs) {
		if (modules[output] !== undefined) continue;

		modules[output] = {
			type: 'none',
			state: 0,
			inputs: [],
			outputs: [],
		};
	}
}

for (const [from, m] of Object.entries(modules)) {
	for (const output of m.outputs) {
		if (modules[output] === undefined) continue;
		if (modules[output].inputs.includes(from)) continue;
		modules[output].inputs.push(from);
	}
}

for (const [, m] of Object.entries(modules)) {
	if (m.type !== 'conjunction') continue;

	for (const input of m.inputs) {
		m.state[input] = 0;
	}
}

let high = 0;
let low = 0;
const stack = [];

function pulse({ to, from, type }) {
	if (type === 'low') low++;
	if (type === 'high') high++;

	const m = modules[to];

	if (m.type === 'broadcast') {
		for (const output of m.outputs) {
			stack.push({ to: output, from: to, type });
		}
		return;
	}

	if (m.type === 'flip-flop') {
		if (type !== 'low') return;
		const prevState = m.state;
		m.state = prevState === 0 ? 1 : 0;

		for (const output of m.outputs) {
			stack.push({
				to: output,
				from: to,
				type: prevState === 0 ? 'high' : 'low',
			});
		}
		return;
	}

	if (m.type === 'conjunction') {
		m.state[from] = type;
		const areEveryHigh = Object.values(m.state).every((s) => s === 'high');

		for (const output of m.outputs) {
			stack.push({
				to: output,
				from: to,
				type: areEveryHigh ? 'low' : 'high',
			});
		}
	}
}

for (let i = 0; i < 1000; i++) {
	stack.push({
		to: 'broadcaster',
		from: null,
		type: 'low',
	});

	while (stack.length) {
		pulse(stack.shift());
	}
}

console.log(low * high);
