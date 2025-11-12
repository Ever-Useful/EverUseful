import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiDownload, FiEye, FiHeart } from 'react-icons/fi';
import { TbRobot, TbHexagon3D, TbBrandOpenai } from 'react-icons/tb';
import { GiProcessor } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import userService from '@/services/userService';
import { toast } from 'sonner';
//g
interface AIAgentCardProps {
  agent: {
    id: string;
    name: string;
    author: string;
    authorName?: string;
    authorUserType?: string;
    price: number;
    rating: number;
    description: string;
    tags: string[];
    category: string;
    sales: number;
    downloads: number;
    version: string;
    image?: string;
    createdBy?: string;
  };
  onAgentClick?: (agent: any) => void;
  onEditAgent?: (agent: any) => void;
  onDeleteAgent?: (agentId: string) => void;
  currentUserId?: string;
}

const AIAgentCard: React.FC<AIAgentCardProps> = ({ agent, onAgentClick, onEditAgent, onDeleteAgent, currentUserId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user, token } = useAuthState();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user || !token) {
      toast.error('You must be logged in to add items to cart.');
      return;
    }

    try {
      const userData = await userService.getUserProfile();
      if (!userData) {
        toast.error('User data not found');
        return;
      }

      // Add agent to cart
      await userService.addToCart({
        id: agent.id,
        name: agent.name,
        price: agent.price || 0,
        quantity: 1
      });
      toast.success('Agent added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add agent to cart');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business':
        return <TbHexagon3D className="text-cyan-400" />;
      case 'education':
        return <TbBrandOpenai className="text-emerald-400" />;
      case 'productivity':
        return <TbRobot className="text-purple-400" />;
      case 'creative':
        return <TbHexagon3D className="text-pink-400" />;
      case 'healthcare':
        return <GiProcessor className="text-red-400" />;
      default:
        return <TbRobot className="text-cyan-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return 'from-cyan-600/20 to-indigo-600/20 border-cyan-500/30';
      case 'education':
        return 'from-emerald-600/20 to-green-600/20 border-emerald-500/30';
      case 'productivity':
        return 'from-purple-600/20 to-violet-600/20 border-purple-500/30';
      case 'creative':
        return 'from-pink-600/20 to-rose-600/20 border-pink-500/30';
      case 'healthcare':
        return 'from-red-600/20 to-orange-600/20 border-red-500/30';
      default:
        return 'from-cyan-600/20 to-indigo-600/20 border-cyan-500/30';
    }
  };

  const handleCardClick = () => {
    if (onAgentClick) {
      onAgentClick(agent);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className={`relative bg-gradient-to-b from-gray-800/30 to-gray-900/50 border border-gray-700 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 h-full flex flex-col ${getCategoryColor(agent.category)}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-cyan-600/30 group-hover:to-indigo-600/30 transition-all duration-300">
              {getCategoryIcon(agent.category)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                {agent.name}
              </h3>
              <p className="text-sm text-gray-400">
                by <button
                  className="text-cyan-400 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    const authorId = (agent as any).author;
                    const authorType = (agent as any).authorUserType || '';
                    if (currentUserId && (authorId === currentUserId)) {
                      window.location.href = '/profile';
                      return;
                    }
                    const type = (authorType || '').toLowerCase();
                    if (type === 'freelancer') window.location.href = `/freelancerprofile/${authorId}`;
                    else window.location.href = `/studentprofile/${authorId}`;
                  }}
                >{agent.authorName || agent.author}</button>
              </p>
            </div>
          </div>
          
          {/* Only favorite button on explore; edit/delete will be hidden unless explicitly allowed by parent through props */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isFavorited 
                  ? 'text-red-400 bg-red-400/10' 
                  : 'text-gray-400 hover:text-red-400 hover:bg-red-400/10'
              }`}
            >
              <FiHeart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            
            {/* Edit and Delete buttons - only show for current user's agents */}
            {onEditAgent && onDeleteAgent && currentUserId && agent.createdBy === currentUserId && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditAgent) onEditAgent(agent);
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
                  title="Edit agent"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteAgent) onDeleteAgent(agent.id);
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                  title="Delete agent"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
          {agent.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-700/50 text-xs rounded-full text-gray-300 border border-gray-600"
            >
              {tag}
            </span>
          ))}
          {agent.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-700/50 text-xs rounded-full text-gray-400 border border-gray-600">
              +{agent.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{agent.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiDownload className="w-4 h-4" />
              <span>{agent.downloads}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiEye className="w-4 h-4" />
              <span>{agent.sales}</span>
            </div>
          </div>
          <span className="text-xs bg-gray-700/50 px-2 py-1 rounded-full border border-gray-600">
            v{agent.version}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            ${agent.price}
          </div>
          
          <div className="flex gap-2">
            <Link to={`/ai-agent/${agent.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-700 rounded-lg text-sm flex items-center gap-2 hover:from-cyan-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-cyan-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                <FiDownload className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-600/50 hover:border-gray-500 transition-all duration-200"
              onClick={handleAddToCart}
            >
              <FiShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 rounded-2xl pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

export default AIAgentCard;