import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiDownload, FiEye, FiHeart, FiShare2, FiArrowLeft, FiShoppingCart, FiCode, FiFileText, FiCpu, FiZap } from 'react-icons/fi';
import { TbRobot, TbHexagon3D, TbBrandOpenai } from 'react-icons/tb';
import { GiProcessor } from 'react-icons/gi';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

interface AIAgent {
  id: number;
  name: string;
  creator: string;
  price: number;
  rating: number;
  description: string;
  tags: string[];
  category: string;
  sales: number;
  downloads: number;
  version: string;
  features: string[];
  capabilities: string;
  requirements: string;
  documentation: string;
  image?: string;
  createdAt: string;
  lastUpdated: string;
}

const AIAgentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockAgent: AIAgent = {
      id: parseInt(id || '1'),
      name: 'SynthAnalytics Pro',
      creator: 'NeuroTech AI',
      price: 149.99,
      rating: 4.9,
      description: 'Advanced business intelligence agent for real-time market analysis and predictive forecasting. This AI agent combines machine learning algorithms with real-time data processing to provide accurate business insights and market predictions.',
      tags: ['business', 'analytics', 'finance', 'machine learning', 'forecasting'],
      category: 'business',
      sales: 1242,
      downloads: 892,
      version: '2.1.0',
      features: [
        'Real-time market analysis',
        'Predictive forecasting with 95% accuracy',
        'Multi-currency support',
        'Custom dashboard creation',
        'API integration capabilities',
        'Automated report generation'
      ],
      capabilities: 'This AI agent can analyze market trends, predict stock prices, generate business reports, and provide investment recommendations. It processes data from multiple sources including financial APIs, news feeds, and market indicators.',
      requirements: 'Python 3.8+, TensorFlow 2.0+, 8GB RAM, 2GB GPU memory, Internet connection for real-time data',
      documentation: 'Complete setup guide, API documentation, usage examples, and troubleshooting guide included.',
      createdAt: '2024-01-15',
      lastUpdated: '2024-06-10'
    };
    setAgent(mockAgent);
  }, [id]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business':
        return <TbHexagon3D className="text-cyan-400 text-4xl" />;
      case 'education':
        return <TbBrandOpenai className="text-emerald-400 text-4xl" />;
      case 'productivity':
        return <TbRobot className="text-purple-400 text-4xl" />;
      case 'creative':
        return <TbHexagon3D className="text-pink-400 text-4xl" />;
      case 'healthcare':
        return <GiProcessor className="text-red-400 text-4xl" />;
      default:
        return <TbRobot className="text-cyan-400 text-4xl" />;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
    // In real app, trigger actual download
  };

  const handleAddToCart = () => {
    // Add to cart functionality
    console.log('Added to cart:', agent?.name);
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading agent details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 text-white">
      <Header />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-900 rounded-full filter blur-[150px] opacity-20"></div>
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-cyan-700 rounded-full filter blur-[120px] opacity-15"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/ai-agents">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back to AI Agents</span>
          </motion.button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Agent Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-600/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center">
                    {getCategoryIcon(agent.category)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{agent.name}</h1>
                    <p className="text-gray-400">by {agent.creator}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-lg transition-all duration-200 ${
                      isFavorited 
                        ? 'text-red-400 bg-red-400/10' 
                        : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
                    }`}
                  >
                    <FiHeart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200">
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {agent.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {agent.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-700/50 text-sm rounded-full text-gray-300 border border-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{agent.rating} rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiDownload className="w-4 h-4" />
                  <span>{agent.downloads} downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiEye className="w-4 h-4" />
                  <span>{agent.sales} views</span>
                </div>
                <span className="bg-gray-700/50 px-2 py-1 rounded-full border border-gray-600">
                  v{agent.version}
                </span>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden"
            >
              {/* Tab Headers */}
              <div className="flex border-b border-gray-700">
                {[
                  { id: 'overview', label: 'Overview', icon: <FiEye className="w-4 h-4" /> },
                  { id: 'features', label: 'Features', icon: <FiZap className="w-4 h-4" /> },
                  { id: 'requirements', label: 'Requirements', icon: <FiCpu className="w-4 h-4" /> },
                  { id: 'documentation', label: 'Documentation', icon: <FiFileText className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Capabilities</h3>
                      <p className="text-gray-300 leading-relaxed">{agent.capabilities}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {agent.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'features' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {agent.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600 rounded-xl"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                              <FiZap className="w-4 h-4 text-cyan-400" />
                            </div>
                            <h4 className="font-semibold text-white">Feature {index + 1}</h4>
                          </div>
                          <p className="text-gray-300">{feature}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600 rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FiCpu className="w-5 h-5 text-cyan-400" />
                        System Requirements
                      </h3>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
                        <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                          {agent.requirements}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documentation' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600 rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FiFileText className="w-5 h-5 text-cyan-400" />
                        Documentation
                      </h3>
                      <p className="text-gray-300 leading-relaxed mb-4">{agent.documentation}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                          <h4 className="font-semibold text-white mb-2">Setup Guide</h4>
                          <p className="text-gray-400 text-sm">Complete installation and configuration instructions</p>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                          <h4 className="font-semibold text-white mb-2">API Reference</h4>
                          <p className="text-gray-400 text-sm">Detailed API documentation and examples</p>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                          <h4 className="font-semibold text-white mb-2">Usage Examples</h4>
                          <p className="text-gray-400 text-sm">Code samples and implementation guides</p>
                        </div>
                        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                          <h4 className="font-semibold text-white mb-2">Troubleshooting</h4>
                          <p className="text-gray-400 text-sm">Common issues and solutions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-6 sticky top-8"
            >
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-2">${agent.price}</div>
                <p className="text-gray-400">One-time purchase</p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-cyan-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <FiDownload className="w-5 h-5" />
                      Download Agent
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-600/50 hover:border-gray-500 transition-all duration-200"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </motion.button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-semibold text-white mb-3">What's Included</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    AI Model Files
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    Configuration Files
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    Complete Documentation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    Usage Examples
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    Support & Updates
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Agent Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-6"
            >
              <h4 className="font-semibold text-white mb-4">Agent Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version</span>
                  <span className="text-white">v{agent.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">{new Date(agent.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white">{new Date(agent.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white capitalize">{agent.category}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AIAgentDetail;