import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, TextInput, Select, Card, ScrollArea } from '@mantine/core';
import Navbar from '../../components/Navbar';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({ username: '', email: '', role: 'Customer' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users.');
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error(`Failed to add user: ${response.status}`);
            }

            alert('User added successfully');
            fetchUsers(); // Refresh users list
            setIsAddModalOpen(false); // Close modal
            setNewUser({ username: '', email: '', role: 'Customer' }); // Reset input fields
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user.');
        }
    };
    // Delete a user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to delete user: ${response.status}`);
            }

            alert('User deleted successfully');
            fetchUsers(); // Refresh users list
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };


    return (
        <div style={{ padding: '20px' }}>
            {/* Navbar */}
            <Navbar backPath="/" />

            {/* Main Section */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', marginTop: '20px' }}>
                <h2 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Manage Users</h2>

                {/* Add User Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <Button onClick={() => setIsAddModalOpen(true)} color="green" style={{ marginRight: '10px' }}>
                        Add User
                    </Button>
                </div>

                {/* Users Table */}
                <Card shadow="sm" padding="lg">
                    <ScrollArea>
                        <Table withBorder withColumnBorders verticalSpacing="md" horizontalSpacing="md">
                            <thead style={{ backgroundColor: '#f5f5f5' }}>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <Button size="xs" onClick={() => setSelectedUser(user)}>Edit</Button>
                                            <Button size="xs" color="red" onClick={() => handleDeleteUser(user.userId)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </ScrollArea>
                </Card>
            </div>

            {/* Add User Modal */}
            <Modal
                opened={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add User"
            >
                <TextInput
                    label="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <TextInput
                    label="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <Select
                    label="Role"
                    value={newUser.role}
                    onChange={(value) => setNewUser({ ...newUser, role: value })}
                    data={[
                        { value: 'Customer', label: 'Customer' },
                        { value: 'Admin', label: 'Admin' },
                    ]}
                />
                <Button fullWidth mt="md" onClick={handleAddUser} color="green">
                    Add User
                </Button>
            </Modal>
        </div>
    );
};

export default ManageUsers;
