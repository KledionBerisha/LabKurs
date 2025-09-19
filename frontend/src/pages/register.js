import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import auth from "../services/auth.service";

export default function RegisterPage() {
const history = useHistory();
const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "doctor",
    licenseNumber: "",
});
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState(null);
const [error, setError] = useState(null);

function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
}

async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.username || !form.firstName || !form.lastName || !form.email || !form.password) {
    setError("Please fill all required fields.");
    return;
    }

    setLoading(true);
    try {
    if (auth && typeof auth.register === "function") {
        await auth.register(form);
        setMessage("User registered successfully. Redirecting...");
    }
    setTimeout(() => history.push("/login"), 1500);
    } catch (err) {
    setError("Registration failed. " + (err?.message || ""));
    } finally {
    setLoading(false);
    }
}

return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-200 mb-6">
        Register
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <label className="block">
            <span className="text-gray-700 dark:text-gray-200">First Name</span>
            <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                required
            />
            </label>
            <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Last Name</span>
            <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                required
            />
            </label>
        </div>

        <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Username</span>
            <input
            type="text"
            name="username"
            value={form.username}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            required
            />
        </label>

        <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Email</span>
            <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            required
            />
        </label>

        <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Password</span>
            <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            required
            />
        </label>

            <label className="block">
            <span className="text-gray-700 dark:text-gray-200">Roli</span>
            <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            >
                <option value="" hidden>
                    Zgjedh rolin
                </option>
                <option value="doktor">Doktor</option>
                <option value="infermier">Infermier</option>
            </select>
            </label>

        {error && <div className="text-red-500 mt-2">{error}</div>}
        {message && <div className="text-green-600 mt-2">{message}</div>}

        <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
        >
            {loading ? "Registering..." : "Register"}
        </button>
        </form>

        <div className="text-center mt-6">
        <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium">
            Already have an account? Login here
        </Link>
        </div>
    </div>
    </div>
);
}
