'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "./CardComponent";

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserInterfaceProps {
    backendName: string;
}

const UserInterface: React.FC<UserInterfaceProps> = ({ backendName }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ 'name': '', 'email': '' })
    const [updateUser, setUpdateUser] = useState({ 'id': '', 'name': '', 'email': '' })

    // get all users from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/${backendName}/users`);
                setUsers(response.data.reverse());
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        fetchData();
    }, [backendName]);

    // create a new user
    const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/api/${backendName}/user`, newUser);
            setUsers([response.data, ...users]);
            setNewUser({ name: '', email: '' });
        }
        catch (error) {
            console.error("Error creating User: ", error);
        }
    }
    // update a user
    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await axios.put(`${apiUrl}/api/${backendName}/users/${updateUser.id}`, updateUser);
            setUpdateUser({ id: '', name: '', email: '' });
            setUsers(
                users.map((user) => {
                    if (user.id === parseInt(updateUser.id)) {
                        return { ...user, name: updateUser.name, email: updateUser.email };
                    }
                    return user;
                })
            )
        }
        catch (error) {
            console.error("Error upadating the user: ", error);
        }
    };

    // delete a user
    const deleteUser = async (userId:number)=>{
        try{
            await axios.delete(`${apiUrl}/api/${backendName}/users/${userId}`);
            setUsers(users.filter((user)=> user.id !== userId));
        }
        catch(error){
            console.error("Error Deleting the User : ", error);
        }
    }
    return (
        <div>
            <h1 className="text-xl text-center p-10">
                Name of the backend: {backendName}
            </h1>
            {/* Create User */}
            <form onSubmit={createUser} className="flex flex-col items-center p-4 rounded-md mr-70 ml-70 bg-white text-black">
                Create New User
                <input
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="m-2 p-2 border border-black rounded-md"
                />
                <input
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="m-2 p-2 border border-black rounded-md"
                />
                <button type='submit' className="bg-black text-white font-bold cursor-pointer font-xl p-2 rounded-md">
                    Add User
                </button>
            </form>

            {/* Update User */}
            <form onSubmit={handleUpdateUser} className="flex mt-10 flex-col items-center p-4 rounded-md mr-70 ml-70 bg-white text-black">
                Update the Existing User
                <input
                    placeholder="User Id"
                    value={updateUser.id}
                    onChange={(e) => setUpdateUser({...updateUser, id: e.target.value})}
                    className="m-2 p-2 border border-black rounded-md"
                />
                <input
                    placeholder="Name"
                    value={updateUser.name}
                    onChange={(e) => setUpdateUser({...updateUser, name: e.target.value})}
                    className="m-2 p-2 border border-black rounded-md"
                />
                <input
                    placeholder="Email"
                    value={updateUser.email}
                    onChange={(e) => setUpdateUser({...updateUser, email: e.target.value})}
                    className="m-2 p-2 border border-black rounded-md"
                />
                <button type='submit' className="bg-black text-white font-bold cursor-pointer font-xl p-2 rounded-md">
                    Update User
                </button>
            </form>

            {/* Display User */}
            <div className="flex flex-col gap-4 items-center">
                {users.map((user) => (
                    <div key={user.id} className="card bg-white p-2 rounded-lg ml-100 mr-100 mt-20 text-black text-3xl font-serif flex flex-col justify-center items-center">
                        <CardComponent card={user} />
                        <button
                            className="bg-red-600 text-white p-2 text-xl cursor-pointer rounded-lg"
                            onClick={() => deleteUser(user.id)} >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserInterface;
