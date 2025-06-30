export const token = process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN;

if (!token) {
  throw new Error("NEXT_PUBLIC_SANITY_API_READ_TOKEN is not defined. Please set it in your environment variables.");
}
