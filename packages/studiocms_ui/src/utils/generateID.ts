function generateID(prefix: string) {
	return `${prefix}-${Math.random().toString(16).slice(2)}`;
}

export { generateID };
