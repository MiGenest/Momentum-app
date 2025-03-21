import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDepartments, fetchEmployees, fetchStatuses, createTask } from '../services/api';

interface Department {
  id: number;
  name: string;
  icon?: string;
}

interface Employee {
  id: number;
  name: string;
  surname: string;
  avatar: string;
  department_id: number;
  position?: string;
}

interface Priority {
  id: number;
  name: string;
  color?: string;
}

interface Status {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  description: string;
  department_id: number;
  employee_id: number;
  priority_id: number;
  status_id: number;
  due_date: string;
}

interface FormErrors {
  title?: string;
  department_id?: string;
  employee_id?: string;
  priority_id?: string;
  status_id?: string;
  submit?: string;
}

const TaskCreate = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([
    { id: 1, name: "დაბალი", color: "#45A53C" },
    { id: 2, name: "საშუალო", color: "#F2C94C" },
    { id: 3, name: "მაღალი", color: "#EB5757" }
  ]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    department_id: 0,
    employee_id: 0,
    priority_id: 0,
    status_id: 0,
    due_date: '',
  });

  const [validFields, setValidFields] = useState<{
    title: boolean;
    description: boolean;
  }>({
    title: false,
    description: false
  });

  // Calendar functions
  const months = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
  const days = ["ო", "ს", "ო", "ხ", "პ", "შ", "კ"]; 
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (formData.due_date) {
      setSelectedDate(new Date(formData.due_date));
    }
  }, [formData.due_date]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay() || 7; 
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    
    
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, due_date: formattedDate }));
    setDateOpen(false);
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return "";
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear) - 1; 
    
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDays = getDaysInMonth(currentMonth - 1 < 0 ? 11 : currentMonth - 1, 
                                         currentMonth - 1 < 0 ? currentYear - 1 : currentYear);
      days.push(
        <div key={`prev-${i}`} className="text-center py-1 text-gray-400 font-['FiraGO'] font-normal text-[14px] leading-[20px]">
          {prevMonthDays - (firstDay - i) + 1}
        </div>
      );
    }
    

    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = selectedDate && 
                        selectedDate.getDate() === i && 
                        selectedDate.getMonth() === currentMonth && 
                        selectedDate.getFullYear() === currentYear;
      
      days.push(
        <div 
          key={`current-${i}`} 
          className={`text-center py-1 cursor-pointer hover:bg-[#f0e6ff] font-['FiraGO'] font-normal text-[14px] leading-[20px] ${isSelected ? 'bg-[#8338EC] text-white' : ''}`}
          onClick={() => handleDateSelect(i)}
        >
          {i}
        </div>
      );
    }
    
    
    const totalCells = 42; 
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="text-center py-1 text-gray-400 font-['FiraGO'] font-normal text-[14px] leading-[20px]">
          {i}
        </div>
      );
    }
    
    return days;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [deptData, empData, statusData] = await Promise.all([
          fetchDepartments(),
          fetchEmployees(),
          fetchStatuses()
        ]);

        if (!deptData || !empData || !statusData) {
          throw new Error('Failed to fetch data');
        }

        console.log('Departments:', deptData);
        console.log('Employees:', empData);

        setDepartments(deptData);
        setEmployees(empData);
        setStatuses(statusData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (departmentOpen) {
        const departmentDropdown = document.getElementById('department-dropdown');
        if (departmentDropdown && !departmentDropdown.contains(event.target as Node)) {
          setDepartmentOpen(false);
        }
      }
      
      if (employeeOpen) {
        const employeeDropdown = document.getElementById('employee-dropdown');
        if (employeeDropdown && !employeeDropdown.contains(event.target as Node)) {
          setEmployeeOpen(false);
        }
      }

      if (priorityOpen) {
        const priorityDropdown = document.getElementById('priority-dropdown');
        if (priorityDropdown && !priorityDropdown.contains(event.target as Node)) {
          setPriorityOpen(false);
        }
      }

      if (statusOpen) {
        const statusDropdown = document.getElementById('status-dropdown');
        if (statusDropdown && !statusDropdown.contains(event.target as Node)) {
          setStatusOpen(false);
        }
      }

      if (dateOpen) {
        const dateDropdown = document.getElementById('date-dropdown');
        if (dateDropdown && !dateDropdown.contains(event.target as Node)) {
          setDateOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [departmentOpen, employeeOpen, priorityOpen, statusOpen, dateOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.length < 2 || formData.title.length > 255) {
      newErrors.title = '';
      setValidFields(prev => ({ ...prev, title: false }));
    }
    if (!formData.department_id) {
      newErrors.department_id = 'გთხოვთ აირჩიოთ დეპარტამენტი';
    }
    if (!formData.employee_id) {
      newErrors.employee_id = 'გთხოვთ აირჩიოთ თანამშრომელი';
    }
    if (!formData.priority_id) {
      newErrors.priority_id = 'გთხოვთ აირჩიოთ პრიორიტეტი';
    }
    if (!formData.status_id) {
      newErrors.status_id = 'გთხოვთ აირჩიოთ სტატუსი';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.endsWith('_id') ? Number(value) || 0 : value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (name === 'title' || name === 'description') {
      const isValid = value.trim().length >= 2 && value.length <= 255;
      setValidFields(prev => ({ ...prev, [name]: isValid }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      department_id: 0,
      employee_id: 0,
      priority_id: 0,
      status_id: 0,
      due_date: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setSuccessMessage(null);

    try {
      setIsSubmitting(true);
      console.log('Submitting form data:', formData);
      const response = await createTask(formData);
      console.log('API response:', response);
      
      if (!response?.id && !response?.success) {
        throw new Error('Failed to create task - invalid response');
      }
      

      setSuccessMessage('დავალება წარმატებით შეიქმნა!');
      

      resetForm();
      

      
    } catch (error) {
      console.error('Error creating task:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: 'დავალების შექმნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8338EC] mx-auto"></div>
          <p className="mt-4 text-[#0D0F10] font-['FiraGO']">მონაცემები იტვირთება...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-['FiraGO']">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#8338EC] text-white rounded-[8px] font-['FiraGO'] hover:bg-[#6f2dbd]"
          >
            ხელახლა ცდა
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-[170px] left-[118px] w-[1684px]">
        <h1 className="text-[20px] font-bold text-[#0D0F10] mb-[16px] font-['FiraGO']">შექმენი ახალი დავალება</h1>
      </div>
      
      <div className="absolute top-[211px] left-[118px] w-[1684px] h-[804px] bg-[#F8F3FEA6] rounded-[4px] border-[0.3px] border-[#DDD2FF] p-[40px] font-['FiraGO'] overflow-y-auto">
  
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p>{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)} 
              className="text-green-700 hover:text-green-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-[32px]">

            <div className="flex justify-between items-start">

              <div>
                <label className="block font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] mb-2">
                  სათაური<span className="text-red-500">*</span>
                </label>
            <input
              type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
              placeholder="დავალების სათაური"
                  className={`w-[550px] h-[45px] px-[14px] border rounded-[5px] font-['FiraGO'] font-light text-[14px] leading-[100%] placeholder-[#85858D] ${
                    errors.title ? 'border-red-500' : 
                    formData.title && validFields.title ? 'border-green-500' : 'border-[#CED4DA]'
                  }`}
                />
                {errors.title && errors.title.length > 0 && (
                  <p className="mt-1 text-sm text-red-600 font-['FiraGO']">{errors.title}</p>
                )}
                <p className={`mt-1 font-['FiraGO'] font-light text-[12px] leading-[100%] ${
                  errors.title || (formData.title && !validFields.title) || (!formData.title.trim() && Object.keys(errors).length > 0) ? 'text-red-600' : 
                  formData.title && validFields.title ? 'text-green-600' : 'text-[#85858D]'
                }`}>
                  <ul> მინიმუმ 2 სიმბოლო, </ul>
                  <ul>მაქსიმუმ 255 სიმბოლო</ul>
                </p>
          </div>

              
              <div>
                <label className="block font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] mb-2 mr-[678px]">
                  დეპარტამენტი<span className="text-red-500">*</span>
                </label>
                <div id="department-dropdown" className="relative">
                  <div 
                    className={`w-[550px] h-[45px] px-[14px] border rounded-[5px] font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] bg-white flex items-center justify-between cursor-pointer ${
                      errors.department_id ? 'border-red-500' : 'border-[#CED4DA]'
                    }`}
                    onClick={() => setDepartmentOpen(!departmentOpen)}
                  >
                    <div className="flex items-center">
                      {formData.department_id > 0 && departments.length > 0 ? (
                        <>
                          {departments.find(dept => dept.id === formData.department_id)?.icon && (
                            <img 
                              src={departments.find(dept => dept.id === formData.department_id)?.icon} 
                              alt="" 
                              className="w-4 h-4 mr-2"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          )}
                          <span>{departments.find(dept => dept.id === formData.department_id)?.name}</span>
                        </>
                      ) : (
                        <span className="text-[#85858D]">აირჩიეთ დეპარტამენტი</span>
                      )}
                    </div>
                    <img 
                      src="/arrow-down.svg" 
                      alt="dropdown" 
                      className={`w-[14px] h-[14px] transition-transform duration-200 ${departmentOpen ? 'rotate-180' : ''}`} 
                    />
                  </div>
                  {departmentOpen && (
                    <div className="absolute top-[45px] left-0 w-full max-h-[300px] overflow-y-auto bg-white border border-[#CED4DA] rounded-[5px] shadow-lg z-10">
                      {departments.map(dept => (
                        <div 
                          key={dept.id}
                          className={`flex items-center px-[14px] py-[10px] hover:bg-[#F8F3FE] cursor-pointer ${
                            formData.department_id === dept.id ? 'bg-[#F8F3FE]' : ''
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, department_id: dept.id }));
                            if (errors.department_id) {
                              setErrors(prev => ({ ...prev, department_id: undefined }));
                            }
                            setDepartmentOpen(false);
                          }}
                        >
                          <div className="flex items-center w-full">
                            {dept.icon && (
                              <img 
                                src={dept.icon} 
                                alt="" 
                                className="w-4 h-4 mr-2"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            )}
                            <span className="font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10]">
                              {dept.name}
                            </span>
                          </div>
                          {formData.department_id === dept.id && (
                            <svg className="w-4 h-4 text-[#8338EC]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.department_id && (
                  <p className="mt-1 text-sm text-red-600 font-['FiraGO']">{errors.department_id}</p>
                )}
          </div>
        </div>

            <div className="grid grid-cols-2 gap-x-[40px]">
          
              <div>
                <label className="block font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] mb-2">
                  აღწერა
                </label>
          <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
            placeholder="დავალების აღწერა"
                  className={`w-[550px] h-[133px] px-[14px] py-[14px] border rounded-[5px] font-['FiraGO'] font-light text-[14px] leading-[100%] placeholder-[#85858D] resize-none ${
                    (formData.description && !validFields.description) || (!formData.description.trim() && Object.keys(errors).length > 0) ? 'border-red-500' : 
                    formData.description && validFields.description ? 'border-green-500' : 'border-[#CED4DA]'
                  }`}
                />
                <p className={`mt-1 font-['FiraGO'] font-light text-[12px] leading-[100%] ${
                  (formData.description && !validFields.description) || (!formData.description.trim() && Object.keys(errors).length > 0) ? 'text-red-600' : 
                  formData.description && validFields.description ? 'text-green-600' : 'text-[#85858D]'
                }`}>
                  <ul> მინიმუმ 2 სიმბოლო, </ul>
                  <ul>მაქსიმუმ 255 სიმბოლო</ul>
                </p>
              </div>

              
              <div>
                <div>
                  <label className="block font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] mb-2">
                    პასუხისმგებელი თანამშრომელი<span className="text-red-500">*</span>
                  </label>
                  <div id="employee-dropdown" className="relative">
                    <div 
                      className={`w-[550px] h-[45px] px-[14px] border rounded-[5px] font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] bg-white flex items-center justify-between cursor-pointer ${
                        errors.employee_id ? 'border-red-500' : 'border-[#CED4DA]'
                      }`}
                      onClick={() => setEmployeeOpen(!employeeOpen)}
                    >
                      <div className="flex items-center">
                        {formData.employee_id > 0 && employees.length > 0 ? (
                          <>
                            {(() => {
                              const employee = employees.find(emp => emp.id === formData.employee_id);
                              return (
                                <>
                                  {employee?.avatar && (
                                    <img 
                                      src={employee.avatar} 
                                      alt="" 
                                      className="w-6 h-6 rounded-full mr-2"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <span>
                                    {employee ? `${employee.name} ${employee.surname}` : ''}
                                  </span>
                                </>
                              );
                            })()}
                          </>
                        ) : (
                          <span className="text-[#85858D]">აირჩიეთ თანამშრომელი</span>
                        )}
                      </div>
                      <img 
                        src="/arrow-down.svg" 
                        alt="dropdown" 
                        className={`w-[14px] h-[14px] transition-transform duration-200 ${employeeOpen ? 'rotate-180' : ''}`} 
                      />
                    </div>
                    {employeeOpen && (
                      <div className="absolute top-[45px] left-0 w-full max-h-[300px] overflow-y-auto bg-white border border-[#CED4DA] rounded-[5px] shadow-lg z-10">
                        {employees.map(emp => (
                          <div 
                            key={emp.id}
                            className={`flex items-center px-[14px] py-[10px] hover:bg-[#F8F3FE] cursor-pointer ${
                              formData.employee_id === emp.id ? 'bg-[#F8F3FE]' : ''
                            }`}
                            onClick={() => {
                              setFormData(prev => ({ ...prev, employee_id: emp.id }));
                              if (errors.employee_id) {
                                setErrors(prev => ({ ...prev, employee_id: undefined }));
                              }
                              setEmployeeOpen(false);
                            }}
                          >
                            <div className="flex items-center w-full">
                              {emp.avatar && (
                                <img 
                                  src={emp.avatar} 
                                  alt="" 
                                  className="w-6 h-6 rounded-full mr-2"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )}
                              <span className="font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10]">
                                {emp.name} {emp.surname}
                              </span>
                            </div>
                            {formData.employee_id === emp.id && (
                              <svg className="w-4 h-4 text-[#8338EC]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.employee_id && (
                    <p className="mt-1 text-sm text-red-600 font-['FiraGO']">{errors.employee_id}</p>
                  )}
                </div>
              </div>
            </div>

         
            <div className="flex">
              <div className="mr-[40px]">
                <label className="block font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] mb-2 mt-[100px]">
                  პრიორიტეტი<span className="text-red-500">*</span>
                </label>
                <div id="priority-dropdown" className="relative">
                  <div 
                    className={`w-[189px] h-[45px] px-[14px] border rounded-[5px] font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] bg-white flex items-center justify-between cursor-pointer ${
                      errors.priority_id ? 'border-red-500' : 'border-[#CED4DA]'
                    }`}
                    onClick={() => setPriorityOpen(!priorityOpen)}
                  >
                    <div className="flex items-center">
                      {formData.priority_id > 0 ? (
                        <>
                          {(() => {
                            const priority = priorities.find(p => p.id === formData.priority_id);
                            return (
                              <div className="flex items-center">
                                <div 
                                  className="w-5 h-5 mr-2 flex items-center"
                                  style={{ color: priority?.color }}
                                >
                                  {priority?.id === 1 && (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1.4 7H12.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                  {priority?.id === 2 && (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1.4 5.25H12.6M1.4 8.75H12.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                  {priority?.id === 3 && (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M5.69167 3.09833L2.93083 5.85917C2.49 6.3 2.49 7.07 2.93083 7.51667L5.69167 10.2775" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M11.0367 3.09833L8.27586 5.85917C7.83503 6.3 7.83503 7.07 8.27586 7.51667L11.0367 10.2775" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </div>
                                <span>{priority?.name}</span>
                              </div>
                            );
                          })()}
                        </>
                      ) : (
                        <span className="text-[#85858D]">აირჩიეთ პრიორიტეტი</span>
                      )}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {priorityOpen && (
                    <div className="absolute top-[45px] left-0 w-full max-h-[300px] overflow-y-auto bg-white border border-[#CED4DA] rounded-[5px] shadow-lg z-10">
                      {priorities.map(priority => (
                        <div 
                          key={priority.id}
                          className={`flex items-center px-[14px] py-[10px] hover:bg-[#F8F3FE] cursor-pointer ${
                            formData.priority_id === priority.id ? 'bg-[#F8F3FE]' : ''
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, priority_id: priority.id }));
                            if (errors.priority_id) {
                              setErrors(prev => ({ ...prev, priority_id: undefined }));
                            }
                            setPriorityOpen(false);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <div 
                              className="w-5 h-5 mr-2 flex items-center"
                              style={{ color: priority.color }}
                            >
                              {priority.id === 1 && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.4 7H12.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                              {priority.id === 2 && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.4 5.25H12.6M1.4 8.75H12.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                              {priority.id === 3 && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5.69167 3.09833L2.93083 5.85917C2.49 6.3 2.49 7.07 2.93083 7.51667L5.69167 10.2775" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M11.0367 3.09833L8.27586 5.85917C7.83503 6.3 7.83503 7.07 8.27586 7.51667L11.0367 10.2775" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10]">
                              {priority.name}
                            </span>
                          </div>
                          {formData.priority_id === priority.id && (
                            <svg className="w-4 h-4 text-[#8338EC]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.priority_id && (
                  <p className="mt-1 text-sm text-red-600 font-['FiraGO']">{errors.priority_id}</p>
                )}
              </div>

              <div className="mr-[40px]">
                <label className="block font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] mb-2 mt-[100px]">
                  სტატუსი<span className="text-red-500">*</span>
                </label>
                <div id="status-dropdown" className="relative">
                  <div 
                    className={`w-[189px] h-[45px] px-[14px] border rounded-[5px] font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] bg-white flex items-center justify-between cursor-pointer ${
                      errors.status_id ? 'border-red-500' : 'border-[#CED4DA]'
                    }`}
                    onClick={() => setStatusOpen(!statusOpen)}
                  >
                    <div className="flex items-center">
                      {formData.status_id > 0 ? (
                        <span>{statuses.find(status => status.id === formData.status_id)?.name}</span>
                      ) : (
                        <span className="text-[#85858D]">აირჩიეთ სტატუსი</span>
                      )}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {statusOpen && (
                    <div className="absolute top-[45px] left-0 w-full max-h-[300px] overflow-y-auto bg-white border border-[#CED4DA] rounded-[5px] shadow-lg z-10">
                      {statuses.map(status => (
                        <div 
                          key={status.id}
                          className={`flex items-center px-[14px] py-[10px] hover:bg-[#F8F3FE] cursor-pointer ${
                            formData.status_id === status.id ? 'bg-[#F8F3FE]' : ''
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, status_id: status.id }));
                            if (errors.status_id) {
                              setErrors(prev => ({ ...prev, status_id: undefined }));
                            }
                            setStatusOpen(false);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <span className="font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10]">
                              {status.name}
                            </span>
                          </div>
                          {formData.status_id === status.id && (
                            <svg className="w-4 h-4 text-[#8338EC]" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.6667 3.5L5.25 9.91667L2.33333 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.status_id && (
                  <p className="mt-1 text-sm text-red-600 font-['FiraGO']">{errors.status_id}</p>
                )}
        </div>

              <div>
                <label className="block font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] mb-2 mt-[100px] ml-[375px]">
                  დედლაინი
                </label>
                <div id="date-dropdown" className="relative" ref={calendarRef}>
                  <div 
                    className="w-[189px] h-[45px] px-[14px] border border-[#CED4DA] rounded-[5px] font-['FiraGO'] font-light text-[14px] leading-[100%] text-[#0D0F10] bg-white flex items-center cursor-pointer relative ml-[375px]"
                    onClick={() => setDateOpen(!dateOpen)}
                  >
                    <span className={`pl-6 ${!selectedDate ? 'text-[#ADB5BD]' : ''}`}>
                      {selectedDate ? formatDisplayDate(selectedDate) : "DD/MM/YYYY"}
                    </span>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.33333 1.33333V3.33333M10.6667 1.33333V3.33333M2.33333 6.05333H13.6667M14 5.66667V11.3333C14 13.3333 13 14.6667 10.6667 14.6667H5.33333C3 14.6667 2 13.3333 2 11.3333V5.66667C2 3.66667 3 2.33333 5.33333 2.33333H10.6667C13 2.33333 14 3.66667 14 5.66667Z" stroke="#292D32" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.4633 9.13332H10.4693M10.4633 11.1333H10.4693M7.99667 9.13332H8.00267M7.99667 11.1333H8.00267M5.52999 9.13332H5.53599M5.52999 11.1333H5.53599" stroke="#292D32" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
        </div>

                  {dateOpen && (
                    <div className="absolute bottom-[50px] left-[330px] z-20 w-[300px] bg-white shadow-lg border border-[#8338EC] rounded-md font-['FiraGO']">
                      <div className="flex justify-between items-center p-3 border-b">
                        <div className="font-medium text-center w-full">
                          მარტი {currentYear}
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            type="button" 
                            onClick={prevMonth}
                            className="p-1"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 11.0833L2.91667 7L7 2.91667M11.0833 7H3.5" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button 
                            type="button" 
                            onClick={nextMonth}
                            className="p-1"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 2.91667L11.0833 7L7 11.0833M2.91667 7H10.5" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
          </div>

                      <div className="grid grid-cols-7 gap-0 pt-2 px-2 pb-0 text-center">
                        {days.map((day, index) => (
                          <div key={index} className="text-center font-medium text-sm text-gray-600 py-1">
                            {day}
                          </div>
                        ))}
                        {renderCalendarDays()}
          </div>

                      <div className="flex justify-between p-3 border-t">
                        <button 
                          type="button" 
                          className="text-[#8338EC] font-['FiraGO'] font-normal text-[14px] leading-[20px] text-center"
                          onClick={() => setDateOpen(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          type="button" 
                          className="text-[#8338EC] font-['FiraGO'] font-normal text-[14px] leading-[20px] text-center font-medium"
                          onClick={() => setDateOpen(false)}
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 font-['FiraGO']">{errors.submit}</p>
        </div>
          )}

          <div className="flex justify-end mt-[40px]">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-[196px] h-[40px] bg-[#8338EC] text-white rounded-[8px] font-['FiraGO'] font-normal text-[14px] leading-[100%] hover:bg-[#6f2dbd] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'იქმნება...' : 'დავალების შექმნა'}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreate;