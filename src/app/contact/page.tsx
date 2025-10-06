'use client';
import { useForm } from 'react-hook-form';

type FormData = {
    name: string;
    email: string;
    message: string;
};

const ContactPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        // Handle form submission
        console.log(data);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                    <label className="block mb-1 font-medium" htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 font-medium" htmlFor="email">Gmail</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', { required: 'Email is required', pattern: { value: /^[\w-.]+@gmail\.com$/, message: 'Enter a valid Gmail address' } })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="yourname@gmail.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 font-medium" htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        {...register('message', { required: 'Message is required' })}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        rows={4}
                        placeholder="Your message"
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ContactPage;