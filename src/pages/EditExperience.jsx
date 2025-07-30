import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { experienceAPI } from '../services/api';
import InputField from '../components/InputField';
import { Save, ArrowLeft } from 'lucide-react';

const EditExperience = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    companyName: '',
    date: '',
    rounds: '',
    domains: [],
    experience: '',
    result: 'waiting'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const domainOptions = [
    'DSA', 'DBMS', 'OOPs', 'System Design', 'Operating Systems',
    'Computer Networks', 'Behavioral', 'Technical', 'HR Round', 'Aptitude'
  ];

  useEffect(() => {
    const fetchExperience = async () => {
      setFetching(true);
      try {
        const response = await experienceAPI.getById(id);
        const data = response.data;
        setFormData({
          companyName: data.companyName || '',
          date: data.date ? data.date.slice(0, 10) : '',
          rounds: data.rounds || '',
          domains: data.domains || [],
          experience: data.experience || '',
          result: data.result || 'waiting',
        });
      } catch (err) {
        setError('Failed to fetch experience details.');
      } finally {
        setFetching(false);
      }
    };
    fetchExperience();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDomainChange = (domain) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await experienceAPI.update(id, formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Experience</h1>
          <p className="text-gray-600">Update your interview experience</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Google, Microsoft"
                required
              />

              <InputField
                label="Interview Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Number of Rounds"
                type="number"
                name="rounds"
                value={formData.rounds}
                onChange={handleChange}
                placeholder="e.g., 3"
                min="1"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result <span className="text-red-500">*</span>
                </label>
                <select
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="waiting">Waiting</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Domains Covered
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {domainOptions.map((domain) => (
                  <label
                    key={domain}
                    className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.domains.includes(domain)}
                      onChange={() => handleDomainChange(domain)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{domain}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your interview experience, questions asked, tips for others..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditExperience; 