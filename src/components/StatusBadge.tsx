import react from "react";

interface StatusProps {
    status : {
        id: number;
        name: string;
    };
}

const statusColors: Record<number, string> = {
    1: 'bg-yellow-400',
    2: 'bg-orange-500',
    3: 'bg-pink-500',
    4: 'bg-blue-500',
};

const StatusBadge: React.FC<StatusProps> = ({status}) => {
    return (
        <span className={`px-2 py-1 text-white text-sm rounded-md ${statusColors[status.id] || 'bg-gray-400'}`}>
            {status.name}
        </span>
    );
};  

export default StatusBadge;