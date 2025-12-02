import { read } from '../helpers/read';

async function part2() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });
	const ranges: [number, number][] = content
		.split(',')
		.map((rangeUnparsed) => {
			const [min, max] = rangeUnparsed.split('-').map(Number);
			return [min, max];
		});

	let sum = 0;
	for (const range of ranges) {
		const [min, max] = range;

		for (let i = min; i <= max; i++) {
			if (isMadeOfSequence(i.toString())) {
				sum += i;
			}
		}
	}

	return sum;
}

function isMadeOfSequence(value: string) {
	if (value.length <= 1) return false;

	let sequence = value[0];
	let index = 1;
	while (index + sequence.length <= value.length) {
		const next = value.slice(index, index + sequence.length);
		if (next === sequence) {
			index += sequence.length;
			if (index === value.length) return true;
		} else {
			// Build next sequence
			sequence = value.slice(0, sequence.length + 1);
			index = sequence.length;
		}
	}

	return false;
}

part2().then(console.log);
