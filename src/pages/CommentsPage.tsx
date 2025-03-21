import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  fetchTaskById, 
  fetchComments, 
  createComment, 
  fetchStatuses,
  updateTask,
  CommentResponse 
} from '../services/api';
import format from 'date-fns/format';
import { isValid, parseISO } from 'date-fns';
import ka from 'date-fns/locale/ka';
import Comments from '../components/Comments';

interface Task {
  id: number;
  name: string;
  description: string;
  status: {
    id: number;
    name: string;
    icon?: string;
  };
  department: {
    id: number;
    name: string;
    icon?: string;
    color?: string;
  };
  priority: {
    id: number;
    name: string;
    icon?: string;
    color?: string;
  };
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    department_id: number;
    position?: string;
  };
  due_date: string;
  total_comments: number;
  created_at?: string;
  updated_at?: string;
}

interface Comment {
  id: number;
  text: string;
  task_id: number;
  parent_id: number | null;
  author_avatar: string;
  author_nickname: string;
  sub_comments?: Comment[];
}

interface Status {
  id: number;
  name: string;
  icon?: string;
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

const formatFullDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return '';
    }
    return format(date, 'dd MMMM, yyyy', { locale: ka });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const departmentColors: Record<number, string> = {
  1: "#FF66A8",
  2: "#FD9A6A",
  3: "#89B6FF",
  4: "#FFD86D",
  5: "#FD9A6A",
  6: "#F9F9F9",
  7: "#89B6FF",
};

const getDepartmentColor = (departmentId: number): string => {
  return departmentColors[departmentId] || "#F9F9F9";
};

const abbreviateDepartment = (name: string): string => {
  const words = name.split(' ');
  if (words.length === 1 && name.length <= 10) {
    return name;
  }
  if (words.length > 1 && name.length <= 10) {
    return name;
  }
  if (name.length > 10) {
    return `${name.substring(0, 7)}...`;
  }
  return words.map(word => word.charAt(0)).join('');
};

const CommentsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!taskId) {
        setError('დავალების ID არ არის მითითებული');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const [taskData, commentsData, statusesData] = await Promise.all([
          fetchTaskById(Number(taskId)),
          fetchComments(Number(taskId)),
          fetchStatuses()
        ]);

        setTask(taskData);
        setComments(commentsData);
        setStatuses(statusesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [taskId]);

  const handleStatusChange = async (newStatusId: number) => {
    if (!task || !taskId) return;

    try {
      const updatedTask = await updateTask(Number(taskId), {
        title: task.name,
        description: task.description,
        department_id: task.department.id,
        employee_id: task.employee.id,
        priority_id: task.priority.id,
        status_id: newStatusId,
        due_date: task.due_date
      });
      setTask(updatedTask);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('სტატუსის განახლება ვერ მოხერხდა');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const comment = await createComment(
        Number(taskId), 
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
      setError('კომენტარის დამატება ვერ მოხერხდა');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="text-purple-600 hover:text-purple-700"
          >
            უკან დაბრუნება
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">დავალების დეტალები</h1>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            {task && (
              <>
                <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
                  <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-3">{task.name}</h2>
                  <p className="text-[#9B9B9B] text-base whitespace-pre-wrap">{task.description}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="grid grid-cols-1 gap-[18px]">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span className="text-[14px] text-[#1A1A1A] w-32">სტატუსი</span>
                      <select
                        value={task.status.id}
                        onChange={(e) => handleStatusChange(Number(e.target.value))}
                        className="ml-2 p-1 border rounded text-[14px] text-[#9B9B9B]"
                      >
                        {statuses.map(status => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-[14px] text-[#1A1A1A] w-32">პრიორიტეტი</span>
                      <div className="flex items-center">
                        <span 
                          className="text-[14px] flex items-center gap-1 px-[5px] py-1 rounded-[3px] border border-gray-200"
                          style={{ 
                            width: '106px',
                            height: '32px',
                            color: task.priority.name === "დაბალი" ? "#08A508" : 
                                    task.priority.name === "საშუალო" ? "#FFBE0B" : 
                                    task.priority.name === "მაღალი" ? "#FA4D4D" : "#9B9B9B" 
                          }}
                        >
                          {task.priority.icon && (
                            <img src={task.priority.icon} alt="" className="w-4 h-4" />
                          )}
                          {task.priority.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[14px] text-[#1A1A1A] w-32">თანამშრომელი</span>
                      <div className="flex items-center">
                        <img 
                          src={task.employee.avatar}
                          alt={`${task.employee.first_name} ${task.employee.last_name}`}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-[14px] text-[#9B9B9B]">
                          {task.employee.first_name} {task.employee.last_name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5m4-4h1m-1-4h1m-1-4h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="text-[14px] text-[#1A1A1A] w-32">დეპარტამენტი</span>
                      <div className="flex items-center">
                        <span 
                          className="text-[14px] flex items-center justify-center gap-[10px] px-[10px] py-[5px] rounded-[15px]"
                          style={{ 
                            width: '88px',
                            height: '29px',
                            backgroundColor: getDepartmentColor(task.department.id),
                            color: "#1A1A1A"
                          }}
                        >
                          {task.department.icon && (
                            <img src={task.department.icon} alt="" className="w-4 h-4" />
                          )}
                          {abbreviateDepartment(task.department.name)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[14px] text-[#1A1A1A] w-32">დავალების ვადა</span>
                      {task.due_date && (
                        <span className="text-[14px] text-[#9B9B9B]">
                          {formatFullDate(task.due_date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:w-1/2">
            {taskId && (
              <Comments
                taskId={Number(taskId)}
                comments={comments}
                setComments={setComments}
                onError={(message) => setError(message)}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommentsPage; 