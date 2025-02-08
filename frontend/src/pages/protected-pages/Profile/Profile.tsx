import Sidebar from "../../../layout/Sidebar";
import { Settings, Mail, Calendar, } from 'lucide-react';

const Profile = () => {
    const user = {
        "_id": {
            "$oid": "67a5c34ec5c6f200aeec4eb4"
        },
        "userName": "gggg",
        "userEmail": "gggg@gmail.com",
        "createdAt": {
            "$date": "2025-02-07T08:24:46.687Z"
        },
        "updatedAt": {
            "$date": "2025-02-07T08:24:46.687Z"
        },
        "__v": 0
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="h-dvh overflow-auto flex-1 bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Profile Card */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                            {user.userName[0].toUpperCase()}
                                        </div>
                                        <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                            <Settings className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                    <h2 className="mt-4 text-2xl font-semibold text-gray-800">{user.userName}</h2>
                                    <div className="mt-2 flex items-center justify-center space-x-2 text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <p className="text-sm">{user.userEmail}</p>
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
                                                <p className="font-medium">{user.userName}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{user.userEmail}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">Created At</p>
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <p className="font-medium">{formatDate(user.createdAt.$date)}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm text-gray-500">Last Updated</p>
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <p className="font-medium">{formatDate(user.updatedAt.$date)}</p>
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
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;