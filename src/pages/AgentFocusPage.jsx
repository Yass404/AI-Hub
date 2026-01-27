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
    const [launchUnlocked, setLaunchUnlocked] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    // States for custom actions (API)
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const isApiMode = prompt.customAction === 'FETCH_TRENDS';

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
        setLaunchUnlocked(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch(`/api/trends?topic=${encodeURIComponent(subject || 'tendance')}`);
            if (!response.ok) throw new Error('Erreur réseau');
            const data = await response.json();
            setResults(data.data); // Assuming backend returns { data: [...] }
        } catch (err) {
            setError("Impossible de récupérer les tendances. Vérifiez que le back-end est lancé.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
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

                {/* SECTION 1: INPUT */}
                <div className="relative group">
                    <label className="block text-sm font-bold text-[#00353F]/40 uppercase tracking-wider mb-4 pl-1">
                        1. {isApiMode ? "Quel est votre thème ?" : "Définissez votre sujet"}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => {
                                setSubject(e.target.value);
                                setLaunchUnlocked(false);
                            }}
                            placeholder={isApiMode ? "Ex : Mariage Été 2026..." : "Ex : Soirée de Gala..."}
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

                {/* SECTION 2: ACTION CARD (SEARCH or COPY) */}
                <div>
                    {!isApiMode && (
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
                    )}

                    {isApiMode && (
                        <label className="block text-sm font-bold text-[#00353F]/40 uppercase tracking-wider mb-4 pl-1">
                            2. Lancez la recherche
                        </label>
                    )}

                    <div className={`relative rounded-2xl p-1 transition-all duration-300 ${(subject || isApiMode) ? 'bg-gradient-to-r from-[#007A8C] via-[#22C55E] to-[#007A8C] p-[2px]' : 'bg-[#00353F]/5'}`}>
                        <div className="bg-[#FAFAFA] rounded-xl p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">

                            {/* Background Glow */}
                            {(subject || isApiMode) && (
                                <div className="absolute inset-0 bg-gradient-to-b from-[#007A8C]/5 to-transparent pointer-events-none" />
                            )}

                            {/* Icon */}
                            <div className={`p-4 rounded-full mb-6 transition-all duration-500 ${(subject || isApiMode) ? 'bg-[#007A8C]/10 text-[#007A8C] scale-110' : 'bg-[#00353F]/5 text-[#00353F]/20'}`}>
                                {isApiMode ? (isLoading ? <Sparkles className="w-8 h-8 animate-spin" /> : <Sparkles className="w-8 h-8" />) : (copied ? <Check className="w-8 h-8" /> : <Wand2 className="w-8 h-8" />)}
                            </div>

                            {/* Text Status */}
                            <h4 className={`text-xl font-bold mb-2 transition-colors ${(subject || isApiMode) ? 'text-[#00353F]' : 'text-[#00353F]/40'}`}>
                                {isApiMode
                                    ? (results ? "Tendances trouvées !" : "Prêt à scanner le web")
                                    : (copied ? "C'est dans le presse-papier !" : (subject ? 'Votre mission est prête' : 'En attente du sujet...'))
                                }
                            </h4>

                            <p className={`text-sm mb-8 max-w-sm mx-auto transition-colors ${(subject || isApiMode) ? 'text-[#00353F]/60' : 'text-[#00353F]/30'}`}>
                                {isApiMode
                                    ? "L'IA va analyser les blogs et réseaux sociaux pour détecter les sujets chauds."
                                    : (copied
                                        ? 'Vous pouvez maintenant lancer l\'agent.'
                                        : (subject ? 'L\'IA a généré le prompt parfait pour votre besoin.' : 'Remplissez le sujet ci-dessus pour générer la formule.'))
                                }
                            </p>

                            {/* Main Button */}
                            {isApiMode ? (
                                <button
                                    onClick={handleSearch}
                                    disabled={!subject || isLoading}
                                    className={`
                                        group relative flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
                                        ${(!subject || isLoading)
                                            ? 'bg-[#00353F]/5 text-[#00353F]/20 cursor-not-allowed shadow-none'
                                            : 'bg-[#007A8C] text-white hover:bg-[#006A7C] scale-105'
                                        }
                                    `}
                                >
                                    {isLoading ? (
                                        <><span>Analyse en cours...</span></>
                                    ) : (
                                        <>
                                            <Wand2 className="w-5 h-5" />
                                            <span>LANCER L'ANALYSE</span>
                                        </>
                                    )}
                                </button>
                            ) : (
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
                            )}
                        </div>
                    </div>

                    {/* Results Area for API Mode */}
                    {isApiMode && results && (
                        <TrendsDisplay results={results} />
                    )}

                    {/* Error Display */}
                    {isApiMode && error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium">
                            {error}
                        </div>
                    )}

                    {/* Advanced: Raw Prompt View (Standard Mode Only) */}
                    <AnimatePresence>
                        {showPrompt && !isApiMode && (
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

                {/* SECTION 3: LAUNCH (Only for Standard Mode) */}
                {!isApiMode && (
                    <div>
                        <label className="block text-sm font-bold text-[#00353F]/40 uppercase tracking-wider mb-4 pl-1">
                            3. Lancez l'Agent
                        </label>

                        <div className="flex justify-center">
                            <a
                                href={launchUnlocked ? agent.externalLink : '#'}
                                target={launchUnlocked ? "_blank" : "_self"}
                                rel={launchUnlocked ? "noopener noreferrer" : ""}
                                onClick={(e) => !launchUnlocked && e.preventDefault()}
                                className={`
                    group relative flex items-center gap-4 pl-8 pr-10 py-5 rounded-2xl transition-all duration-500 w-full md:w-auto justify-center md:justify-start
                    ${launchUnlocked
                                        ? 'bg-[#007A8C] text-white shadow-xl shadow-[#007A8C]/30 scale-105 cursor-pointer'
                                        : 'bg-[#F0EEE9] text-[#00353F]/40 cursor-not-allowed hover:bg-[#E5E2DC] pointer-events-none'
                                    }
                `}
                            >
                                <div className={`p-2 rounded-xl ${launchUnlocked ? 'bg-white/20' : 'bg-[#00353F]/5'}`}>
                                    <agent.icon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className={`text-xs font-bold uppercase tracking-wider ${launchUnlocked ? 'text-white/60' : 'text-inherit'}`}>Dernière étape</p>
                                    <p className="text-lg font-bold">Lancer {agent.name}</p>
                                </div>
                                {launchUnlocked && <ExternalLink className="w-5 h-5 ml-2 animate-pulse" />}

                                {!launchUnlocked && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#00353F] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Copiez la formule d'abord !
                                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00353F] rotate-45" />
                                    </div>
                                )}
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </motion.div>
    );
}



