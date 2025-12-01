import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export function readByLine(props: {
	scope: string;
	name: string;
	onLine: (line: string) => void;
	onClose?: () => void;
}) {
	const __dirname = dirname(fileURLToPath(props.scope));
	const fileStream = createReadStream(join(__dirname, props.name));
	const rl = createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});
	rl.on('line', props.onLine);
	if (props.onClose) rl.on('close', props.onClose);
}
