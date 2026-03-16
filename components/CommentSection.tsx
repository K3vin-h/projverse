"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, MessageCircle } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";
//this is the comment interface, it is used to define the structure of a comment
interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  projectId: string;
}

export default function CommentSection({ projectId }: CommentSectionProps) {
  //create state for comments, content, and loading, and session for data
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  //fetch comments from the database using useEffect, using useeffect means it will run only once when the component is loaded
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [projectId]);
  //handle submit function is used to submit the comment
  const handleSubmit = async (e: React.FormEvent) => {
    //prevent default is used to prevent the default behavior of the form
    e.preventDefault();
    //check if the content is not empty and not loading
    if (!content.trim() || loading) return;
    //set loading state to true
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, content }),
      });
      //if the response is ok, then add the new comment to the comments state and clear the content
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setContent("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      //set loading state to false
      setLoading(false);
    }
  };
  //this is the comment section, it is used to display the comments and the comment form
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#111116] p-6">
      <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-blue-400" />
        Comments
        <span className="text-xs text-zinc-500 font-normal">
          ({comments.length})
        </span>
      </h3>

      {/* Comment form */}
      {/*check if the user is logged in, if yes then display the comment form, if no then display the login link*/}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!content.trim() || loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-3.5 w-3.5" />
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
          <p className="text-sm text-zinc-500">
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              Sign in
            </Link>{" "}
            to leave a comment
          </p>
        </div>
      )}

      {/* Comments list */}
      {/*display the comments, if there are no comments, display a message saying no comments yet*/}
      <div className="space-y-5">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-600 text-center py-6">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-xs font-bold text-white">
                {comment.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/profile/${comment.user.id}`}
                    className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    {comment.user.username || comment.user.name || "Unknown"}
                  </Link>
                  <span className="text-xs text-zinc-600">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
