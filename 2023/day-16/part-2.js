import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-16';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const map = file.split(/\r?\n/);

function getPositionsCount(startPosition, startDirection) {
	const cache = {};
	const positions = new Set();
	function move([x, y], [dx, dy]) {
		const [nx, ny] = [x + dx, y + dy];

		if (nx < 0 || nx > map[0].length - 1 || ny < 0 || ny > map.length - 1) {
			return;
		}

		positions.add(key(nx, ny));

		if (cache[key(nx, ny, dx, dy)]) return;
		cache[key(nx, ny, dx, dy)] = true;

		const mirror = map[ny][nx];
		switch (mirror) {
			case '-':
				if (dy === 0) {
					move([nx, ny], [dx, dy]);
					break;
				}
				move([nx, ny], [-1, 0]);
				move([nx, ny], [1, 0]);
				break;
			case '|':
				if (dx === 0) {
					move([nx, ny], [dx, dy]);
					break;
				}
				move([nx, ny], [0, -1]);
				move([nx, ny], [0, 1]);
				break;
			case '/': {
				let dir;
				if (dx === 1 && dy === 0) {
					dir = [0, -1];
				} else if (dx === -1 && dy === 0) {
					dir = [0, 1];
				} else if (dx === 0 && dy === 1) {
					dir = [-1, 0];
				} else if (dx === 0 && dy === -1) {
					dir = [1, 0];
				}
				move([nx, ny], dir);
				break;
			}
			case '\\': {
				let dir;
				if (dx === 1 && dy === 0) {
					dir = [0, 1];
				} else if (dx === -1 && dy === 0) {
					dir = [0, -1];
				} else if (dx === 0 && dy === 1) {
					dir = [1, 0];
				} else if (dx === 0 && dy === -1) {
					dir = [-1, 0];
				}
				move([nx, ny], dir);
				break;
			}
			case '.':
				move([nx, ny], [dx, dy]);
				break;
		}
		return;
	}

	move(startPosition, startDirection);

	function key() {
		return [...arguments].join('.');
	}

	return positions.size;
}

let maxEnergized = -Infinity;

// top & bottom
for (let i = 0; i < map[0].length; i++) {
	maxEnergized = Math.max(maxEnergized, getPositionsCount([i, -1], [0, 1]));
	maxEnergized = Math.max(
		maxEnergized,
		getPositionsCount([i, map.length], [0, -1])
	);
}

// left & right
for (let i = 0; i < map.length; i++) {
	maxEnergized = Math.max(maxEnergized, getPositionsCount([-1, i], [1, 0]));
	maxEnergized = Math.max(
		maxEnergized,
		getPositionsCount([map[0].length, i], [-1, 0])
	);
}

console.log(maxEnergized);
