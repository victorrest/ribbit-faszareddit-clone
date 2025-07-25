import { useAppSelector } from "@/store";
import { convertTime } from "../utils/convertTime";

export function useCommentAuthorBar({ comment }) {
  const communities = useAppSelector((state) =>
    Object.values(state.communities.communities)
  );
  const post = useAppSelector((state) => state.posts.posts[comment?.postId]);

  const editedTime = convertTime(comment, "edit");
  const commentTime = convertTime(comment);
  const wasEdited = comment?.createdAt !== comment?.updatedAt;

  const isOP = post?.author?.username === comment?.commentAuthor?.username;
  const isMOD = comment?.userId === communities[post?.community.id]?.userId;

  return { editedTime, commentTime, wasEdited, isOP, isMOD };
}
