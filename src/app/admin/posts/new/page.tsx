import { PostEditorClient } from "@/components/admin/PostEditorClient";

export default function NewPostPage() {
  return <PostEditorClient mode="create" />;
}

export const metadata = {
  title: "Create New Post - Admin",
  description: "Create a new blog post using TypeScript React components",
};
