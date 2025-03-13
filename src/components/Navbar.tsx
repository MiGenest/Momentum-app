import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; 

const Navbar: React.FC = () => {
    return (
        <nav className="bg-blue-400 py-6 shadow-md">
            <div className="container mx-auto flex justify-between items-center max-w-[1920px] px-8">
                <Link to="/">
                <img src="/momentum.svg" alt="Momentum logo" className="h-10" />
                </Link>
                <div className="flex gap-6">
                    <Link to="/" className="text-gray-800 hover:text-purple-600 text-lg font-medium">Dashboard</Link>
                    <Link to="/create" className="hover:underline">Create Task</Link>
                </div>
            </div>    
        </nav>

    );
};

export default Navbar;