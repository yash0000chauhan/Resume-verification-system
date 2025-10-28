import { useState } from 'react';
import { Web3Provider } from './contexts/Web3Context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import StudentRegistration from './components/StudentRegistration';
import TeacherRegistration from './components/TeacherRegistration';
import CertificateVerification from './components/CertificateVerification';
import { Wallet, GraduationCap, Users, Shield } from 'lucide-react';

const queryClient = new QueryClient();

type TabType = 'dashboard' | 'student' | 'teacher' | 'verify';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Wallet },
    { id: 'student' as TabType, label: 'Student Registration', icon: GraduationCap },
    { id: 'teacher' as TabType, label: 'Teacher Registration', icon: Users },
    { id: 'verify' as TabType, label: 'Verify Certificate', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <Hero />
            <Dashboard />
          </div>
        );
      case 'student':
        return <StudentRegistration />;
      case 'teacher':
        return <TeacherRegistration />;
      case 'verify':
        return <CertificateVerification />;
      default:
        return (
          <div className="space-y-8">
            <Hero />
            <Dashboard />
          </div>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <div className="min-h-screen gradient-bg">
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-white/20">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;