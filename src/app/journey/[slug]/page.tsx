import { BlogPostViewer } from "@/components/templates/BlogPostViewer";
import { api } from "@/lib/trpc/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await api.blog.getBlogPostBySlug({ slug: params.slug });

    if (!post) {
      return {
        title: "Post Not Found - Superoptimised",
        description: "The requested post could not be found.",
      };
    }

    const title = `${post.title} | Superoptimised Journey`;
    const description =
      post.excerpt || `Read about ${post.title} in the Superoptimised building journey.`;
    const ogImage = `/api/og/${post.slug}`;

    return {
      title,
      description,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        authors: post.author?.name ? [post.author.name] : ["Superoptimised"],
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [ogImage],
      },
      alternates: {
        canonical: `/journey/${post.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for post:", error);
    return {
      title: "Post Not Found - Superoptimised",
      description: "The requested post could not be found.",
    };
  }
}

export default async function JourneyPost({ params }: PageProps) {
  try {
    const post = await api.blog.getBlogPostBySlug({ slug: params.slug });

    if (!post) {
      notFound();
    }

    return <BlogPostViewer post={post} />;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const { posts } = await api.blog.getBlogPosts({
      page: 1,
      limit: 100,
      status: "published",
      postType: "journey",
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
