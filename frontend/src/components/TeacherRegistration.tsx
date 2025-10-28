import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../contexts/Web3Context';
import { Users, User, Hash, Briefcase, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

const TeacherRegistration: React.FC = () => {
  const { isConnected, contract } = useWeb3();
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    post: '',
    domain: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !contract) {
      setMessage({ type: 'error', text: 'Please connect your wallet first' });
      return;
    }

    // Validate form
    if (!formData.name || !formData.id || !formData.post || !formData.domain) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const tx = await contract.setTeacher(
        formData.name,
        formData.id,
        formData.post,
        formData.domain
      );

      await tx.wait();
      
      setMessage({ type: 'success', text: 'Teacher registration successful! You can now verify certificates.' });
      
      // Reset form
      setFormData({
        name: '',
        id: '',
        post: '',
        domain: ''
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message?.includes('User denied')) {
        setMessage({ type: 'error', text: 'Transaction was cancelled by user' });
      } else if (error.message?.includes('already registered')) {
        setMessage({ type: 'error', text: 'This address is already registered as a student or teacher' });
      } else {
        setMessage({ type: 'error', text: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-md mx-auto"
        >
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h2>
          <p className="text-gray-600">
            Please connect your wallet to register as a teacher.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Registration</h1>
            <p className="text-gray-600">Join the verification network as a trusted teacher</p>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-2" />
                Teacher ID
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your teacher ID"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Position/Designation
            </label>
            <select
              name="post"
              value={formData.post}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select your position</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Head of Department">Head of Department</option>
              <option value="Dean">Dean</option>
              <option value="Principal">Principal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Domain/Subject Area
            </label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select your domain</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Management">Management</option>
              <option value="Commerce">Commerce</option>
              <option value="Arts">Arts</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Teacher Responsibilities:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Verify student certificates by checking authenticity</li>
              <li>• Each certificate requires verification from 3 different teachers</li>
              <li>• You can only verify each certificate once</li>
              <li>• Maintain academic integrity and professional standards</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Verification Process:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Students register their certificates on the platform</li>
              <li>• Teachers verify certificates using the verification tab</li>
              <li>• Once 3 teachers verify, the certificate is fully authenticated</li>
              <li>• All verification activities are recorded on the blockchain</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Registering...
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                Register Teacher
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default TeacherRegistration;
