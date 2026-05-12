import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen,
  PenTool,
  Image as ImageIcon,
  Copy,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  HelpCircle,
} from 'lucide-react'

// Each step: title, body (JSX), screenshot path under /public/help/, alt text.
const steps = [
  {
    n: 1,
    title: 'Choisis ton agent dans le pôle Rédaction',
    body: (
      <>
        <p>Va sur la page <Link to="/redaction" className="text-[#007A8C] underline font-bold">Rédaction</Link> et choisis l'agent qui correspond à ton article :</p>
        <ul className="mt-3 space-y-1.5 ml-4 list-disc text-[#00353F]/80">
          <li><strong>Agent Guide</strong> — article de fond, conseils, organisation d'événements</li>
          <li><strong>Agent Inspiration</strong> — Top / Liste / sélections de lieux</li>
          <li><strong>Agent Actualité</strong> — brèves, réglementations, news courtes</li>
        </ul>
      </>
    ),
    screenshot: '/help/01-departement-redaction.png',
    alt: 'Liste des agents dans le pôle Rédaction',
  },
  {
    n: 2,
    title: 'Mission #1 — Génère le prompt et lance le Gem',
    body: (
      <>
        <p>Tape ton sujet dans le grand champ (par exemple <em>« Soirée de Gala »</em>).</p>
        <p className="mt-3">L'outil construit automatiquement la formule complète. Clique sur <strong>« Copier la formule »</strong>, puis sur <strong>« Lancer l'Agent »</strong> en bas. Le Gem Google s'ouvre dans un nouvel onglet — colle la formule et l'IA rédige ton article.</p>
        <div className="mt-3 bg-[#00353F]/5 rounded-lg p-3 text-sm flex gap-2 items-start">
          <Lightbulb className="w-4 h-4 text-[#C78A3A] flex-shrink-0 mt-0.5" />
          <span className="text-[#00353F]/80"><strong>Astuce :</strong> tu peux voir le prompt complet avant de le copier en cliquant sur « Voir le prompt » (en haut à droite de la zone).</span>
        </div>
      </>
    ),
    screenshot: '/help/02-mission-1-rempli.png',
    alt: "Mission #1 avec le sujet rempli et la formule prête à copier",
  },
  {
    n: 3,
    title: 'Récupère l\'article dans le CRM',
    body: (
      <>
        <p>Le Gem te renvoie un article structuré avec des balises <code className="bg-[#00353F]/5 px-1.5 py-0.5 rounded text-xs">=== 1. TITRE ===</code>, <code className="bg-[#00353F]/5 px-1.5 py-0.5 rounded text-xs">=== 2. CHAPÔ ===</code>, etc.</p>
        <p className="mt-3">Copie chaque bloc dans le champ correspondant du CRM. Le découpage est fait pour que le copier-coller soit immédiat.</p>
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <span className="text-amber-900"><strong>Important :</strong> garde la conversation Gem ouverte. Tu vas en avoir besoin pour les images.</span>
        </div>
      </>
    ),
    screenshot: '/help/03-article-rendu-gem.png',
    alt: "Réponse du Gem avec l'article découpé en balises CRM",
  },
  {
    n: 4,
    title: 'Reviens dans le hub — Mission #2 pour les photos',
    body: (
      <>
        <p>Une fois l'article rédigé, retourne sur la page de l'agent (le même <strong>Agent Guide</strong> par exemple) et scrolle jusqu'à la <strong>Mission #2 — Prompts Photo</strong>.</p>
        <p className="mt-3">Le sujet est déjà pré-rempli (depuis la Mission #1). Colle l'article rédigé dans la grande zone de texte, puis clique sur <strong>« Générer les prompts photo »</strong>.</p>
        <div className="mt-3 bg-[#00353F]/5 rounded-lg p-3 text-sm flex gap-2 items-start">
          <Lightbulb className="w-4 h-4 text-[#C78A3A] flex-shrink-0 mt-0.5" />
          <span className="text-[#00353F]/80"><strong>Plus tu donnes de contexte</strong> (H2, descriptions, vocabulaire culturel), <strong>meilleurs sont les prompts.</strong> Colle tout, du chapô à la FAQ.</span>
        </div>
      </>
    ),
    screenshot: '/help/04-mission-2-formulaire.png',
    alt: 'Mission #2 avec le sujet pré-rempli et la zone article à coller',
  },
  {
    n: 5,
    title: 'L\'outil génère 1 prompt par section H2',
    body: (
      <>
        <p>En quelques secondes, l'outil te renvoie une liste de prompts au style ABC Salles — un par section principale de ton article.</p>
        <p className="mt-3">Chaque prompt a son propre bouton <strong>« Copier »</strong>. Tu n'as plus qu'à les utiliser un par un.</p>
      </>
    ),
    screenshot: '/help/05-mission-2-prompts-generes.png',
    alt: 'Liste de prompts photo générés avec bouton Copier individuel',
  },
  {
    n: 6,
    title: 'Ouvre Gemini Imagen et colle le prompt',
    body: (
      <>
        <p>Clique sur <strong>« Ouvrir Gemini Imagen »</strong> en bas de la mission. Tu arrives sur <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-[#007A8C] underline font-bold">gemini.google.com/app</a>.</p>
        <p className="mt-3">Connecte-toi avec ton compte Google Pro, colle le premier prompt dans la zone de saisie. Gemini te génère <strong>4 variantes</strong> de la photo — choisis la meilleure.</p>
        <p className="mt-3">Répète pour chaque prompt de la liste (1 par section H2 de ton article).</p>
      </>
    ),
    screenshot: '/help/06-gemini-imagen-resultat.png',
    alt: 'Gemini Imagen affichant 4 variantes de photo générées',
  },
]

const faqs = [
  {
    q: 'Pourquoi je dois faire l\'article avant les photos ?',
    a: 'Parce que les prompts photo sont générés à partir de ton article. Plus l\'article est détaillé (H2, vocabulaire, exemples concrets), plus les prompts photo seront fidèles et précis. Sans article, on ne peut produire qu\'un prompt générique.',
  },
  {
    q: 'Combien de photos je peux générer par jour ?',
    a: 'Le hub envoie tes demandes à Gemini via l\'API officielle. La limite gratuite est de 1500 requêtes/jour — largement assez pour un usage normal en rédaction. Les images elles-mêmes sont générées dans ton compte Gemini Pro (donc liées à ton quota Pro).',
  },
  {
    q: 'Le résultat photo ne me plaît pas, qu\'est-ce que je peux faire ?',
    a: 'Dans Gemini Imagen, tu as 4 variantes par génération — choisis la meilleure. Si aucune ne convient, tu peux soit régénérer dans Gemini (mêmes prompts, autres résultats), soit revenir dans le hub et cliquer « Regénérer » sur la Mission #2 pour obtenir de nouveaux prompts.',
  },
  {
    q: 'Une suggestion pour améliorer l\'outil ?',
    a: 'Fais remonter toute idée d\'amélioration, bug ou retour à l\'équipe Tech. Plus on a de retours du terrain, plus on peut faire évoluer l\'outil pour qu\'il colle à ton usage réel.',
  },
  {
    q: 'Pour quels articles ça marche ?',
    a: 'Tous : guides, Top/Liste, actualités. Chaque agent a sa propre Mission #2 photo adaptée à son style.',
  },
  {
    q: 'Et si je n\'ai pas encore l\'article rédigé ?',
    a: 'Tu peux quand même tester la Mission #2 en collant un brouillon court. L\'outil exigera au moins 50 caractères dans la zone Article.',
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F0EEE9] pb-20">

      {/* Header */}
      <div className="relative bg-gradient-to-b from-indigo-50 to-[#F0EEE9] pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-3xl bg-white shadow-xl shadow-indigo-900/5 ring-1 ring-[#00353F]/5"
            >
              <BookOpen className="w-12 h-12 text-indigo-600" />
            </motion.div>

            <div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-bold text-[#00353F] tracking-tight mb-2"
              >
                Guide rédaction
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-[#00353F]/70 max-w-2xl leading-relaxed"
              >
                Comment publier un article complet (texte + photos) en 6 étapes, depuis le hub.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick path overview */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 mb-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#00353F]/10 ring-1 ring-[#00353F]/5 p-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#00353F]/40 mb-4">Le chemin complet en un coup d'œil</h2>
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {[
              { icon: PenTool, label: 'Sujet', desc: 'Mission #1' },
              { icon: Copy, label: 'Copier', desc: 'la formule' },
              { icon: ExternalLink, label: 'Gem', desc: 'rédaction IA' },
              { icon: CheckCircle2, label: 'CRM', desc: 'colle l\'article' },
              { icon: ImageIcon, label: 'Mission #2', desc: 'prompts photo' },
              { icon: ExternalLink, label: 'Imagen', desc: 'génère photos' },
            ].map((step, idx, arr) => (
              <div key={idx} className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-[#FAFAFA] rounded-xl p-3 text-center">
                  <step.icon className="w-5 h-5 text-[#007A8C] mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-[#00353F]">{step.label}</p>
                  <p className="text-[10px] text-[#00353F]/50 mt-0.5">{step.desc}</p>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[#00353F]/30 flex-shrink-0 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-3xl shadow-xl shadow-[#00353F]/5 ring-1 ring-[#00353F]/5 overflow-hidden"
          >
            <div className="md:grid md:grid-cols-2 gap-0">
              {/* Text */}
              <div className="p-8 md:p-10">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="w-9 h-9 rounded-full bg-[#007A8C] text-white flex items-center justify-center font-bold text-sm">
                    {step.n}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#007A8C]">Étape {step.n}</span>
                </div>
                <h3 className="text-2xl font-bold text-[#00353F] mb-4 leading-tight">{step.title}</h3>
                <div className="text-[#00353F]/80 leading-relaxed space-y-2 text-[15px]">
                  {step.body}
                </div>
              </div>

              {/* Screenshot */}
              <div className="bg-[#FAFAFA] md:border-l border-[#00353F]/5 p-6 flex items-center justify-center">
                <div className="w-full">
                  <img
                    src={step.screenshot}
                    alt={step.alt}
                    loading="lazy"
                    className="w-full rounded-xl shadow-lg shadow-[#00353F]/10 border border-[#00353F]/5"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div
                    style={{ display: 'none' }}
                    className="aspect-video bg-[#00353F]/5 rounded-xl items-center justify-center text-[#00353F]/30 text-sm text-center p-6"
                  >
                    Capture à venir<br />
                    <span className="text-xs">({step.screenshot})</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#00353F]/5 ring-1 ring-[#00353F]/5 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-[#00353F]">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="group bg-[#FAFAFA] rounded-2xl p-5 border border-[#00353F]/5">
                <summary className="font-bold text-[#00353F] cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{faq.q}</span>
                  <span className="text-[#007A8C] text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-[#00353F]/70 leading-relaxed text-[15px]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Need help */}
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div className="bg-[#00353F] text-white rounded-3xl p-8 md:p-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Une question, un bug, une idée ?</h2>
          <p className="text-white/70 mb-6">Contacte l'équipe Tech sur Google Chat — on revient vers toi rapidement.</p>
          <Link
            to="/redaction"
            className="inline-flex items-center gap-2 bg-white text-[#00353F] px-6 py-3 rounded-xl font-bold hover:bg-[#F0EEE9] transition-colors"
          >
            <PenTool className="w-4 h-4" />
            Aller au pôle Rédaction
          </Link>
        </div>
      </div>
    </div>
  )
}
