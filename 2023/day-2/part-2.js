import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-2';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

let powersSum = 0;

const games = file.split(/\r?\n/);

for (const game of games) {
	const [gameMeta, setsData] = game.split(':');

	const gameId = Number(gameMeta.split(' ')[1]);

	const colorMaxQuantities = {
		red: -Infinity,
		green: -Infinity,
		blue: -Infinity,
	};

	const sets = setsData.trim().split(';');
	for (const set of sets) {
		const setPart = set.trim().split(',');
		for (const cubes of setPart) {
			let [quantity, color] = cubes.trim().split(' ');
			quantity = Number(quantity);

			if (quantity > colorMaxQuantities[color])
				colorMaxQuantities[color] = quantity;
		}
	}

	const powerOfQuantities = Object.values(colorMaxQuantities).reduce(
		(power, value) => power * value,
		1
	);
	powersSum += powerOfQuantities;
}

console.log(powersSum);
