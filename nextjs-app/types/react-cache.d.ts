// React Server Components ship a `cache()` helper that the @types/react 18.x
// package does not declare. Next.js App Router injects it at runtime in server
// components, so we augment the type here.

declare module "react" {
  export function cache<TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn,
  ): (...args: TArgs) => TReturn;
}

export {};
