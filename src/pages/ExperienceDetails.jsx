import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { experienceAPI } from '../services/api';
import { ArrowLeft, Calendar, Building, Users, Edit3, Trash2 } from 'lucide-react';

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      const response = await experienceAPI.getById(id);
      setExperience(response.data);
    } catch (err) {
      console.error('Error fetching experience:', err);
      setError('Failed to fetch experience details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await experienceAPI.delete(id);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting experience:', error);
        alert('Failed to delete experience.');
      }
    }
  };

  const getResultColor = (result) => {
    switch (result?.toLowerCase()) {
      case 'selected':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'waiting':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Download or view resume with auth token
  const handleViewResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/experiences/${experience._id}/resume`, {
        headers: {
          'x-auth-token': token
        }
      });
      if (!response.ok) throw new Error('Failed to fetch resume');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      // Open in new tab if PDF, otherwise download
      if (experience.resume.contentType === 'application/pdf') {
        window.open(url, '_blank');
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = experience.resume.fileName || 'resume';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      alert('Could not open resume.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience Not Found</h2>
          <p className="text-gray-600 mb-4">The requested experience could not be found.</p>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {experience.companyName}
              </h1>
              <p className="text-gray-600">Interview Experience Details</p>
            </div>
            
            <div className="flex space-x-2">
              <Link
                to={`/edit-experience/${id}`}
                className="flex items-center space-x-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Experience Details */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Interview Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(experience.date)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Number of Rounds</p>
                <p className="text-lg font-semibold text-gray-900">{experience.rounds}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Result</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getResultColor(experience.result)}`}>
                  {experience.result}
                </span>
              </div>
            </div>
          </div>

          {/* Resume Download/View */}
          {experience.resume && experience.resume.fileName && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Used</h3>
              <button
                onClick={handleViewResume}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View/Download Resume ({experience.resume.fileName})
              </button>
            </div>
          )}

          {/* Domains */}
          {experience.domains && experience.domains.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Domains Covered</h3>
              <div className="flex flex-wrap gap-2">
                {experience.domains.map((domain, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md border border-blue-200"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Experience</h3>
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {experience.experience}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;