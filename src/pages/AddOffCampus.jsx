import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { offCampusAPI } from '../services/api';

const AddOffCampus = () => {
	const [form, setForm] = useState({
		companyName: '',
		appliedDate: '',
		platform: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		try {
			await offCampusAPI.create(form);
			navigate('/offcampus');
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to add application');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-xl mx-auto py-10 px-4">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">Add Off-Campus Application</h1>
				<form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-5">
					{error && <div className="text-red-600 text-sm">{error}</div>}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
						<input
							type="text"
							name="companyName"
							value={form.companyName}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Applied Date</label>
						<input
							type="date"
							name="appliedDate"
							value={form.appliedDate}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
						<input
							type="text"
							name="platform"
							value={form.platform}
							onChange={handleChange}
							placeholder="LinkedIn, Company site, etc."
							className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div className="flex items-center justify-between">
						<Link to="/offcampus" className="text-gray-600 hover:underline">Cancel</Link>
						<button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60">
							{loading ? 'Saving...' : 'Save'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddOffCampus;


