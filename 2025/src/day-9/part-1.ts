import { read } from '../helpers/read';

type Vector = [number, number];
async function part1() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });
	const vectors = content
		.split('\n')
		.map((v) => v.split(',').map(Number) as Vector)
		.sort((a, b) => a[0] - b[0]);

	let maxArea = -Infinity;

	for (let i = 0; i < vectors.length; i++) {
		const [x1, y1] = vectors[i];
		for (let j = i + 1; j < vectors.length; j++) {
			const [x2, y2] = vectors[j];

			const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
			maxArea = Math.max(maxArea, area);
		}
	}

	return maxArea;
}

part1().then(console.log);
