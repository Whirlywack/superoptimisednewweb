// Mock rehype-sanitize for tests
export default function rehypeSanitize() {
  return (tree) => tree;
}
