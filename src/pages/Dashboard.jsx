import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { experienceAPI } from '../services/api';
import ExperienceCard from '../components/ExperienceCard';
import { Plus, Search, Filter, TrendingUp, Users, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('all');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await experienceAPI.getAll();
      setExperiences(response.data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await experienceAPI.delete(id);
        setExperiences(experiences.filter(exp => exp._id !== id));
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterResult === 'all' || exp.result?.toLowerCase() === filterResult;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: experiences.length,
    selected: experiences.filter(exp => exp.result?.toLowerCase() === 'selected').length,
    waiting: experiences.filter(exp => exp.result?.toLowerCase() === 'waiting').length
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your interview experiences and progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.selected}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.waiting}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Off-Campus quick link */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Companies applied off the campus</h3>
            <p className="text-gray-600">Track where you applied and through which platform.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/offcampus"
              className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              View List
            </Link>
            <Link
              to="/add-offcampus"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Company
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterResult}
                  onChange={(e) => setFilterResult(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Results</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                  <option value="waiting">Waiting</option>
                </select>
              </div>
              
              <Link
                to="/add-experience"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Experience</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Experiences Grid */}
        {filteredExperiences.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Experiences Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterResult !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start tracking your interview experiences by adding your first entry.'
              }
            </p>
            <Link
              to="/add-experience"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Experience</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard
                key={experience._id}
                experience={experience}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;