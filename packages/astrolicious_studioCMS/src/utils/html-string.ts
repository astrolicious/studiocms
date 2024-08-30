export class HTMLString extends String {
	get [Symbol.toStringTag]() {
		return 'HTMLString';
	}
}
