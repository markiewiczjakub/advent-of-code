import { read } from '../helpers/read';

async function part1() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });
	const ranges: [string, string][] = content
		.split(',')
		.map((rangeUnparsed) => {
			const [min, max] = rangeUnparsed.split('-');
			return [min, max];
		});

	let sum = 0;
	for (const range of ranges) {
		const [min, max] = range;

		if (min.length === max.length && min.length % 2 === 1) continue;

		for (let i = Number(min); i <= Number(max); i++) {
			if (isMadeOfSequence(i.toString())) {
				sum += i;
			}
		}
	}

	return sum;
}

function isMadeOfSequence(value: string) {
	if (value.length % 2 === 1) return false;

	const middleIndex = value.length / 2;
	return (
		value.slice(0, middleIndex) === value.slice(middleIndex, value.length)
	);
}

part1().then(console.log);
