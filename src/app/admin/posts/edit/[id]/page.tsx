import { PostEditorClient } from "@/components/admin/PostEditorClient";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return <PostEditorClient mode="edit" postId={params.id} />;
}

export const metadata = {
  title: "Edit Post - Admin",
  description: "Edit blog post content",
};
