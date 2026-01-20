import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, FileText } from 'lucide-react';

export default function QuickLinkCard({ link, index = 0 }) {
  const { title, description, icon: Icon, path, agentCount, promptCount } = link;

  // Single harmonious style for all cards (Teal Brand Color)
  const colors = {
    bg: 'bg-white hover:bg-[#007A8C]/5',
    icon: 'bg-[#F0EEE9] text-[#007A8C]',
    arrow: 'text-[#007A8C] group-hover:text-[#00353F]',
    border: 'border-[#00353F]/5 hover:border-[#007A8C]/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={path}
        className={`block rounded-2xl border ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${colors.bg}`}
      >
        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
            <Icon className="w-6 h-6" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-[#00353F] mb-1 group-hover:text-[#007A8C] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[#00353F]/60 mb-4">{description}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-[#00353F]/50">
              <Bot className="w-3.5 h-3.5" />
              <span>{agentCount} agents</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#00353F]/50">
              <FileText className="w-3.5 h-3.5" />
              <span>{promptCount} prompts</span>
            </div>
          </div>

          {/* Arrow */}
          <div className={`flex items-center gap-1 text-sm font-medium ${colors.arrow}`}>
            <span>Explorer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
