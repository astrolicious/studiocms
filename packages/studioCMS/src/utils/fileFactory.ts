export const fileFactory = () => {
	// biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
	let file = ``

	return {
		addLines(lines: string) {
			file += lines
		},
		text() {
			return file
		}
	}
}