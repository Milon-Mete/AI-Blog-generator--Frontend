import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

export default function WelcomePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleGetStarted = () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="mb-6 bg-black border-b border-[purple] shadow p-4 text-white font-[Poppins]">
                <div className="flex justify-between items-center">
                    <h1 className="md:text-2xl text-xl font-bold text-[#af41af]">AI Blog Generator</h1>

                    <div className="hidden md:flex gap-4 items-center">
                        <Link to="/docs" onClick={() => setMenuOpen(false)} className="hover:border-b transition-all duration-200">Docs</Link>
                        <a href="#pricing" className="hover:border-b transition-all duration-200">Pricing</a>
                        <a href="#contact" className="hover:border-b transition-all duration-200">Contact</a>
                        <Link to="/login" className="border border-[purple] px-6 py-1 rounded-full hover:bg-[purple] text-sm md:text-base">Login</Link>
                        <Link to="/signup" className="border bg-[purple] border-[purple] px-6 py-1 rounded-full hover:bg-black text-sm md:text-base">Sign Up</Link>
                    </div>

                    <div className="md:hidden text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? '✕' : '☰'}
                    </div>
                </div>

                {menuOpen && (
                    <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center gap-4 px-6 py-4 z-50 md:hidden text-sm shadow-lg">
                        <Link to="/docs" className="hover:border-b transition-all duration-200">Docs</Link>
                        <a href="#pricing" className="hover:border-b transition-all duration-200">Pricing</a>
                        <a href="#contact" className="hover:border-b transition-all duration-200">Contact</a>
                        <div className="flex gap-4">
                            <Link to="/login" className="border border-[purple] px-4 py-1 rounded-full hover:bg-[purple]">Login</Link>
                            <Link to="/signup" className="border bg-[purple] border-[purple] px-4 py-1 rounded-full hover:bg-black">Sign Up</Link>
                        </div>
                    </div>
                )}
            </div>

            <div className="m-6 bg-[#c489c4] bg-opacity-20 backdrop-blur-md border border-[purple] rounded shadow p-6 h-full text-white text-center flex flex-col justify-center items-center font-[Poppins]">
                <div className="mb-8">
                    <h1 className="text-6xl font-bold mb-4">Welcome to the AI Blog Generator</h1>
                    <p className="text-lg mb-4">This application allows you to generate blog posts using AI.</p>
                </div>
                <div>
                    <p className="text-lg mb-4">Click the button below to get started!</p>
                    <button
                        onClick={handleGetStarted}
                        className="border-[purple] border text-white px-8 py-3 rounded-full 
                        hover:bg-purple-600 hover:text-white 
                        transition-all duration-300 
                        shadow-[0_0_20px_rgba(128,0,128,1)] 
                        hover:shadow-[0_0_20px_rgba(128,0,128,0.8)]"
                    >
                        Get Started <span className="ml-2">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
