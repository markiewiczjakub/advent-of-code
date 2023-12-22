import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

const ENTRY_DIR = '2023/day-22';
const DATA_FILE_NAMES = ['example.txt', 'input.txt'];

const file = readFileSync(join(ENTRY_DIR, '.', DATA_FILE_NAMES[1])).toString();

const pointsMap = new Map();
class Point {
	static of(x, y, z) {
		const key = `${x}.${y}.${z}`;
		if (pointsMap.has(key)) return pointsMap.get(key);

		const newPoint = new Point(x, y, z);
		pointsMap.set(key, newPoint);
		return newPoint;
	}

	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	compare(otherPoint) {
		return this === otherPoint;
	}

	add(x, y, z) {
		return Point.of(this.x + x, this.y + y, this.z + z);
	}
}

class Brick {
	constructor(head, tail, id) {
		this.id = id;
		this.points = [];
		this.head = Point.of(...head);
		this.tail = Point.of(...tail);

		this.getPoints();
	}

	getPoints() {
		const isDiffX = this.head.x !== this.tail.x;
		const isDiffY = this.head.y !== this.tail.y;
		const isDiffZ = this.head.z !== this.tail.z;

		const points = [];

		const getMinMax = (axis) => [
			Math.min(this.head[axis], this.tail[axis]),
			Math.max(this.head[axis], this.tail[axis]),
		];

		if (isDiffX) {
			const [min, max] = getMinMax('x');
			for (let i = min; i <= max; i++) {
				points.push(Point.of(i, this.head.y, this.head.z));
			}
		}

		if (isDiffY) {
			const [min, max] = getMinMax('y');
			for (let i = min; i <= max; i++) {
				points.push(Point.of(this.head.x, i, this.head.z));
			}
		}

		if (isDiffZ) {
			const [min, max] = getMinMax('z');
			for (let i = min; i <= max; i++) {
				points.push(Point.of(this.head.x, this.head.y, i));
			}
		}

		this.points = points;
	}

	getLowestPoint() {
		return this.head.z > this.tail.z ? this.tail : this.head;
	}

	getHighestPoint() {
		return this.head.z > this.tail.z ? this.head : this.tail;
	}

	lower(z) {
		this.head = this.head.add(0, 0, -z);
		this.tail = this.tail.add(0, 0, -z);
		for (let i = 0; i < this.points.length; i++) {
			this.points[i] = this.points[i].add(0, 0, -z);
		}
	}

	intersectsWith(brick) {
		for (const point of this.points) {
			for (const brickPoint of brick.points) {
				if (
					point.add(0, 0, -1).compare(brickPoint) ||
					point.add(0, 0, 1).compare(brickPoint)
				) {
					return true;
				}
			}
		}

		return false;
	}
}

const bricksMap = new Map();
const bricks = file.split(/\r?\n/).map((row, i) => {
	let [head, tail] = row.split('~');
	head = head.split(',').map(Number);
	tail = tail.split(',').map(Number);

	const brick = new Brick(head, tail, i);
	bricksMap.set(i, brick);
	return brick;
});

// lower bricks
const bricksSorted = bricks.sort((a, b) => {
	if (a.getLowestPoint().z > b.getLowestPoint().z) return 1;
	else return -1;
});

// lowering bricks
const stack = [...bricksSorted];
const lowered = [];
while (stack.length) {
	const brick = stack.shift();
	while (
		brick.getLowestPoint().z > 1 &&
		!lowered.some((otherBrick) => brick.intersectsWith(otherBrick))
	) {
		brick.lower(1);
	}
	lowered.push(brick);
}

const edgesMap = new Map();

for (const brick of bricks) {
	let edges;
	if (!edgesMap.has(brick.id)) {
		edges = [];
		edgesMap.set(brick.id, edges);
	} else {
		edges = edgesMap.get(brick.id);
	}

	for (const otherBrick of bricks) {
		if (brick === otherBrick) continue;

		if (brick.intersectsWith(otherBrick)) {
			edges.push(otherBrick.id);
		}
	}
}

console.log([...edgesMap.values()].filter((c) => c.length > 2).length);
// TODO: Make it work
