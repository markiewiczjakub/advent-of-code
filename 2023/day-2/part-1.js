import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-2';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const limit = {
	red: 12,
	green: 13,
	blue: 14,
};

let gameIdsSum = 0;

const games = file.split(/\r?\n/);

gameLoop: for (const game of games) {
	const [gameMeta, setsData] = game.split(':');

	const gameId = Number(gameMeta.split(' ')[1]);

	const sets = setsData.trim().split(';');
	for (const set of sets) {
		const colorQuantities = {
			red: 0,
			green: 0,
			blue: 0,
		};

		const setPart = set.trim().split(',');
		for (const cubes of setPart) {
			const [quantity, color] = cubes.trim().split(' ');
			colorQuantities[color] += Number(quantity);
		}

		if (
			colorQuantities.red > limit.red ||
			colorQuantities.green > limit.green ||
			colorQuantities.blue > limit.blue
		)
			continue gameLoop;
	}

	gameIdsSum += gameId;
}

console.log(gameIdsSum);
