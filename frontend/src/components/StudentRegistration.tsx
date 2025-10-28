import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../contexts/Web3Context';
import { GraduationCap, User, Hash, FileText, Building, AlertCircle, CheckCircle } from 'lucide-react';

const StudentRegistration: React.FC = () => {
  const { isConnected, contract } = useWeb3();
  const [formData, setFormData] = useState({
    usn: '',
    name: '',
    certId: '',
    certInfo: '',
    branch: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (!formData.usn || !formData.name || !formData.certId || !formData.certInfo || !formData.branch) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const tx = await contract.setStudent(
        formData.usn,
        formData.name,
        formData.certId,
        formData.certInfo,
        formData.branch
      );

      await tx.wait();
      
      setMessage({ type: 'success', text: 'Student registration successful! Certificate added to blockchain.' });
      
      // Reset form
      setFormData({
        usn: '',
        name: '',
        certId: '',
        certInfo: '',
        branch: ''
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
            Please connect your wallet to register as a student.
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
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Registration</h1>
            <p className="text-gray-600">Register your certificate on the blockchain</p>
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
                USN (University Serial Number)
              </label>
              <input
                type="text"
                name="usn"
                value={formData.usn}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your USN"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Certificate ID
            </label>
            <input
              type="text"
              name="certId"
              value={formData.certId}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter unique certificate ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Certificate Information
            </label>
            <textarea
              name="certInfo"
              value={formData.certInfo}
              onChange={handleInputChange}
              className="input-field min-h-[100px] resize-none"
              placeholder="Describe your certificate details..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Branch/Department
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your branch or department"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your certificate will be stored permanently on the blockchain</li>
              <li>• You can only register once per wallet address</li>
              <li>• Certificate verification requires 3 teacher approvals</li>
              <li>• Make sure all information is accurate before submitting</li>
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
                <GraduationCap className="w-5 h-5" />
                Register Student
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default StudentRegistration;
