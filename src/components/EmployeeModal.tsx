import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

interface Department {
  id: number;
  name: string;
}

const EmployeeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    avatar: null as File | null,
    department_id: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    avatar: "",
    department_id: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://momentum.redberryinternship.ge/api/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("შეცდომა დეპარტამენტების მიღებისას:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDepartmentSelect = (dept: Department) => {
    setSelectedDepartment(dept);
    setFormData((prev) => ({ ...prev, department_id: String(dept.id) }));
    setDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.avatar || !formData.department_id) {
      alert("გთხოვთ, შეავსოთ ყველა აუცილებელი ველი სწორად");
      return;
    }

    const apiUrl = "https://momentum.redberryinternship.ge/api/employees";
    const token = "9e688caf-d90c-4a5f-bbca-2e34d10290bd";

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("surname", formData.surname);
    formDataToSend.append("department_id", String(formData.department_id));
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar as Blob);
    }

    try {
      const response = await axios.post(apiUrl, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("მონაცემები წარმატებით გაიგზავნა", response.data);
      onClose();
    } catch (error) {
      console.error("შეცდომა მონაცემების გაგზავნისას:", error);
      alert("შეცდომა მონაცემების გაგზავნისას");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0D0F10]/[0.15] backdrop-blur-[10px] flex justify-center items-center">
      <div className="bg-white w-[913px] h-[766px] p-[50px] pt-[40px] pb-[60px] rounded-[10px] shadow-lg relative flex flex-col gap-[37px]">
        

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-center flex-1">თანამშრომლის დამატება</h2>
          <button className="absolute top-4 right-4 w-[38px] h-[38px] flex justify-center items-center rounded-md" onClick={onClose}>
            <img src="/Cancel.svg" alt="Close" />
          </button>
        </div>


        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex gap-[45px] w-full">


            <div className="flex flex-col w-1/2">
              <label className="text-gray-600 mb-1">სახელი*</label>
              <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="სახელი" className="border border-[#CED4DA] p-3 w-full h-[42px] rounded-[6px] text-gray-900" required />
            </div>


            <div className="flex flex-col w-1/2">
              <label className="text-gray-600 mb-1">გვარი*</label>
              <input type="text" name="surname" value={formData.surname} onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                placeholder="გვარი" className="border border-gray-300 p-3 w-full rounded-md" required />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-[813px] h-[120px] border-dashed border-2 border-gray-400 rounded-[8px] p-4">
  <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
    <div className="relative flex items-center justify-center w-[85px] h-[115px] rounded-full overflow-hidden">
      {avatarPreview ? (
        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover rounded-full" />
      ) : (
        <span className="text-gray-400 text-sm flex items-center justify-center text-center">ატვირთე<br />ფოტო</span>
      )}
    </div>
  </label>
  <input
    id="avatar-upload"
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
  {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
</div>


          <div className="flex flex-col w-1/2 relative w-[384px]" ref={dropdownRef}>
             <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full h-[42px] border border-[#CED4DA] rounded-[6px] px-4 flex items-center justify-between bg-white shadow-sm"
                >
                <span className="truncate w-[300px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {selectedDepartment ? selectedDepartment.name : "აირჩიეთ დეპარტამენტი"}
                </span>
                <img src="/arrow-down.svg" alt="Dropdown Arrow" className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
             </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-1 w-full bg-white border border-[#CED4DA] rounded-lg shadow-md p-2 z-50">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-100 rounded-md px-3"
                    onClick={() => handleDepartmentSelect(dept)}>
                    <div key={dept.id} className="flex items-center gap-2 py-0.5 cursor-pointer hover:bg-gray-100 rounded-md px-3"
                        onClick={() => handleDepartmentSelect(dept)}>
                        <span>{dept.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="flex justify-end gap-[12px] mt-[60px]">
            <button 
              type="button" 
              className="w-[128px] h-[40px] text-[#8338EC] text-[14px] font-medium border border-[#8338EC] rounded-[8px] hover:bg-[#f3e8ff]" 
              onClick={onClose}
            >
              გაუქმება
            </button>
            <button 
              type="submit" 
              className="w-[196px] h-[40px] bg-[#8338EC] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#6f2dbd]"
            >
              დაამატე თანამშრომელი
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;