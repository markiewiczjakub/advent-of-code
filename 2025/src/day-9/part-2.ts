import { read } from '../helpers/read';

type Vector = [number, number];
type Line = { start: Vector; end: Vector };
async function part2() {
	const content = await read({ scope: import.meta.url, name: 'test.txt' });
	const vectors = content
		.split('\n')
		.map((v) => v.split(',').map(Number) as Vector);

	const lines: Line[] = [];

	for (let i = 0; i < vectors.length; i++) {
		const start = vectors[i];
		const end = i + 1 === vectors.length ? vectors[0] : vectors[i + 1];
		lines.push({ start, end });
	}

	for (let i = 0; i < vectors.length; i++) {
		for (let j = i + 1; j < vectors.length; j++) {
			/**
			 *   a ---- b
			 *   |      |
			 *   d ---- c
			 */
			const [xa, ya] = vectors[i];
			const [xc, yc] = vectors[j];
			const [xb, yb] = [xa + (xc - xa), ya];
			const [xd, yd] = [xa, ya + (yc - ya)];

			console.log([xa, ya], [xb, yb], [xc, yc], [xd, yd]);
			// TODO
		}
	}

	return 0;
}

part2().then(console.log);
