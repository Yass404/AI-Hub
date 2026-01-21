import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '../components';
import { departments } from '../data/agentsData';

export default function DepartmentPage() {
  const { departmentId } = useParams();
  const department = departments[departmentId];

  if (!department) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-[#00353F] mb-4">Pôle non trouvé</h1>
        <p className="text-[#00353F]/60">Ce pôle n'existe pas ou n'est pas encore disponible.</p>
      </div>
    );
  }

  const { title, subtitle, icon, color, agents, sections } = department;

  const renderAgentGrid = (agentList) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
      {agentList.map((agent, index) => {
        const isComingSoon = agent.comingSoon;
        const CardWrapper = isComingSoon ? 'div' : Link;

        return (
          <CardWrapper
            key={agent.id}
            to={!isComingSoon ? `/${departmentId}/agent/${agent.id}` : undefined}
            className={`group block ${isComingSoon ? 'cursor-not-allowed opacity-60 grayscale' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`h-full bg-white rounded-2xl border border-[#00353F]/10 p-6 flex flex-col relative overflow-hidden transition-all duration-300 ${!isComingSoon ? 'hover:border-[#007A8C] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]' : ''
                }`}
            >
              {/* Top Accent Line */}
              {!isComingSoon && (
                <div className={`absolute top-0 left-0 w-full h-1 bg-${agent.color}-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3.5 rounded-xl bg-${agent.color}-50 text-${agent.color}-600 ${!isComingSoon ? `group-hover:bg-${agent.color}-100` : ''} transition-colors duration-300`}>
                  <agent.icon className="w-7 h-7" />
                </div>
                <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border 
                  ${isComingSoon
                    ? 'bg-[#00353F]/10 text-[#00353F]'
                    : 'bg-[#F0EEE9] text-[#00353F]/60 border-[#00353F]/5'
                  }`}>
                  {isComingSoon ? 'Bientôt' : agent.badge}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className={`text-lg font-bold text-[#00353F] mb-3 ${!isComingSoon ? 'group-hover:text-[#007A8C]' : ''} transition-colors`}>
                  {agent.name}
                </h3>
                <p className="text-[#00353F]/60 text-sm leading-relaxed mb-6 line-clamp-3">
                  {agent.description}
                </p>
              </div>

              {/* Footer CTA */}
              <div className="pt-6 mt-auto border-t border-gray-100 flex items-center justify-between text-sm">
                <span className={`font-semibold text-[#00353F]/70 ${!isComingSoon ? 'group-hover:text-[#007A8C]' : ''} transition-colors`}>
                  {isComingSoon ? 'En construction...' : 'Explorer'}
                </span>
                {!isComingSoon && (
                  <div className="p-1.5 rounded-full bg-[#F0EEE9] group-hover:bg-[#007A8C] group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>

            </motion.div>
          </CardWrapper>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        color={color}
      />

      {/* Main Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-[#00353F]/70 mb-16 max-w-2xl px-4 md:px-0 text-lg"
      >
        {department.description}
      </motion.p>

      {/* Sections Logic */}
      {sections ? (
        <div className="space-y-20 mb-20">
          {sections.map((section, idx) => {
            const sectionAgents = agents.filter(a => a.category === section.category);
            return (
              <div key={idx}>
                {/* Section Header */}
                <div className="px-4 md:px-0 mb-8 border-b border-[#00353F]/10 pb-4">
                  <h2 className="text-2xl font-bold text-[#00353F] mb-2">{section.title}</h2>
                  <p className="text-[#00353F]/60 text-sm">{section.description}</p>
                </div>
                {/* Section Content */}
                {renderAgentGrid(sectionAgents)}
              </div>
            );
          })}
        </div>
      ) : (
        // Standard Layout (No Sections)
        <div className="mb-20">
          {renderAgentGrid(agents)}
        </div>
      )}

    </div>
  );
}
