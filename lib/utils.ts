export { cn } from "cn";

/**
 * Non-breaking space. Use `{NBSP}` instead of the `&nbsp;` entity in JSX:
 * the entity inside multi-line text is compiled differently on server and client,
 * which breaks hydration.
 */
export const NBSP = " ";
