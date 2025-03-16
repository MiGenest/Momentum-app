import React, { useEffect, useState } from "react";
import axios from "axios";

interface Department {
  id: number;
  name: string;
}

const EmployeeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    avatar: null as File | null,
    department: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    avatar: "",
    department: "",
  });

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

  const validateInput = (name: string, value: string | File | null) => {
    let errorMessage = "";

    if (name === "firstName" || name === "lastName") {
      if (!/^[ა-ჰa-zA-Z\s]+$/.test(value as string)) {
        errorMessage = "მხოლოდ ქართული და ლათინური ასოები დასაშვებია";
      } else if ((value as string).length < 2) {
        errorMessage = "მინიმუმ 2 სიმბოლო";
      } else if ((value as string).length > 255) {
        errorMessage = "მაქსიმუმ 255 სიმბოლო";
      }
    }

    if (name === "avatar") {
      const file = value as File;
      if (file) {
        if (!file.type.startsWith("image")) {
          errorMessage = "მხოლოდ სურათია დასაშვები";
        } else if (file.size > 600 * 1024) {
          errorMessage = "სურათი არ უნდა აღემატებოდეს 600KB";
        }
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    validateInput(name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateInput("avatar", file);
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

    if (Object.values(errors).some((err) => err) || !formData.firstName || !formData.lastName || !formData.avatar || !formData.department) {
      alert("გთხოვთ, შეავსოთ ყველა აუცილებელი ველი სწორად");
      return;
    }

    const apiUrl = "https://momentum.redberryinternship.ge/api/employees";
    const token = "9e688caf-d90c-4a5f-bbca-2e34d10290bd";

    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("department", formData.department);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          <img src="/Cancel.svg" alt="Hourglass logo" className="w-[38px] h-[38px]" />
        </button>
        <h2 className="text-2x1 font-bold mb-6 text-center">თანამშრომლის დამატება</h2>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="სახელი"
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="გვარი"
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>

          <div className="flex flex-col items-center">
            {avatarPreview && (
              <img src={avatarPreview} alt="Avatar Preview" className="w-20 h-20 rounded-full mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
            {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar}</p>}
          </div>

          <div>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded-md"
              required
            >
              <option value="">აირჩიეთ დეპარტამენტი</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" className="border border-gray-300 px-6 py-2 rounded-md" onClick={onClose}>
              გაუქმება
            </button>
            <button type="submit" className="bg-[#8338EC] text-white px-6 py-2 rounded-md hover:bg-[#6f2dbd] disabled:bg-gray-400" disabled={Object.values(errors).some((err) => err)}>
              თანამშრომლის დამატება
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;