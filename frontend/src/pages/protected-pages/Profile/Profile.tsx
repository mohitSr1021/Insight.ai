import Sidebar from "../../../layout/Sidebar";
import { Settings, Mail, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../redux/store/rootStore";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../../redux/api/authAPI";

const Profile = () => {
    const dispatch = useAppDispatch();
    const { user, } = useAppSelector((state) => state.auth);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const userDetails = localStorage.getItem("userDetails");
        if (!userDetails) {
            setIsFetching(true);
            dispatch(fetchUserProfile())
                .finally(() => setIsFetching(false));
        }
    }, [dispatch]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    console.log("user?.createdAt?.$date➡️➡️➡️",user?.createdAt)

    return (
        <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="h-dvh overflow-auto flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

                        {/* Loader */}
                        {isFetching ? (
                            <div className="flex justify-center items-center">
                                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Profile Card */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <div className="text-center">
                                        <div className="relative inline-block">
                                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                                {user?.userName?.[0]?.toUpperCase() || "U"}
                                            </div>
                                            {/* <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                                <Settings className="w-5 h-5 text-gray-600" />
                                            </button> */}
                                        </div>
                                        <h2 className="mt-4 text-2xl font-semibold text-gray-800">{user?.userName || "Unknown User"}</h2>
                                        <div className="mt-2 flex items-center justify-center space-x-2 text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            <p className="text-sm">{user?.userEmail || "No Email"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Details Card */}
                                <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">Username</p>
                                                    <p className="font-medium">{user?.userName || "N/A"}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{user?.userEmail || "N/A"}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">Created At</p>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <p className="font-medium">{formatDate(user?.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm text-gray-500">Last Updated</p>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <p className="font-medium">{formatDate(user?.updatedAt)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex space-x-4">
                                            <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-lg shadow transition-colors duration-200 flex items-center justify-center space-x-2">
                                                <Settings className="w-4 h-4" />
                                                <span>Edit Profile</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
