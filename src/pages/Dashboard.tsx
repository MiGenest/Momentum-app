import React, { useEffect, useState } from "react";
import { fetchTasks, fetchStatuses, fetchDepartments, fetchPriorities, fetchEmployees } from "../services/api";
import TaskCard, { TaskProps as Task } from "../components/TaskCard";
import FilterSelect from "../components/FilterSelect";

interface Status {
  id: number;
  name: string;
  color: string;
}

interface Department {
  id: number;
  name: string;
}

interface Priority {
  id: number;
  name: string;
  color: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface Filters {
  departments: number[];
  priorities: number[];
  employeeId: number | null;
}

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState<Filters>(() => {
    const savedFilters = sessionStorage.getItem('taskFilters');
    return savedFilters ? JSON.parse(savedFilters) : {
      departments: [],
      priorities: [],
      employeeId: null
    };
  });

  const statusColors: Record<Status['name'], string> = {
    "დასაწყები": "#F4B740",
    "პროგრესში": "#EB5757",
    "მზად ტესტირებისთვის": "#FF006E",
    "დასრულებული": "#2F80ED",
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, statusesData, departmentsData, prioritiesData, employeesData] = await Promise.all([
          fetchTasks(),
          fetchStatuses(),
          fetchDepartments(),
          fetchPriorities(),
          fetchEmployees(),
        ]);
        setTasks(tasksData);
        setStatuses(statusesData);
        setDepartments(departmentsData);
        setPriorities(prioritiesData);
        setEmployees(employeesData);
      } catch (err) {
        setError("დაფიქსირდა შეცდომა მონაცემების მიღებისას");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    if (filters.departments.length > 0) {
      filtered = filtered.filter(task => filters.departments.includes(task.department.id));
    }

    if (filters.priorities.length > 0) {
      filtered = filtered.filter(task => filters.priorities.includes(task.priority.id));
    }

    if (filters.employeeId) {
      filtered = filtered.filter(task => task.employee.id === filters.employeeId);
    }

    setFilteredTasks(filtered);
    sessionStorage.setItem('taskFilters', JSON.stringify(filters));
  }, [tasks, filters]);

  const handleFilterChange = (type: keyof Filters, value: number | number[] | null) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleRemoveFilter = (type: keyof Filters, id: number) => {
    setFilters(prev => ({
      ...prev,
      [type]: Array.isArray(prev[type]) 
        ? (prev[type] as number[]).filter(item => item !== id)
        : null
    }));
  };

  const getFilterLabel = (type: keyof Filters, id: number) => {
    switch(type) {
      case 'departments':
        return departments.find(d => d.id === id)?.name;
      case 'priorities':
        return priorities.find(p => p.id === id)?.name;
      case 'employeeId':
        const emp = employees.find(e => e.id === id);
        return emp ? `${emp.first_name} ${emp.last_name}` : '';
      default:
        return '';
    }
  };

  if (loading) return <p>იტვირთება...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">დავალებების გვერდი</h1>
      
      <div className="mb-6">
        <div className="w-[688px] h-[44px] flex items-center bg-white rounded-[10px] border border-[#DEE2E6]">
          <FilterSelect
            options={departments}
            value={filters.departments}
            onChange={(value) => handleFilterChange('departments', value)}
            placeholder="დეპარტამენტები"
            isMulti
            className="w-[229px] h-[44px]"
          />
          <FilterSelect
            options={priorities}
            value={filters.priorities}
            onChange={(value) => handleFilterChange('priorities', value)}
            placeholder="პრიორიტეტები"
            isMulti
            className="w-[229px] h-[44px]"
          />
          <FilterSelect
            options={employees}
            value={filters.employeeId}
            onChange={(value) => handleFilterChange('employeeId', value)}
            placeholder="თანამშრომელი"
            className="w-[229px] h-[44px]"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.departments.map((id) => (
          <button
            key={`dept-${id}`}
            onClick={() => handleRemoveFilter('departments', id)}
            className="flex items-center gap-2 px-2 py-1 bg-white border border-[#F2F2F2] rounded text-sm"
          >
            {getFilterLabel('departments', id)}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
        {filters.priorities.map((id) => (
          <button
            key={`prio-${id}`}
            onClick={() => handleRemoveFilter('priorities', id)}
            className="flex items-center gap-2 px-2 py-1 bg-white border border-[#F2F2F2] rounded text-sm"
          >
            {getFilterLabel('priorities', id)}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
        {filters.employeeId && (
          <button
            onClick={() => handleRemoveFilter('employeeId', filters.employeeId as number)}
            className="flex items-center gap-2 px-2 py-1 bg-white border border-[#F2F2F2] rounded text-sm"
          >
            {getFilterLabel('employeeId', filters.employeeId)}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-6">
        {statuses.map((status) => (
          <div 
            key={status.id} 
            className="flex flex-col gap-4"
          >
            <div 
              className="rounded-lg text-center py-3"
              style={{ backgroundColor: statusColors[status.name] }}
            >
              <h2 className="font-medium text-white">{status.name}</h2>
            </div>
            <div className="flex flex-col gap-4">
              {filteredTasks
                .filter((task) => task.status.id === status.id)
                .map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;