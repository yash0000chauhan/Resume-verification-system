import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../contexts/Web3Context';
import { 
  Users, 
  GraduationCap, 
  Shield, 
  FileText, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  verifiedCertificates: number;
  pendingVerifications: number;
}

const Dashboard: React.FC = () => {
  const { isConnected, contract } = useWeb3();
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    verifiedCertificates: 0,
    pendingVerifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!contract) return;
      
      try {
        setLoading(true);
        
        // Fetch student addresses
        const studentAddresses = await contract.getStudentAddress();
        
        // Fetch teacher addresses
        const teacherAddresses = await contract.getTeacherAddress();
        
        // Count verified certificates (students with count = 3)
        let verifiedCount = 0;
        let pendingCount = 0;
        
        for (const address of studentAddresses) {
          const [, , , , , count] = await contract.getStudent(address);
          if (count >= 3) {
            verifiedCount++;
          } else {
            pendingCount++;
          }
        }
        
        setStats({
          totalStudents: studentAddresses.length,
          totalTeachers: teacherAddresses.length,
          verifiedCertificates: verifiedCount,
          pendingVerifications: pendingCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && contract) {
      fetchStats();
    }
  }, [isConnected, contract]);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: GraduationCap,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: Users,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Verified Certificates',
      value: stats.verifiedCertificates,
      icon: CheckCircle,
      color: 'emerald',
      change: '+15%'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      icon: Clock,
      color: 'orange',
      change: '-5%'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view the dashboard and access all features.
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div className="w-0 h-2 bg-primary-600 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to CertiChain Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor certificate verification activities and system statistics
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Certificate Management</p>
                <p className="text-sm text-blue-700">Secure blockchain storage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Multi-Verifier System</p>
                <p className="text-sm text-green-700">3-teacher verification required</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-900">Real-time Updates</p>
                <p className="text-sm text-purple-700">Live verification status</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <CheckCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Immutable Records</p>
                <p className="text-sm text-orange-700">Tamper-proof certificate data</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
