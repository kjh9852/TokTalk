import PostItem from "@/components/post/PostItem/PostItem";

export default function PostList({ postList }) {
  return (
    <>
      {postList?.map((post, index) => (
        <PostItem key={post.id} post={post} index={index} />
      ))}
    </>
  );
}
