import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-blue-400 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-lg font-bold">Momentum</Link>
                <div>
                    <Link to="/" className="hover:underline">Dashboard</Link>
                    <Link to="/create" className="hover:underline">Create Task</Link>
                </div>
            </div>    
        </nav>

    );
};
