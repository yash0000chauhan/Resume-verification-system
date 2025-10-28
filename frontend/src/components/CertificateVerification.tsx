import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  XCircle, 
  User, 
  Hash, 
  FileText, 
  Building,
  AlertCircle,
  Loader
} from 'lucide-react';

interface StudentData {
  usn: string;
  name: string;
  certId: string;
  certInfo: string;
  branch: string;
  count: number;
}

interface VerificationData {
  count: number;
  verifiers: string[];
}

const CertificateVerification: React.FC = () => {
  const { isConnected, contract } = useWeb3();
  const [searchAddress, setSearchAddress] = useState('');
  const [certificateHash, setCertificateHash] = useState('');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSearch = async () => {
    if (!contract || !searchAddress) return;

    try {
      setLoading(true);
      setMessage(null);

      const [usn, name, certId, certInfo, branch, count] = await contract.getStudent(searchAddress);
      const [verifyCount, verifier1, verifier2, verifier3] = await contract.getVerifyedBy(searchAddress);

      setStudentData({
        usn,
        name,
        certId,
        certInfo,
        branch,
        count: Number(count)
      });

      setVerificationData({
        count: Number(verifyCount),
        verifiers: [verifier1, verifier2, verifier3].filter(addr => addr !== '0x0000000000000000000000000000000000000000')
      });
    } catch (error) {
      console.error('Search error:', error);
      setMessage({ type: 'error', text: 'Student not found or invalid address' });
      setStudentData(null);
      setVerificationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!contract || !searchAddress || !certificateHash) {
      setMessage({ type: 'error', text: 'Please provide both student address and certificate hash' });
      return;
    }

    try {
      setVerifying(true);
      setMessage(null);

      const tx = await contract.verify(searchAddress, certificateHash);
      await tx.wait();

      setMessage({ type: 'success', text: 'Certificate verification successful!' });
      
      // Refresh the data
      await handleSearch();
    } catch (error: any) {
      console.error('Verification error:', error);
      if (error.message?.includes('User denied')) {
        setMessage({ type: 'error', text: 'Transaction was cancelled by user' });
      } else if (error.message?.includes('Invalid address')) {
        setMessage({ type: 'error', text: 'Invalid teacher address - you must be registered as a teacher' });
      } else if (error.message?.includes('Invalid Certificate Hash')) {
        setMessage({ type: 'error', text: 'Invalid certificate hash' });
      } else if (error.message?.includes('verified only Once')) {
        setMessage({ type: 'error', text: 'You have already verified this certificate' });
      } else {
        setMessage({ type: 'error', text: 'Verification failed. Please try again.' });
      }
    } finally {
      setVerifying(false);
    }
  };

  const getVerificationStatus = () => {
    if (!verificationData) return { status: 'unknown', color: 'gray', text: 'Unknown' };
    
    if (verificationData.count >= 3) {
      return { status: 'verified', color: 'green', text: 'Fully Verified' };
    } else if (verificationData.count > 0) {
      return { status: 'partial', color: 'yellow', text: 'Partially Verified' };
    } else {
      return { status: 'pending', color: 'orange', text: 'Pending Verification' };
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
            Please connect your wallet to verify certificates.
          </p>
        </motion.div>
      </div>
    );
  }

  const verificationStatus = getVerificationStatus();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
            <p className="text-gray-600">Search and verify student certificates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Student Wallet Address
            </label>
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="input-field"
              placeholder="Enter student's wallet address"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !searchAddress}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Certificate
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Student Information */}
      {studentData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Certificate Information</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              verificationStatus.color === 'green' ? 'bg-green-100 text-green-800' :
              verificationStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              verificationStatus.color === 'orange' ? 'bg-orange-100 text-orange-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {verificationStatus.text}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Student Name</p>
                  <p className="font-medium text-gray-900">{studentData.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">USN</p>
                  <p className="font-medium text-gray-900">{studentData.usn}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Certificate ID</p>
                  <p className="font-medium text-gray-900">{studentData.certId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="font-medium text-gray-900">{studentData.branch}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Certificate Details</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">{studentData.certInfo}</p>
              </div>
            </div>
          </div>

          {/* Verification Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Verification Progress</span>
              <span className="text-sm text-gray-600">{verificationData?.count || 0}/3 verifications</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((verificationData?.count || 0) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Verifiers List */}
          {verificationData && verificationData.verifiers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Verified By</h3>
              <div className="space-y-2">
                {verificationData.verifiers.map((verifier, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-mono text-gray-600">
                      {verifier.slice(0, 6)}...{verifier.slice(-4)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Verification Section */}
      {studentData && verificationData && verificationData.count < 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Verify Certificate</h2>

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
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{message.text}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Certificate Hash
              </label>
              <input
                type="text"
                value={certificateHash}
                onChange={(e) => setCertificateHash(e.target.value)}
                className="input-field"
                placeholder="Enter the certificate hash to verify"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Verification Guidelines:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure the certificate hash matches the student's registered certificate</li>
                <li>• Verify the authenticity of the certificate information</li>
                <li>• You can only verify each certificate once</li>
                <li>• Certificate requires 3 teacher verifications to be fully authenticated</li>
              </ul>
            </div>

            <button
              onClick={handleVerification}
              disabled={verifying || !certificateHash}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify Certificate
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CertificateVerification;
