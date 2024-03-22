// Source: https://catchts.com/union-array
export type UnionToIntersection<U> = (
	U extends any
		? (k: U) => void
		: never
) extends (k: infer I) => void
	? I
	: never;

type UnionToOvlds<U> = UnionToIntersection<
	U extends any ? (f: U) => void : never
>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;

// Depending on usage, this could not work:
// type A = { a: 'a' | 'b' };
// type B = { a: "a" } | { a: "b" };
// Only B works here, but it's fine for our usage.
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

export type UnionToArray<T> = IsUnion<T> extends true
	? [...UnionToArray<Exclude<T, PopUnion<T>>>, PopUnion<T>]
	: [T];

// Source: https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
