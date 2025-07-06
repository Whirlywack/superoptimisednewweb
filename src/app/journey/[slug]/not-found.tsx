import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 text-center">
      <div className="mb-8">
        <Icon name="ExclamationTriangleIcon" className="text-warm-gray-400 mx-auto size-16" />
      </div>

      <h1 className="text-dark-blue mb-4 text-4xl font-bold dark:text-white">
        Journey Post Not Found
      </h1>

      <p className="text-warm-gray-600 dark:text-warm-gray-400 mb-8 text-lg">
        The journey post you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>

      <div className="space-y-4">
        <div>
          <Link href="/journey">
            <Button variant="primary" className="mr-4">
              View All Journey Posts
            </Button>
          </Link>

          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>

        <p className="text-warm-gray-500 dark:text-warm-gray-500 text-sm">
          If you believe this is an error, please{" "}
          <Link
            href="/about#contact"
            className="text-aurora-600 hover:text-aurora-700 dark:text-aurora-400 dark:hover:text-aurora-300"
          >
            let us know
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
