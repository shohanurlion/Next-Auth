'use client';
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";

type Contact = {
    _id: string;
    name: string;
    email: string;
    message: string;
};

const DashboradContact = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios("/api/getcontact");
                setContacts(response.data.data || []);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };
        fetchContacts();
    }, []);

    const handleDelete = async (id: string) => {
        console.log("Deleting contact with ID:", id);
                try {
            const confirmDelete = window.confirm("Are you sure you want to delete this message?");
            if (!confirmDelete) return;

            const response = await axios.delete(`/api/deletcontact?id=${id}`);
            if (response.status === 200) {
                setContacts((prev) => prev.filter((contact) => contact._id !== id));
                alert("Contact deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            alert("Failed to delete contact");
        }
        
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Data</h2>
            <div className="space-y-4">
                {contacts.map((contact) => (
                    <div
                        key={contact._id}
                        className="flex items-center justify-between bg-white shadow rounded-lg p-4"
                    >
                        <div>
                            <div className="font-semibold">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                            <div className="mt-2 text-gray-700">{contact.message}</div>
                        </div>
                        <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(contact._id)}
                        >
                            <Trash2 size={24} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboradContact;
