import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function AgentCard({ agent, index = 0 }) {
  const { name, badge, description, icon: Icon, externalLink } = agent;

  // Standard Brand Theme (#007A8C)
  const colors = {
    bg: 'bg-white hover:bg-[#007A8C]/5',
    icon: 'bg-[#F0EEE9] text-[#007A8C]',
    badge: 'bg-[#007A8C]/10 text-[#007A8C]',
    button: 'bg-[#007A8C] hover:bg-[#00353F]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`bg-white rounded-2xl border border-[#00353F]/10 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${colors.bg}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
            {badge}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-[#00353F] mb-2">{name}</h3>
        <p className="text-sm text-[#00353F]/70 leading-relaxed mb-6">{description}</p>

        {/* Action */}
        <a
          href={externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[#F0EEE9] font-medium text-sm ${colors.button} transition-colors shadow-lg shadow-[#007A8C]/20`}
        >
          Ouvrir l'Agent
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}
