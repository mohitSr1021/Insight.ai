import { useState, useEffect } from "react";
import { Home, Star, MenuIcon, X, LogOut, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { authLogout } from "../redux/api/authAPI";
import useLayoutStatus from "../Hooks/useLayoutStatus";
import { useAppDispatch } from "../redux/store/rootStore";
import { logout } from "../redux/slices/AuthSlice/authSlice.tsx";
import { message } from "antd";
import { resetNotesState } from "../redux/slices/NoteSlice/noteSlice.tsx";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
    const { current } = useLayoutStatus();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobileOrTablet(
                current === "sm" ||
                current === "xs" ||
                current === "md" ||
                current === "lg"
            );
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, [current]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        const hideLoading = message.loading("Logging out, please wait...", 0);
        dispatch(authLogout())
            .unwrap()
            .then((response) => {
                hideLoading();
                message.success(response.message || "Logged out successfully!");
                dispatch(logout());
                dispatch(resetNotesState())
                navigate("/auth");
            })
            .catch((error) => {
                hideLoading();
                console.error("Logout failed:", error);
                message.error(error?.message || "Logout failed. Please try again.");
            });
    };

    return (
        <>
            {isMobileOrTablet && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-indigo-500 text-white rounded-full shadow-lg"
                    aria-label="Toggle Sidebar"
                >
                    {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
            )}
            <div
                className={`z-40
                    ${isMobileOrTablet
                        ? "fixed top-0 left-0 transition-transform duration-300 ease-in-out transform"
                        : "relative"
                    }
                    ${isMobileOrTablet && !isOpen
                        ? "-translate-x-full"
                        : "translate-x-0"
                    }
                    w-60 border rounded-r-4xl border-gray-300 bg-gray-50
                    ${isMobileOrTablet ? "h-dvh" : "h-[calc(100vh-5rem)]"}
                    ${isMobileOrTablet ? "pt-16" : "py-4"} 
                    flex flex-col
                `}
            >
                {/* Navigation Links Section */}
                <div className="flex-1 overflow-y-auto">
                    <nav className="space-y-2 px-4">
                        <NavLink
                            to="/home"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                                }`
                            }
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </NavLink>
                        <NavLink
                            to="/favourites"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                                }`
                            }
                        >
                            <Star size={18} />
                            <span>Favourites</span>
                        </NavLink>
                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? "bg-gray-200" : "hover:bg-gray-200"
                                }`
                            }
                        >
                            <User size={18} />
                            <span>About me</span>
                        </NavLink>
                    </nav>
                </div>

                {/* Logout Button Section */}
                <div className="px-4 mt-auto py-2 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
