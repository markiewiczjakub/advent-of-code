import { read } from 'src/helpers/read';

enum OPCODE {
	ADV = 0,
	BXL = 1,
	BST = 2,
	JNZ = 3,
	BXC = 4,
	OUT = 5,
	BDV = 6,
	CDV = 7,
}

async function part1() {
	const file = await read({
		scope: import.meta.url,
		name: 'input.txt',
	});

	const [_registry, _program] = file.split('\n\n');

	function run(
		registry: {
			a: number;
			b: number;
			c: number;
		},
		program: number[]
	): string {
		let { a, b, c } = registry;
		let pointer = 0;

		const output: number[] = [];

		function getComboOperand(operand: number): number {
			switch (operand) {
				case 0:
					return 0;
				case 1:
					return 1;
				case 2:
					return 2;
				case 3:
					return 3;
				case 4:
					return a;
				case 5:
					return b;
				case 6:
					return c;
				default:
					throw new Error('Invalid combo operand');
			}
		}

		while (pointer < program.length) {
			const opcode = program[pointer];
			const operand = program[pointer + 1];

			switch (opcode) {
				case OPCODE.ADV:
					a = Math.trunc(a / Math.pow(2, getComboOperand(operand)));
					break;

				case OPCODE.BXL:
					b = b ^ operand;
					break;

				case OPCODE.BST:
					b = getComboOperand(operand) % 8;
					break;

				case OPCODE.JNZ:
					if (a !== 0) {
						pointer = operand;
						continue;
					}
					break;

				case OPCODE.BXC:
					b = b ^ c;
					break;

				case OPCODE.OUT:
					output.push(getComboOperand(operand) % 8);
					break;

				case OPCODE.BDV:
					b = Math.trunc(a / Math.pow(2, getComboOperand(operand)));
					break;

				case OPCODE.CDV:
					c = Math.trunc(a / Math.pow(2, getComboOperand(operand)));
					break;

				default:
					throw new Error(`Unknown opcode ${opcode}`);
			}

			pointer += 2;
		}

		return output.join(',');
	}

	const registry = _registry.split('\n').map((v) => {
		const [, right] = v.split(':');
		return Number(right.trim());
	});
	const program = _program.split(':')[1].trim().split(',').map(Number);

	return run(
		{
			a: registry[0],
			b: registry[1],
			c: registry[2],
		},
		program
	);
}

part1().then(console.log);
