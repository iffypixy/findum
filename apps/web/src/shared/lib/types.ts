export interface PropsWithClassName {
  className?: string;
}

export type Nullable<T> = T | null;

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
