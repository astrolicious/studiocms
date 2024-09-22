const folders: string[] = [];

const array: string[] = [
	'2024/24/slug',
	'2024/26/slug',
	'2023/11/slug',
	'2024/12/slug',
	'2022/13/slug',
	'2023/14/slug',
];

for (let i = 0; i < array.length; i++) {
	const item = array[i];

	if (!item) continue;

	const firstItemFolder = item.split('/')[0];

	if (firstItemFolder && !folders.find((x) => x === firstItemFolder)) {
		folders.push(firstItemFolder);
	}
}

console.log(folders);
