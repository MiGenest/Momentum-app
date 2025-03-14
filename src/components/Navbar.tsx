import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "../index.css";
import "../styles/global.css";


const Navbar: React.FC = () => {
    return (
        <div className="bg-white shadow-md w-[1920px] h-[100px] px-[120px] py-[30px] border-b border-[#FFFFFF]">
            <div className="flex justify-between items-center w-full h-full">
                <Link to="/" className="flex items-center gap-[4px]">
                <span className="text-[31px] font-fredoka text-[#8338EC]">Momentum</span>
                <img src="/Hourglass.svg" alt="Hourglass logo" className="w-[38px] h-[38px]" />
                </Link>

                <div className="flex gap-6">
                    <Link to="/create" className="btn-primary ">
                    <span>თანამშრომლის შექმნა</span>
                    </Link>
                    <Link to="/create" className="btn-secondary">
                    <img src="/add.svg" alt="Plus icon" className="w-[20px] h-[20px]" />
                    <span >შექმენი ახალი დავალება</span>
                    </Link>

                </div>
            </div>    
        </div>

    );
};

export default Navbar;