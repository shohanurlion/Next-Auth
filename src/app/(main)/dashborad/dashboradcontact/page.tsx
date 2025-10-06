'use client';
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";



type Contact = {
    id: string;
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
    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Data</h2>
            <div className="space-y-4">
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className="flex items-center justify-between bg-white shadow rounded-lg p-4"
                    >
                        <div>
                            <div className="font-semibold">{contact.name}</div>
                            <div className="text-sm text-gray-500">{contact.email}</div>
                            <div className="mt-2 text-gray-700">{contact.message}</div>
                        </div>
                        <button className="text-red-500 hover:text-red-700">
                            <Trash2 size={24} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboradContact;