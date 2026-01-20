import { motion } from 'framer-motion';
import { Sparkles, Bot, KeyRound, Scale, ArrowRight, Wand2, Fingerprint, Clock, Zap, LayoutGrid } from 'lucide-react';
import { QuickLinkCard } from '../components';
import { quickLinks } from '../data/agentsData';

const Star4Point = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0L14.595 9.405L24 12L14.595 14.595L12 24L9.405 14.595L0 12L9.405 9.405L12 0Z" />
  </svg>
);

const steps = [
  {
    id: 'step1',
    icon: Bot,
    title: "1. Choisissez votre Agent",
    description: "Sélectionnez l'assistant spécialisé (Rédaction, Commercial, Communication) adapté à votre tâche.",
    delay: 0.2,
  },
  {
    id: 'step2',
    icon: Wand2,
    title: "2. Définissez le Sujet",
    description: "Indiquez votre besoin dans le champ magique. La formule se personnalise automatiquement pour vous.",
    delay: 0.3,
  },
  {
    id: 'step3',
    icon: Fingerprint,
    title: "3. Lancez l'Agent",
    description: "Copiez la formule sur-mesure et lancez l'agent. Il dispose maintenant de tout le contexte nécessaire.",
    delay: 0.4,
  },
];

const benefits = [
  {
    id: 'time',
    icon: Clock,
    title: "Productivité",
    description: "Réduisez le temps de rédaction des e-mails, articles et réponses clients.",
  },
  {
    id: 'quality',
    icon: Zap,
    title: "Standardisation",
    description: "Maintenez le ton et la qualité ABC Salles sur tous les canaux.",
  },
  {
    id: 'creativity',
    icon: Sparkles,
    title: "Support",
    description: "Des suggestions automatiques pour débloquer les situations complexes.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section - Brand Dark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2.5rem] bg-[#00353F] shadow-2xl mb-20 min-h-[500px] flex items-center"
      >
        {/* Abstract Background Elements - Subtle */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#007A8C] opacity-20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#007A8C] opacity-10 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00353F]/50 backdrop-blur-md border border-[#007A8C]/30 rounded-full shadow-lg mb-10"
          >
            <div className="w-2 h-2 rounded-full bg-[#007A8C] animate-pulse" />
            <span className="text-sm font-semibold text-[#F0EEE9] tracking-wide uppercase">Outil Interne • Accès Sécurisé</span>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center justify-center mb-8"
          >
            <h1 className="text-7xl md:text-9xl font-bold text-[#F0EEE9] tracking-tighter mb-4">
              Hub Agents <span className="text-[#007A8C]">IA</span>
            </h1>
            <p className="text-xl md:text-2xl font-bold text-[#F0EEE9]/80 tracking-wide max-w-2xl mx-auto">
              La boîte à outils centralisée pour vos missions quotidiennes.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="px-6 py-3 rounded-xl bg-[#007A8C]/10 border border-[#007A8C]/20 backdrop-blur-sm flex items-center gap-3 text-[#F0EEE9] hover:bg-[#007A8C]/20 transition-colors">
              <LayoutGrid className="w-5 h-5 text-[#007A8C]" />
              <span className="font-medium">6 Pôles Métier</span>
            </div>
            <div className="px-6 py-3 rounded-xl bg-[#007A8C]/10 border border-[#007A8C]/20 backdrop-blur-sm flex items-center gap-3 text-[#F0EEE9] hover:bg-[#007A8C]/20 transition-colors">
              <Sparkles className="w-5 h-5 text-[#007A8C]" />
              <span className="font-medium">Modèles Premium</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Methodology Section (Mode d'emploi) */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#00353F] mb-4">Mode d'emploi</h2>
          <p className="text-[#00353F]/70">Workflow optimisé pour les équipes internes.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-[#007A8C]/20 -z-10" />

          {steps.map((step) => {
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="bg-[#F0EEE9] rounded-3xl p-6 border border-[#00353F]/10 shadow-lg shadow-[#00353F]/5 text-center relative"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#007A8C]/10 text-[#007A8C] shadow-sm flex items-center justify-center mb-6 transform transition-transform hover:scale-110">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#00353F] mb-3">{step.title}</h3>
                <p className="text-[#00353F]/70 leading-relaxed text-sm">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Value Proposition (Objectives) */}
      <div className="mb-24 bg-[#00353F] rounded-[40px] p-8 md:p-12 border border-[#00353F]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#F0EEE9] mb-6">Objectifs Opérationnels</h2>
            <div className="space-y-8">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#007A8C]/10 border border-[#007A8C]/20 flex items-center justify-center shadow-sm text-[#007A8C]">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#F0EEE9] mb-1">{benefit.title}</h4>
                    <p className="text-[#F0EEE9]/70 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F0EEE9] rounded-3xl p-8 border border-[#00353F]/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#007A8C]/10 rounded-bl-full -z-0 opacity-50" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00353F]/10 text-[#00353F] rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                Rappel
              </div>
              <h3 className="text-2xl font-bold text-[#00353F] mb-4">La Règle des 80/20</h3>
              <p className="text-[#00353F]/80 mb-6 leading-relaxed">
                L'IA est une aide, pas une solution autonome. <br /><br />
                <span className="font-bold text-[#007A8C]">80% Automatisé</span> : Structure, brouillon, idées.<br /><br />
                <span className="font-bold text-[#00353F]">20% Humain</span> : Vérification, contexte client, validation.<br /><br />
                Vos prompts doivent toujours être relus avant envoi.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-[#00353F]/50 italic">
                <Scale className="w-4 h-4" />
                <span>Qualité garantie par vos soins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00353F] rounded-lg text-[#F0EEE9]">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-[#00353F] tracking-tight">Accès par pôle</h2>
          </div>
          <span className="text-sm font-medium text-[#00353F]/60 hidden sm:block">Sélectionnez votre univers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickLinks.map((link, index) => (
            <QuickLinkCard key={link.id} link={link} index={index} />
          ))}
        </div>
      </motion.div>


      {/* Pro Tip Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 mt-24"
      >
        <div className="bg-[#00353F] rounded-[22px] p-8 md:p-10 border border-[#00353F] shadow-xl relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#007A8C] opacity-10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#F0EEE9] mb-4">Conseil d'utilisation</h2>
              <div className="inline-block px-3 py-1 bg-[#007A8C]/20 text-[#007A8C] rounded-full text-xs font-bold tracking-wider uppercase mb-4 border border-[#007A8C]/20">
                NOUVEAU
              </div>
              <p className="text-lg text-[#F0EEE9]/80 leading-relaxed max-w-2xl">
                Plus besoin de modifier le prompt manuellement ! <br />
                Utilisez simplement le <span className="text-[#F0EEE9] font-bold">Champ Magique</span> au dessus de chaque mission. L'IA injecte automatiquement vos critères dans la formule.
              </p>
            </div>

            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-4 px-6 py-4 bg-[#F0EEE9]/5 rounded-2xl border border-[#F0EEE9]/10 shadow-inner backdrop-blur-sm">
                <div className="text-center">
                  <span className="block text-xs text-[#F0EEE9]/50 uppercase mb-2">Sujet</span>
                  <code className="text-[#F0EEE9]/70 font-mono text-sm bg-black/20 px-2 py-1 rounded border border-[#F0EEE9]/10">Soirée Gala</code>
                </div>
                <ArrowRight className="w-5 h-5 text-[#007A8C]" />
                <div className="text-center">
                  <span className="block text-xs text-[#F0EEE9]/50 uppercase mb-2">Prompt Généré</span>
                  <span className="text-[#007A8C] font-bold text-sm bg-[#007A8C]/10 px-2 py-1 rounded border border-[#007A8C]/20 md:whitespace-nowrap">...sur une Soirée Gala...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
