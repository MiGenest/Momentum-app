import React from "react";
import { fixImageUrl } from "../utils/imageUrl";
import { useNavigate } from "react-router-dom";

export interface TaskProps {
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
    };
    priority: {
        id: number;
        name: string;
        icon?: string;
    };
    employee: {
        id: number;
        first_name: string;
        last_name: string;
        avatar: string;
        department_id: number;
    };
    due_date: string;
    total_comments: number;
}

const TaskCard: React.FC<{ task: TaskProps }> = ({ task }) => {
    const navigate = useNavigate();

    const departmentColors: Record<number, string> = {
        1: "#FF66A8", // Design
        2: "#FD9A6A", // Marketing
        3: "#89B6FF", // Logistics
        4: "#FFD86D", // Technologies
        5: "#FD9A6A", // Administration
        6: "#F9F9F9", // HR
    };

    const getDepartmentColor = (department: TaskProps["department"]): string => {
        return departmentColors[department.id] || "#F9F9F9";
    };

    const getPriorityStyle = (priorityName: string): { color: string; borderColor: string } => {
        switch (priorityName) {
            case "დაბალი":
                return { color: "#08A508", borderColor: "#08A508" };
            case "საშუალო":
                return { color: "#FFBE0B", borderColor: "#FFBE0B" };
            case "მაღალი":
                return { color: "#FA4D4D", borderColor: "#FA4D4D" };
            default:
                return { color: "#CED4DA", borderColor: "#CED4DA" };
        }
    };

    const getStatusStyle = (status: TaskProps["status"], priorityBorderColor: string): { background: string; borderColor: string } => {
        switch (status.id) {
            case 1: // დასაწყები
                return { background: "#FFFFFF", borderColor: "#F7BC30" };
            case 2: // პროგრესში
                return { background: "#FFFFFF", borderColor: "#FB5607" };
            case 3: // მზად ტესტირებისთვის
                return { background: "#FFFFFF", borderColor: "#FF006E" };
            case 4: // დასრულებული
                return { background: "#FFFFFF", borderColor: "#3A86FF" };
            default:
                return { background: "#FFFFFF", borderColor: "#CED4DA" };
        }
    };

    const priorityStyle = getPriorityStyle(task.priority.name);
    const statusStyle = getStatusStyle(task.status, priorityStyle.borderColor);

    const handleCardClick = () => {
        navigate(`/tasks/${task.id}`);
    };

    return (
        <div 
            onClick={handleCardClick}
            className="rounded-[15px] border border-1 p-[20px] cursor-pointer hover:shadow-md transition-shadow duration-200"
            style={{ 
                fontFamily: "FiraGO-Sans",
                background: statusStyle.background,
                borderColor: statusStyle.borderColor
            }}
        >
            <div className="flex items-center gap-[4px] mb-8">
                <div className="w-[184px] h-[26px] flex gap-[10px]">
                    <span 
                        className="bg-white w-[86px] h-[26px] px-1 rounded-[5px] text-xs font-medium flex items-center justify-center gap-1"
                        style={{ 
                            border: `0.5px solid ${priorityStyle.borderColor}`,
                            color: priorityStyle.color
                        }}
                    >
                        {task.priority.icon && (
                            <img src={fixImageUrl(task.priority.icon)} alt="" className="w-4 h-4" />
                        )}
                        {task.priority.name}
                    </span>
                    <span 
                        className="text-[#1A1A1A] w-[88px] h-[24px] px-[9px] py-[5px] rounded-[15px] text-xs font-medium flex items-center justify-center gap-1 truncate"
                        style={{ backgroundColor: getDepartmentColor(task.department) }}
                    >
                        {task.department.icon && (
                            <img src={fixImageUrl(task.department.icon)} alt="" className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="truncate">{task.department.name}</span>
                    </span>
                </div>
                <span className="text-xs text-[#9B9B9B] ml-auto">
                    {new Date(task.due_date).toLocaleDateString('ka-GE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}
                </span>
            </div>

            <h3 className="w-[293px] h-[18px] font-[500] leading-[100%] tracking-[0%] text-[#212529] mb-4">{task.name}</h3>
            <p className="text-[14px] font-[400] leading-[100%] tracking-[0%] text-[#343A40] mb-8 line-clamp-2 h-[24px]">
                {task.description}
            </p>

            <div className="flex items-center justify-between gap-[10px]">
                <img 
                    src={task.employee.avatar}
                    alt={`${task.employee.first_name} ${task.employee.last_name}`}
                    className="w-8 h-8 rounded-full"
                />
                <div className="flex items-center w-[34px] h-[22px] gap-[4px] ml-auto">
                    <img src="/Comments.svg" alt="Comments" className="w-4 h-4" />
                    <span className="text-[#9B9B9B]">{task.total_comments}</span>
                </div>
            </div>
        </div>
    );
}

export default TaskCard;