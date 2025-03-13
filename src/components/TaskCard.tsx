import React from "react";
import StatusBadge from "./StatusBadge";

interface TaskProps {
    id: number;
    name: string;
    description: string;
    due_date: string;
    status: {id: number; name: string};
    priority: {id: number; name: string, icon: string};
};

const TaskCard: React.FC<{task : TaskProps}> = ({task}) => {
    return (
        <div className="border p-4 rounded-md  shadow-md bg-white w-[350px]">
            <div className="flex items-center gap-2 mb-2">
                <img src={task.priority.icon} alt="priority" className="w-4 h-4" />
                <span className="text-sm font-semibold">{task.priority.name}</span>
            </div>
            <h3 className="text-lg font-bold">{task.name}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-400">{new Date(task.due_date).toDateString()}</p>
        </div>
    );
}

export default TaskCard;