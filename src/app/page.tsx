import { db } from "@/db";
import { CreatePost } from "./_components/create-post";

export default async function Page() {
  const posts = await db.query.post.findMany({
    with: {
      author: true,
    },
    orderBy: (post, { desc }) => [desc(post.createdAt)],
  });
  return (
    <div className="container mx-auto flex flex-col gap-4 py-10">
      <CreatePost />
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border p-4">
          <h2 className="font-semibold text-xl">{post.title}</h2>
          <p className="mt-2 text-gray-600">{post.content}</p>
          <div className="mt-4 text-gray-500 text-sm">
            Posted on {new Date(post.createdAt ?? "").toLocaleDateString()}
          </div>
          <div className="mt-4 text-gray-500 text-sm">
            Author: {post.author?.name}
          </div>
        </div>
      ))}
    </div>
  );
}
