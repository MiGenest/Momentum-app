import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "../index.css";
import "../styles/global.css";
import EmployeeModal from "./EmployeeModal";


const Navbar: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
        
    return (
        
        <div className="bg-white shadow-md w-[1920px] h-[100px] px-[120px] py-[30px] border-b border-[#FFFFFF]">
            <div className="flex justify-between items-center w-full h-full">
                <Link to="/" className="flex items-center gap-[4px]">
                <span className="text-[31px] font-fredoka text-[#8338EC]">Momentum</span>
                <img src="/Hourglass.svg" alt="Hourglass logo" className="w-[38px] h-[38px]" />
                </Link>

                <div className="flex gap-6">
                    <button className="w-[225px] h-[39px] text-[##212529] text-[14px] font-medium border border-[#8338EC] rounded-[8px] hover:bg-[#F9F5FF]" onClick={() => setShowModal(true)}>
                    <span>თანამშრომელის დამატება</span>
                    </button>

                    <Link to="/create" className="btn-secondary">
                    <img src="/add.svg" alt="Plus icon" className="w-[20px] h-[20px]" />
                    <span >შექმენი ახალი დავალება</span>
                    </Link>

                </div>
            </div>    
            {showModal && <EmployeeModal onClose={() => setShowModal(false)} />}
        </div>
    
    );
};

export default Navbar;