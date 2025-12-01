import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export async function read(props: { scope: string; name: string }) {
	const __dirname = dirname(fileURLToPath(props.scope));
	return readFile(join(__dirname, props.name), 'utf-8');
}
