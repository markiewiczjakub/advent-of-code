import { read } from '../helpers/read';

async function part2() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });
	const [rangesUnparsed] = content.split('\n\n').map((v) => v.split('\n'));

	let ranges = rangesUnparsed
		.map((v) => v.split('-').map(Number) as [number, number])
		.sort((a, b) => a[0] - b[0]);

	const merged: [number, number][] = [];
	for (const [min, max] of ranges) {
		if (merged.length === 0) {
			merged.push([min, max]);
			continue;
		}

		const [min1, max1] = merged[merged.length - 1];
		if (max1 < min - 1) {
			merged.push([min, max]);
		} else {
			merged[merged.length - 1] = [min1, Math.max(max1, max)]; 
		}
	}

	let n = 0;
	for (let [min, max] of merged) {
		n += max - min + 1;
	}

	return n;
}

part2().then(console.log);
