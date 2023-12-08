import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-8';
const DATA_FILE_NAMES = ['example-1.txt', 'example-2.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[2])).toString();

const [instructions, nodesData] = file.split(/\r?\n\r?\n/);

const nodes = {};

for (const node of nodesData.split(/\r?\n/)) {
	const [nodeId, edgesData] = node.split(' = ');
	const [left, right] = edgesData
		.substring(1, edgesData.length - 1)
		.split(', ');

	nodes[nodeId] = { L: left, R: right };
}

let currentNode = 'AAA';
let instructionIndex = 0;
let stepsCount = 0;

while (currentNode !== 'ZZZ') {
	if (instructions[instructionIndex] === undefined) instructionIndex = 0;

	stepsCount++;
	const instruction = instructions[instructionIndex];
	currentNode = nodes[currentNode][instruction];

	instructionIndex++;
}

console.log(stepsCount);
