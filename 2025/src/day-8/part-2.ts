import { read } from '../helpers/read';

type Vector = [number, number, number];
async function part1() {
	const content = await read({ scope: import.meta.url, name: 'input.txt' });
	const vectors = content
		.split('\n')
		.map((v) => v.split(',').map(Number) as Vector);

	const pairs: [Vector, Vector, number][] = [];
	for (let i = 0; i < vectors.length; i++) {
		const vector1 = vectors[i];
		for (let j = i + 1; j < vectors.length; j++) {
			const vector2 = vectors[j];
			const [x1, y1, z1] = vector1;
			const [x2, y2, z2] = vector2;
			const distance = Math.sqrt(
				(x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2
			);
			pairs.push([vector1, vector2, distance]);
		}
	}
	pairs.sort((a, b) => a[2] - b[2]);

	const vectorKey = ([x, y, z]: Vector) => `${x}.${y}.${z}`;
	let circuitId = 0;
	const junctionBoxes = new Map<string, number>();
	const circuitN = new Map<number, number>();
	const circuits = new Set<number>();

	const lastStandingCircuits: [number, number][] = [];
	for (let i = 0; i < pairs.length; i++) {
		const [vector1, vector2] = pairs[i];

		const v1Key = vectorKey(vector1);
		const v2Key = vectorKey(vector2);

		if (!junctionBoxes.has(v1Key) && !junctionBoxes.has(v2Key)) {
			junctionBoxes.set(v1Key, circuitId);
			junctionBoxes.set(v2Key, circuitId);
			circuitN.set(circuitId, 2);
			circuitId++;
			circuits.add(circuitId);
		} else if (junctionBoxes.has(v1Key) && !junctionBoxes.has(v2Key)) {
			const vectorCircuitId = junctionBoxes.get(v1Key);
			junctionBoxes.set(v2Key, vectorCircuitId);
			circuitN.set(vectorCircuitId, circuitN.get(vectorCircuitId) + 1);
		} else if (!junctionBoxes.has(v1Key) && junctionBoxes.has(v2Key)) {
			const vectorCircuitId = junctionBoxes.get(v2Key);
			junctionBoxes.set(v1Key, vectorCircuitId);
			circuitN.set(vectorCircuitId, circuitN.get(vectorCircuitId) + 1);
		} else if (junctionBoxes.has(v1Key) && junctionBoxes.has(v2Key)) {
			const v1Circuit = junctionBoxes.get(v1Key);
			const v2Circuit = junctionBoxes.get(v2Key);

			if (v1Circuit === v2Circuit) continue;

			circuitN.set(
				v1Circuit,
				circuitN.get(v1Circuit) + circuitN.get(v2Circuit)
			);

			circuits.delete(v2Circuit);

			for (const [key, value] of junctionBoxes.entries()) {
				if (value !== v2Circuit) continue;
				junctionBoxes.set(key, v1Circuit);
			}
		}
		if (circuits.size === 2) {
			lastStandingCircuits.push([vector1[0], vector2[0]]);
		}
	}

	const [a, b] = lastStandingCircuits[lastStandingCircuits.length - 1];
	return a * b;
}

part1().then(console.log);
