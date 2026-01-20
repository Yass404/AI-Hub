import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ChevronDown, Lightbulb, Clock, Sparkles, Zap, Target, FileText, Tag, Newspaper, Mail, MessageSquare, RefreshCw } from 'lucide-react';

const objectiveIcons = {
  // Rédaction
  'Production SEO': FileText,
  'Viralité & Tags': Tag,
  'Information Rapide': Newspaper,
  // Commercial
  'Premier Contact': Mail,
  'Négociation': MessageSquare,
  'Réactivation': RefreshCw,
  // Autres
  'Gain de temps': Clock,
  'Créativité': Sparkles,
  'Urgence': Zap,
  'Structure': Target,
  'Réécriture': Sparkles,
  'Titres': Sparkles,
  'Relance': Clock,
  'Objection': Target,
  'Icebreaker': Zap,
  'Persona': Target,
  'Avis Google': Zap,
  'LinkedIn': Sparkles,
};

// Function to highlight variables in square brackets
function highlightVariables(text) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, index) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={index} className="text-[#007A8C] font-bold bg-[#007A8C]/10 px-1 rounded">
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function PromptCard({ prompt, index = 0 }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { title, objective, prompt: promptText, tip } = prompt;
  const ObjectiveIcon = objectiveIcons[objective] || Sparkles;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-[#00353F]/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Header */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#007A8C]/10 text-[#007A8C]">
                <ObjectiveIcon className="w-3 h-3" />
                {objective}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#00353F]">{title}</h3>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#00353F]/40 mt-1"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Instructions */}
              <div className="bg-[#F0EEE9] rounded-lg px-3 py-2 border border-[#00353F]/5">
                <p className="text-xs text-[#00353F]/60">
                  <span className="font-medium text-[#00353F]">Mode d'emploi :</span> Copiez ce prompt et remplacez les parties en <span className="text-[#007A8C] font-bold">[BLEU]</span> par vos informations.
                </p>
              </div>

              {/* Prompt Code Block */}
              <div className="relative">
                <div className="bg-[#00353F] rounded-xl p-4 overflow-x-auto">
                  <pre className="text-sm text-[#F0EEE9] whitespace-pre-wrap font-mono leading-relaxed">
                    {highlightVariables(promptText)}
                  </pre>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                  className={`absolute top-3 right-3 p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${copied
                      ? 'bg-[#007A8C] text-white'
                      : 'bg-[#F0EEE9]/10 text-[#F0EEE9] hover:bg-[#F0EEE9]/20 hover:text-white'
                    }`}
                  title={copied ? 'Copié !' : 'Copier le prompt'}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-xs font-medium">Copier</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tip Section */}
              <div className="bg-[#007A8C]/5 border border-[#007A8C]/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#007A8C]/10 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-[#007A8C]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#00353F] mb-1">
                      Pourquoi ça marche ?
                    </p>
                    <p className="text-sm text-[#00353F]/70 leading-relaxed">
                      {tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
