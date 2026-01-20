import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowLeft, Copy, Check, Sparkles, Wand2, Eye, EyeOff } from 'lucide-react';
import { departments } from '../data/agentsData';

export default function AgentFocusPage() {
    const { departmentId, agentId } = useParams();
    const department = departments[departmentId];

    if (!department) return null;

    const agent = department.agents.find(a => a.id === agentId);
    if (!agent) return null;

    const agentPrompts = department.prompts.filter(p => p.agentId === agent.id);

    return (
        <div className="min-h-screen bg-[#F0EEE9] pb-20">

            {/* Immersive Header */}
            <div className={`relative bg-gradient-to-b from-${agent.color}-50 to-[#F0EEE9] pt-12 pb-24 overflow-hidden`}>
                {/* Background Decorative Elements */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-${agent.color}-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2`} />

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <Link
                        to={`/${departmentId}`}
                        className="inline-flex items-center gap-2 text-[#00353F]/60 hover:text-[#007A8C] transition-colors mb-8 font-medium text-sm group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour au Hub {department.title}
                    </Link>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`p-6 rounded-3xl bg-white shadow-xl shadow-${agent.color}-900/5 ring-1 ring-[#00353F]/5`}
                        >
                            <agent.icon className={`w-12 h-12 text-${agent.color}-600`} />
                        </motion.div>

                        <div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center gap-3 justify-center md:justify-start mb-2"
                            >
                                <h1 className="text-4xl font-bold text-[#00353F] tracking-tight">{agent.name}</h1>
                                <span className={`px-3 py-1 rounded-full bg-white text-${agent.color}-700 text-xs font-bold uppercase tracking-wider border border-${agent.color}-100 shadow-sm`}>
                                    {agent.badge}
                                </span>
                            </motion.div>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-[#00353F]/70 max-w-2xl leading-relaxed"
                            >
                                {agent.description}
                            </motion.p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Mission Cockpit */}
            <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20 space-y-16">
                {agentPrompts.map((prompt, index) => (
                    <MissionCockpit key={prompt.id} prompt={prompt} agent={agent} index={index} />
                ))}
            </div>

        </div>
    );
}

// "The Mission Cockpit" Component
function MissionCockpit({ prompt, agent, index }) {
    const [subject, setSubject] = useState('');
    const [copied, setCopied] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    // Dynamic Prompt Generation
    const getDynamicPrompt = () => {
        if (!subject.trim()) return prompt.prompt;
        const placeholderRegex = /\[(.*?)\]/;
        if (placeholderRegex.test(prompt.prompt)) {
            return prompt.prompt.replace(placeholderRegex, subject);
        }
        return `Sujet : ${subject}\n\n${prompt.prompt}`;
    };

    const dynamicPromptText = getDynamicPrompt();

    const handleCopy = () => {
        navigator.clipboard.writeText(dynamicPromptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#00353F]/10 overflow-hidden ring-1 ring-[#00353F]/5"
        >
            {/* Cockpit Header */}
            <div className="bg-[#FAFAFA] border-b border-[#00353F]/5 p-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[#007A8C] text-sm font-bold uppercase tracking-wider mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Mission #{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#00353F]">
                        {prompt.title}
                    </h3>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-[#00353F]/40 text-xs font-bold uppercase tracking-wider mb-1">Objectif</p>
                    <p className="text-[#00353F] font-medium bg-[#00353F]/5 px-3 py-1 rounded-lg inline-block">
                        {prompt.objective}
                    </p>
                </div>
            </div>

            <div className="p-8 md:p-12 space-y-12">

                {/* SECTION 1: MAGIC INPUT */}
                <div className="relative group">
                    <label className="block text-sm font-bold text-[#00353F]/40 uppercase tracking-wider mb-4 pl-1">
                        1. Définissez votre sujet
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Ex : Soirée de Gala..."
                            className="w-full text-2xl md:text-3xl font-bold text-[#00353F] placeholder-[#00353F]/15 bg-transparent border-0 border-b-2 border-[#00353F]/10 px-0 py-4 focus:ring-0 focus:border-[#007A8C] transition-all"
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                            <AnimatePresence>
                                {subject && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        className="flex items-center gap-2 text-[#007A8C] font-medium bg-[#E3F2F6] px-3 py-1 rounded-full text-sm"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Prêt</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: THE MAGIC CARD (HIDDEN PROMPT) */}
                <div>
                    <div className="flex items-center justify-between mb-4 pl-1">
                        <label className="block text-sm font-bold text-[#00353F]/40 uppercase tracking-wider">
                            2. Récupérez votre formule
                        </label>
                        <button
                            onClick={() => setShowPrompt(!showPrompt)}
                            className="flex items-center gap-2 text-xs font-medium text-[#00353F]/40 hover:text-[#007A8C] transition-colors"
                        >
                            {showPrompt ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {showPrompt ? 'Masquer le prompt' : 'Voir le prompt (Avancé)'}
                        </button>
                    </div>

                    {/* The Action Card */}
                    <div className={`relative rounded-2xl p-1 transition-all duration-300 ${subject ? 'bg-gradient-to-r from-[#007A8C] via-[#22C55E] to-[#007A8C] p-[2px]' : 'bg-[#00353F]/5'}`}>
                        <div className="bg-[#FAFAFA] rounded-xl p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">

                            {/* Background Glow */}
                            {subject && (
                                <div className="absolute inset-0 bg-gradient-to-b from-[#007A8C]/5 to-transparent pointer-events-none" />
                            )}

                            <div className={`p-4 rounded-full mb-6 transition-all duration-500 ${subject ? 'bg-[#007A8C]/10 text-[#007A8C] scale-110' : 'bg-[#00353F]/5 text-[#00353F]/20'}`}>
                                {copied ? <Check className="w-8 h-8" /> : <Wand2 className="w-8 h-8" />}
                            </div>

                            <h4 className={`text-xl font-bold mb-2 transition-colors ${subject ? 'text-[#00353F]' : 'text-[#00353F]/40'}`}>
                                {copied ? "C'est dans le presse-papier !" : (subject ? 'Votre mission est prête' : 'En attente du sujet...')}
                            </h4>

                            <p className={`text-sm mb-8 max-w-sm mx-auto transition-colors ${subject ? 'text-[#00353F]/60' : 'text-[#00353F]/30'}`}>
                                {copied
                                    ? 'Vous pouvez maintenant lancer l\'agent.'
                                    : (subject ? 'L\'IA a généré le prompt parfait pour votre besoin.' : 'Remplissez le sujet ci-dessus pour générer la formule.')}
                            </p>

                            <button
                                onClick={handleCopy}
                                disabled={!subject}
                                className={`
                    group relative flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
                    ${!subject
                                        ? 'bg-[#00353F]/5 text-[#00353F]/20 cursor-not-allowed shadow-none'
                                        : (copied
                                            ? 'bg-[#007A8C] text-white hover:bg-[#006A7C] scale-105'
                                            : 'bg-[#00353F] text-white hover:bg-[#007A8C] hover:scale-105 hover:shadow-xl hover:shadow-[#007A8C]/20'
                                        )
                                    }
                  `}
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                <span>{copied ? 'Copié' : 'COPIER LA FORMULE'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Advanced: Raw Prompt View */}
                    <AnimatePresence>
                        {showPrompt && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 p-6 rounded-xl bg-[#00353F] text-[#F0EEE9]/80 font-mono text-sm leading-relaxed whitespace-pre-wrap border border-[#00353F]/10 shadow-inner">
                                    {dynamicPromptText}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* SECTION 3: ACTION DOCK (LAUNCH) */}
                <div>
                    <label className="block text-sm font-bold text-[#00353F]/40 uppercase tracking-wider mb-4 pl-1">
                        3. Lancez l'Agent
                    </label>

                    <div className="flex justify-center">
                        <a
                            href={copied ? agent.externalLink : '#'}
                            target={copied ? "_blank" : "_self"}
                            rel={copied ? "noopener noreferrer" : ""}
                            onClick={(e) => !copied && e.preventDefault()}
                            className={`
                group relative flex items-center gap-4 pl-8 pr-10 py-5 rounded-2xl transition-all duration-500 w-full md:w-auto justify-center md:justify-start
                ${copied
                                    ? 'bg-[#007A8C] text-white shadow-xl shadow-[#007A8C]/30 scale-105 cursor-pointer'
                                    : 'bg-[#F0EEE9] text-[#00353F]/40 cursor-not-allowed hover:bg-[#E5E2DC] pointer-events-none'
                                }
              `}
                        >
                            <div className={`p-2 rounded-xl ${copied ? 'bg-white/20' : 'bg-[#00353F]/5'}`}>
                                <agent.icon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className={`text-xs font-bold uppercase tracking-wider ${copied ? 'text-white/60' : 'text-inherit'}`}>Dernière étape</p>
                                <p className="text-lg font-bold">Lancer {agent.name}</p>
                            </div>
                            {copied && <ExternalLink className="w-5 h-5 ml-2 animate-pulse" />}

                            {!copied && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#00353F] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Copiez la formule d'abord !
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00353F] rotate-45" />
                                </div>
                            )}
                        </a>
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
