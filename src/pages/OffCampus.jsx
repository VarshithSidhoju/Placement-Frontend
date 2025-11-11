import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { offCampusAPI } from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const OffCampus = () => {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAll = async () => {
			try {
				const res = await offCampusAPI.getAll();
				setItems(res.data || []);
			} catch (e) {
				setItems([]);
			} finally {
				setLoading(false);
			}
		};
		fetchAll();
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm('Delete this application?')) return;
		try {
			await offCampusAPI.delete(id);
			setItems(items.filter(i => i._id !== id));
		} catch (e) {
			// ignore
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-5xl mx-auto py-10 px-4">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Off-Campus Applications</h1>
					<Link to="/add-offcampus" className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						<Plus className="h-4 w-4" />
						<span>Add Application</span>
					</Link>
				</div>

				{items.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-10 text-center border border-gray-200">
						<p className="text-gray-700 mb-6">No off-campus applications yet.</p>
						<Link to="/add-offcampus" className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
							<Plus className="h-4 w-4" />
							<span>Add your first</span>
						</Link>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-md border border-gray-200">
						<div className="grid grid-cols-12 px-6 py-3 border-b bg-gray-50 text-sm font-semibold text-gray-700">
							<div className="col-span-5">Company</div>
							<div className="col-span-3">Applied Date</div>
							<div className="col-span-3">Platform</div>
							<div className="col-span-1 text-right">Actions</div>
						</div>
						<ul>
							{items.map(item => (
								<li key={item._id} className="grid grid-cols-12 px-6 py-4 border-b last:border-b-0 items-center">
									<div className="col-span-5 text-gray-900 font-medium">{item.companyName}</div>
									<div className="col-span-3 text-gray-700">{new Date(item.appliedDate).toLocaleDateString()}</div>
									<div className="col-span-3 text-gray-700">{item.platform}</div>
									<div className="col-span-1 flex justify-end">
										<button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-700 p-2 rounded">
											<Trash2 className="h-5 w-5" />
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default OffCampus;