// Trends Display Component with Pagination and Modal
function TrendsDisplay({ results }) {
    const [page, setPage] = useState(1);
    const [selectedTrend, setSelectedTrend] = useState(null);
    const [copiedPromptType, setCopiedPromptType] = useState(null); // 'guide', 'inspiration', 'news'

    const itemsPerPage = 5;
    const totalPages = Math.ceil(results.length / itemsPerPage);
    const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Helper to find specific agent prompts
    const redactionAgents = departments.redaction.agents;
    const guideAgent = redactionAgents.find(a => a.id === 'agent-guide');
    const inspirationAgent = redactionAgents.find(a => a.id === 'agent-inspiration');
    const newsAgent = redactionAgents.find(a => a.id === 'agent-actualite');

    const handleCopySpecificPrompt = (type, trend) => {
        let basePrompt = "";
        let agentName = "";

        // Construct specific prompts based on the chosen agent
        if (type === 'guide') {
            agentName = "Guide";
            basePrompt = `Tu es l'Agent Guide. Rédige un guide complet et détaillé sur la tendance : "${trend.title}".
Cible : Futurs mariés et organisateurs d'événements.
Mot-clé SEO principal : ${trend.keyword}.
Contexte : ${trend.description}.
Angle : Comment tout savoir sur cette tendance et l'appliquer de A à Z.
Ton : Expert et pédagogique.`;
        } else if (type === 'inspiration') {
            agentName = "Inspiration";
            basePrompt = `Tu es l'Agent Inspiration. Rédige un Top 10 ou une Liste d'inspiration sur : "${trend.title}".
Cible : Futurs mariés.
Mot-clé SEO principal : ${trend.keyword}.
Contexte : ${trend.description}.
Angle : Les meilleures idées visuelles pour adopter cette tendance.
Ton : Viral et enthousiaste.`;
        } else if (type === 'news') {
            agentName = "Actualité";
            basePrompt = `Tu es l'Agent Actualité. Rédige un article style Magazine sur la tendance : "${trend.title}".
Cible : Professionnels et passionnés.
Mot-clé SEO principal : ${trend.keyword}.
Contexte : ${trend.description}.
Angle : Pourquoi c'est la tendance du moment et son impact sur le secteur.
Ton : Journalistique et "In the know".`;
        }

        navigator.clipboard.writeText(basePrompt);
        setCopiedPromptType(type);
        setTimeout(() => setCopiedPromptType(null), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#00353F]">Résultats ({results.length})</h3>
                <div className="text-sm text-[#00353F]/50">Page {page} / {totalPages}</div>
            </div>

            <div className="grid gap-4">
                {paginatedResults.map((trend) => (
                    <div
                        key={trend.id}
                        onClick={() => setSelectedTrend(trend)}
                        className="bg-white border border-[#00353F]/10 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#007A8C]/30 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h5 className="text-lg font-bold text-[#00353F] group-hover:text-[#007A8C] transition-colors">{trend.title}</h5>
                            <span className="bg-[#007A8C]/10 text-[#007A8C] text-xs font-bold px-2 py-1 rounded">{trend.keyword}</span>
                        </div>
                        <p className="text-[#00353F]/70 text-sm line-clamp-2">{trend.description}</p>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 text-sm font-bold text-[#00353F] bg-white border border-[#00353F]/10 rounded-lg disabled:opacity-50 hover:bg-[#F0EEE9] transition-colors"
                    >
                        Précédent
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 text-sm font-bold text-[#00353F] bg-white border border-[#00353F]/10 rounded-lg disabled:opacity-50 hover:bg-[#F0EEE9] transition-colors"
                    >
                        Suivant
                    </button>
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedTrend && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedTrend(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>

                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-[#E3F2F6] text-[#007A8C] text-xs font-bold uppercase tracking-wider mb-3">
                                    {selectedTrend.category || "Tendance"}
                                </span>
                                <h3 className="text-2xl font-bold text-[#00353F] mb-2 leading-tight">{selectedTrend.title}</h3>
                                <p className="text-[#00353F]/60 font-medium text-sm">Mot-clé : {selectedTrend.keyword}</p>
                            </div>

                            <p className="text-[#00353F]/80 text-base leading-relaxed mb-8">
                                {selectedTrend.description}
                            </p>

                            {/* Action Buttons Section */}
                            <div>
                                <h4 className="text-xs font-bold text-[#00353F]/40 uppercase tracking-wider mb-4">
                                    Passer à la rédaction
                                </h4>
                                <div className="space-y-3">
                                    {/* Button Guide */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopySpecificPrompt('guide', selectedTrend)}
                                            className={`flex-1 p-4 rounded-xl font-bold text-left flex items-center justify-between transition-all border ${copiedPromptType === 'guide'
                                                ? 'bg-[#22C55E] text-white border-[#22C55E]'
                                                : 'bg-white text-[#00353F] border-[#00353F]/10 hover:border-[#007A8C] hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${copiedPromptType === 'guide' ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                                                    <guideAgent.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">Guide Complet</div>
                                                    <div className={`text-xs ${copiedPromptType === 'guide' ? 'text-white/80' : 'text-[#00353F]/50'}`}>Article de fond structuré</div>
                                                </div>
                                            </div>
                                            {copiedPromptType === 'guide' ? <Check className="w-5 h-5" /> : <Copy className="w-4 h-4 opacity-50" />}
                                        </button>
                                        <a
                                            href={guideAgent.externalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-16 flex items-center justify-center rounded-xl border border-[#00353F]/10 bg-white text-[#00353F]/40 hover:text-[#007A8C] hover:border-[#007A8C] transition-all"
                                            title="Ouvrir l'agent dans un nouvel onglet"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>

                                    {/* Button Inspiration */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopySpecificPrompt('inspiration', selectedTrend)}
                                            className={`flex-1 p-4 rounded-xl font-bold text-left flex items-center justify-between transition-all border ${copiedPromptType === 'inspiration'
                                                ? 'bg-[#22C55E] text-white border-[#22C55E]'
                                                : 'bg-white text-[#00353F] border-[#00353F]/10 hover:border-[#007A8C] hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${copiedPromptType === 'inspiration' ? 'bg-white/20' : 'bg-amber-50 text-amber-600'}`}>
                                                    <inspirationAgent.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">Inspiration / Top</div>
                                                    <div className={`text-xs ${copiedPromptType === 'inspiration' ? 'text-white/80' : 'text-[#00353F]/50'}`}>Liste virale & visuels</div>
                                                </div>
                                            </div>
                                            {copiedPromptType === 'inspiration' ? <Check className="w-5 h-5" /> : <Copy className="w-4 h-4 opacity-50" />}
                                        </button>
                                        <a
                                            href={inspirationAgent.externalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-16 flex items-center justify-center rounded-xl border border-[#00353F]/10 bg-white text-[#00353F]/40 hover:text-[#007A8C] hover:border-[#007A8C] transition-all"
                                            title="Ouvrir l'agent dans un nouvel onglet"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>

                                    {/* Button Actu */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleCopySpecificPrompt('news', selectedTrend)}
                                            className={`flex-1 p-4 rounded-xl font-bold text-left flex items-center justify-between transition-all border ${copiedPromptType === 'news'
                                                ? 'bg-[#22C55E] text-white border-[#22C55E]'
                                                : 'bg-white text-[#00353F] border-[#00353F]/10 hover:border-[#007A8C] hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${copiedPromptType === 'news' ? 'bg-white/20' : 'bg-rose-50 text-rose-600'}`}>
                                                    <newsAgent.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">Actualité / Mag</div>
                                                    <div className={`text-xs ${copiedPromptType === 'news' ? 'text-white/80' : 'text-[#00353F]/50'}`}>Article tendance & news</div>
                                                </div>
                                            </div>
                                            {copiedPromptType === 'news' ? <Check className="w-5 h-5" /> : <Copy className="w-4 h-4 opacity-50" />}
                                        </button>
                                        <a
                                            href={newsAgent.externalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-16 flex items-center justify-center rounded-xl border border-[#00353F]/10 bg-white text-[#00353F]/40 hover:text-[#007A8C] hover:border-[#007A8C] transition-all"
                                            title="Ouvrir l'agent dans un nouvel onglet"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 bg-[#00353F]/5 rounded-xl p-4 border border-[#00353F]/10">
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#007A8C] text-white flex items-center justify-center font-bold shadow-lg shadow-[#007A8C]/20">1</div>
                                        <p className="text-[#00353F] font-bold text-sm">Copiez le prompt</p>
                                    </div>

                                    <div className="hidden sm:block w-px h-8 bg-[#00353F]/10" />

                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-[#007A8C] text-[#007A8C] flex items-center justify-center font-bold">2</div>
                                        <p className="text-[#00353F] font-bold text-sm">Cliquez sur la flèche</p>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                        <div className="absolute inset-0 -z-10" onClick={() => setSelectedTrend(null)} />
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
