import React, { useState } from 'react';
import { createComment, CommentResponse } from '../services/api';
import format from 'date-fns/format';
import { isValid, parseISO } from 'date-fns';
import ka from 'date-fns/locale/ka';

interface CommentsProps {
  taskId: number;
  comments: CommentResponse[];
  setComments: React.Dispatch<React.SetStateAction<CommentResponse[]>>;
  onError: (message: string) => void;
}

const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return '';
    }
    return format(date, 'dd MMM, HH:mm', { locale: ka });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const Comments: React.FC<CommentsProps> = ({ taskId, comments, setComments, onError }) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const comment = await createComment(
        taskId,
        newComment,
        replyTo || undefined
      );
      setComments(prev => {
        if (replyTo) {
          return prev.map(c => {
            if (c.id === replyTo) {
              return {
                ...c,
                sub_comments: [...(c.sub_comments || []), comment]
              };
            }
            return c;
          });
        }
        return [...prev, comment];
      });
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error creating comment:', error);
      onError('კომენტარის დამატება ვერ მოხერხდა');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyTo(commentId);
    const formElement = document.getElementById('comment-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">კომენტარები</h3>
      
      <form id="comment-form" onSubmit={handleCommentSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? "დაწერე პასუხი..." : "დაწერე კომენტარი..."}
          className="w-full p-3 border rounded-lg resize-none min-h-[100px]"
        />
        <div className="flex justify-end mt-2">
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              გაუქმება
            </button>
          )}
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'იგზავნება...' : 'გაგზავნა'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex items-start mb-2">
              <img
                src={comment.author_avatar}
                alt={comment.author_nickname}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <div className="font-medium">{comment.author_nickname}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(comment.created_at)}
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-2">{comment.text}</p>
            
            {!comment.parent_id && (
              <button
                onClick={() => handleReply(comment.id)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                პასუხი
              </button>
            )}

            {comment.sub_comments && comment.sub_comments.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.sub_comments.map((subComment) => (
                  <div key={subComment.id} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-start mb-2">
                      <img
                        src={subComment.author_avatar}
                        alt={subComment.author_nickname}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="font-medium">{subComment.author_nickname}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(subComment.created_at)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{subComment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments; 