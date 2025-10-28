import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Users, FileText } from 'lucide-react';

const Hero: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure Verification',
      description: 'Blockchain-powered certificate verification ensures authenticity and prevents fraud.'
    },
    {
      icon: CheckCircle,
      title: 'Instant Validation',
      description: 'Verify certificates instantly with our decentralized verification system.'
    },
    {
      icon: Users,
      title: 'Multi-Verifier System',
      description: 'Certificates require verification from multiple trusted teachers.'
    },
    {
      icon: FileText,
      title: 'Immutable Records',
      description: 'All certificate data is stored permanently on the blockchain.'
    }
  ];

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Secure Certificate
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">
              {' '}Verification
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A decentralized platform for secure, transparent, and tamper-proof certificate verification 
            using blockchain technology. Trust, verify, and authenticate academic credentials with confidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Register</h3>
                <p className="text-gray-600 text-sm">
                  Students and teachers register on the platform with their credentials.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Verify</h3>
                <p className="text-gray-600 text-sm">
                  Teachers verify student certificates through the blockchain network.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Authenticate</h3>
                <p className="text-gray-600 text-sm">
                  Certificates are permanently stored and can be verified anytime.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
