import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  PenTool,
  Briefcase,
  MessageCircle,
  Target,
  Palette,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Accueil', icon: Home, path: '/' },
  { id: 'redaction', label: 'Rédaction', icon: PenTool, path: '/redaction' },
  { id: 'commercial', label: 'Commercial', icon: Briefcase, path: '/commercial' },
  { id: 'communication', label: 'Communication', icon: MessageCircle, path: '/communication' },
  { id: 'marketing', label: 'Marketing', icon: Target, path: '/marketing' },
  { id: 'creation', label: 'Création Visuelle', icon: Palette, path: '/creation' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#F0EEE9] border-r border-[#00353F]/10 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[#00353F]/10">
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-bold text-[#00353F] tracking-tight" style={{ fontFamily: 'Comfortaa, system-ui, sans-serif' }}>
            abcsalles
          </span>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#007A8C] drop-shadow-[0_0_8px_rgba(0,122,140,0.5)]" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0L14.595 9.405L24 12L14.595 14.595L12 24L9.405 14.595L0 12L9.405 9.405L12 0Z" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                ? 'bg-[#007A8C]/10 text-[#007A8C]'
                : 'text-[#00353F]/90 hover:bg-[#00353F]/5 hover:text-[#00353F]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-[#007A8C]' : 'text-[#00353F] group-hover:text-[#00353F]'
                    }`}
                />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-[#007A8C] rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Badge "Bientôt" for inactive modules */}
                {['commercial', 'communication', 'marketing', 'creation'].includes(item.id) && (
                  <span className="ml-auto text-[10px] font-extrabold uppercase tracking-wider bg-[#00353F]/10 text-[#00353F]/60 px-2 py-0.5 rounded-full">
                    Bientôt
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#00353F]/10">
        <div className="bg-[#00353F]/5 rounded-xl p-4 border border-[#00353F]/5">
          <p className="text-xs font-semibold text-[#00353F]/80 leading-relaxed">
            <span className="font-bold text-[#00353F]">Besoin d'aide ?</span>
            <br />
            Contactez l'équipe Tech pour toute question sur les agents IA.
          </p>
        </div>
      </div>
    </aside>
  );
}
