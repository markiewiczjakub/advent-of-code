import { read } from '../helpers/read';

async function part1() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });
	const [rangesUnparsed, numbers] = content
		.split('\n\n')
		.map((v) => v.split('\n'));

	const ranges = rangesUnparsed.map(
		(v) => v.split('-').map(Number) as [number, number]
	);

	let n = 0;
	for (let numberUnparsed of numbers) {
		const number = Number(numberUnparsed);

		for (const [min, max] of ranges) {
			if (number >= min && number <= max) {
				n++;
				break;
			}
		}
	}

	return n;
}

part1().then(console.log);
