import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { User, Mail, Shield, Search } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                };
                const response = await axios.get('http://localhost:5001/api/auth/users', config);
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        if (currentUser && currentUser.token) {
            fetchUsers();
        }
    }, [currentUser]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">View and manage system users</p>
                </div>
                <div className="bg-white p-2 rounded-full border border-gray-200 shadow-sm text-sm font-medium px-4">
                    Total Users: {users.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium">User</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">User ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-gray-500 text-xs flex items-center mt-0.5">
                                                        <Mail size={12} className="mr-1" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin'
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                {user.role === 'admin' && <Shield size={10} className="mr-1" />}
                                                {user.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-xs font-mono">
                                            {user._id}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
