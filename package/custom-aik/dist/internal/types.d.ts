type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;
type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
type UnionToArray<T> = IsUnion<T> extends true ? [...UnionToArray<Exclude<T, PopUnion<T>>>, PopUnion<T>] : [T];
type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type { Prettify, UnionToArray, UnionToIntersection };
