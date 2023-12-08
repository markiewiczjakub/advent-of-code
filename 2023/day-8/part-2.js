import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-8';
const DATA_FILE_NAMES = ['example-part-2.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const [instructions, nodesData] = file.split(/\r?\n\r?\n/);

const nodes = {};

for (const node of nodesData.split(/\r?\n/)) {
	const [nodeId, edgesData] = node.split(' = ');
	const [left, right] = edgesData
		.substring(1, edgesData.length - 1)
		.split(', ');

	nodes[nodeId] = { L: left, R: right };
}

const currentNodes = Object.keys(nodes).filter((nodeId) =>
	nodeId.endsWith('A')
);
const stepCounts = [];
let instructionIndex = 0;

for (let i = 0; i < currentNodes.length; i++) {
	let currentNode = currentNodes[i];
	let stepsCount = 0;

	while (!currentNode.endsWith('Z')) {
		if (instructions[instructionIndex] === undefined) instructionIndex = 0;

		stepsCount++;

		const instruction = instructions[instructionIndex];
		currentNode = nodes[currentNode][instruction];

		instructionIndex++;
	}

	stepCounts[i] = stepsCount;
}

// Least common multiply
const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const lcmAll = (ns) => ns.reduce(lcm, 1);

console.log(lcmAll(stepCounts));
