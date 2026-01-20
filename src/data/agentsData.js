import {
  PenTool,
  FileText,
  Target,
  Handshake,
  Heart,
  Megaphone,
  Mail,
  Shield,
  BarChart3,
  Palette,
  ImagePlus,
  Newspaper,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const departments = {
  redaction: {
    id: 'redaction',
    title: 'Pôle Rédaction',
    subtitle: 'Production de contenus structurés pour le blog et le site',
    icon: PenTool,
    color: 'indigo',
    description: 'Trois agents spécialisés pour trois types de contenus. Chaque prompt génère une réponse découpée, prête à copier-coller dans les champs du CRM.',
    agents: [
      {
        id: 'agent-guide',
        name: 'Agent Guide',
        badge: 'Contenus Longs',
        description: 'Entraîné sur les guides ABC Salles. Pour les articles de fond, conseils et organisations d\'événements.',
        icon: BookOpen,
        externalLink: 'https://gemini.google.com/gem/1q4NMosRVWc3B1kHEdFhVN6AT3b4aFryx?usp=sharing',
        color: 'indigo',
      },
      {
        id: 'agent-inspiration',
        name: 'Agent Inspiration',
        badge: 'Viralité',
        description: 'Entraîné sur les articles d\'inspiration. Pour les sélections de lieux, Tops et tendances.',
        icon: Sparkles,
        externalLink: 'https://gemini.google.com/gem/1NTckf4RdYtA8jso6nZdIY1M6lvYeY5sy?usp=sharing',
        color: 'amber',
      },
      {
        id: 'agent-actualite',
        name: 'Agent Actualité',
        badge: 'Magazine',
        description: 'Entraîné sur les actualités sectorielles. Pour les réglementations, brèves et news courtes.',
        icon: Newspaper,
        externalLink: 'https://gemini.google.com/gem/1omQ3pf8ge7D8GBrVqcWJTCE_9fE4RFTW?usp=sharing',
        color: 'rose',
      },
    ],
    prompts: [
      {
        id: 'prompt-redaction-1',
        agentId: 'agent-guide',
        title: 'Guide Complet (Format CRM)',
        objective: 'Production SEO',
        prompt: `Tu es l'Agent Guide. Rédige un guide complet et détaillé sur : [SUJET DU GUIDE].

Ton objectif est de faciliter l'intégration immédiate dans notre CRM.
Sépare ta réponse strictement avec ces balises visuelles :

=== 1. CHAMP TITRE (H1) ===
(Propose un titre optimisé SEO, max 70 caractères)

=== 2. CHAMP CHAPÔ / INTRODUCTION ===
(Un paragraphe d'accroche de 80 à 100 mots qui résume la promesse avec émotion)

=== 3. CHAMP CONTENU PRINCIPAL (LONG FORM) ===
(Le corps du guide. Vise impérativement une longueur de 800 à 1000 mots pour le SEO.
Ne reste pas en surface : développe chaque partie en profondeur.
Utilise impérativement des H2 et H3. Utilise des listes à puces pour aérer. Format Markdown.)

=== 4. MODULE FAQ (Schema.org) ===
(5 questions/réponses pertinentes et détaillées pour le bas de page. Ne les inclus pas dans le texte principal)

=== 5. CHAMP META DESCRIPTION ===
(Une phrase d'incitation au clic pour Google, max 160 caractères)

CONSIGNES DE STYLE IMPÉRATIVES :
- Structure : Identique aux guides ABC Salles (H2/H3).
- Ton : Émotionnel, inspirant et "Storytelling". Fais sentir le vécu.
- Créativité : Évite les clichés génériques. Propose des exemples originaux, concrets et touchants (objets du quotidien, souvenirs personnels, textures) pour donner une "âme" au texte, comme dans les meilleurs articles du JSON.`,
        tip: 'Génère un article découpé (Titre, Intro, Corps, FAQ) prêt à copier-coller dans le CRM.',
      },
      {
        id: 'prompt-redaction-2',
        agentId: 'agent-inspiration',
        title: 'Article d\'Inspiration (Top / Liste)',
        objective: 'Viralité & Tags',
        prompt: `Tu es l'Agent Inspiration. Rédige un article type "Top" ou "Liste" sur : [THÈME].

IMPORTANT : Traite le sujet demandé (que ce soit un Lieu, une Robe, un Gâteau ou une Animation). Ne ramène pas tout à la salle si ce n'est pas le sujet.

Livre-moi le "Package CRM" complet :

=== 1. TITRE SEO SIMPLIFIÉ ===
(Type "Top 10..." ou "Les plus beaux...", accrocheur)

=== 2. CHAPÔ ÉMOTIONNEL ===
(Style magazine, donne envie de lire la suite)

=== 3. CONTENU (Structure LISTE DÉTAILLÉE) ===
(Vise 800 mots environ.
Développe chaque point de ta liste avec soin.
Utilise des H2 pour chaque item.
Sois descriptif, visuel et prescripteur de tendances.)

=== 4. MODULE FAQ ===
(3 questions pratiques sur le sujet)

=== 5. TAGS SUGGÉRÉS ===
(Mots-clés pour le site. Ex: Mode, Mariage, Bohème...)

Base-toi sur le style visuel et inspirant du fichier Inspiration.json.`,
        tip: 'Génère automatiquement les Tags et la structure "Liste" idéale pour les sélections de lieux.',
      },
      {
        id: 'prompt-redaction-3',
        agentId: 'agent-actualite',
        title: 'Article Tendance / Actualité',
        objective: 'Magazine & SEO',
        prompt: `Tu es l'Agent Actualité. Rédige un article d'actualité ou de tendance sur : [SUJET DE L'ACTU].

Ton objectif est de produire un article riche, digne d'un magazine spécialisé, prêt pour le CRM.
Sépare ta réponse strictement avec ces balises :

=== 1. CHAMP TITRE (H1) ===
(Informatif mais accrocheur, style journalistique. Max 70 caractères)

=== 2. CHAMP CHAPÔ (SYNTHÈSE) ===
(Un paragraphe de 60 à 80 mots qui pose le contexte, l'enjeu et la solution. Donne envie de lire la suite.)

=== 3. CHAMP CONTENU PRINCIPAL (DÉVELOPPEMENT) ===
(Vise 600 à 800 mots. Structure ton propos avec des H2.
IMPORTANT : Enrichis ton texte pour éviter le superficiel !
- Donne du contexte historique (D'où ça vient ? Qui l'a inventé ?).
- Cite des chiffres ou des études (ex: "% d'économie", "Budget moyen").
- Fais des liens concrets avec le secteur du mariage (Traiteur, Salle, Robe).
- Adopte un ton fluide et "Magazine", pas "Rapport administratif".)

=== 4. MODULE FAQ (PRATIQUE) ===
(3 questions concrètes : "Pourquoi l'adopter ?", "Combien ça rapporte ?", "Est-ce adapté à tous ?")

=== 5. CHAMP META DESCRIPTION ===
(Résumé incitatif pour Google, 160 caractères max)

=== 6. TAGS SUGGÉRÉS ===
(Mots-clés précis et sectoriels. Ex: Budget, Japon, Organisation, Tendance 2026...)

Base-toi sur la richesse et la fluidité des articles du fichier Actualites.json.`,
        tip: 'Génère un article type magazine, riche et bien structuré, idéal pour le SEO et l\'engagement lecteur.',
      },
    ],
  },
  commercial: {
    id: 'commercial',
    title: 'Pôle Commercial',
    subtitle: 'Boostez votre prospection et vos signatures',
    icon: Handshake,
    color: 'emerald',
    description: 'Trois agents pour trois moments clés : le premier contact, la négociation et le suivi. Des prompts prêts à copier pour gagner du temps au quotidien.',
    agents: [
      {
        id: 'agent-prospection',
        name: 'Agent Prospection',
        badge: 'Acquisition',
        description: 'Spécialisé dans le Cold Emailing. Il rédige des accroches percutantes pour capter de nouveaux partenaires (salles, prestataires).',
        icon: Target,
        externalLink: 'https://chat.openai.com',
        color: 'emerald',
      },
      {
        id: 'agent-negociation',
        name: 'Agent Négociation',
        badge: 'Vente',
        description: 'Aide à répondre aux objections difficiles (prix, concurrence) et à verrouiller les contrats avec des arguments solides.',
        icon: Handshake,
        externalLink: 'https://chat.openai.com',
        color: 'teal',
      },
      {
        id: 'agent-suivi',
        name: 'Agent Suivi Client',
        badge: 'Relationnel',
        description: 'Pour les relances douces après devis, les vœux, et l\'entretien du portefeuille existant. Ton humain et non intrusif.',
        icon: Heart,
        externalLink: 'https://chat.openai.com',
        color: 'rose',
      },
    ],
    prompts: [
      {
        id: 'prompt-commercial-1',
        agentId: 'agent-prospection',
        title: 'Email de Prospection (Cold Email)',
        objective: 'Premier Contact',
        prompt: `Tu es l'Agent Prospection. Je veux contacter un gérant de : [TYPE DE SALLE / VILLE].

Rédige une séquence de premier contact optimisée. Sépare bien :

=== OPTION 1 : OBJET DU MAIL ===
(Propose 3 objets courts et incitatifs, max 5 mots)

=== OPTION 2 : CORPS DU MAIL (AIDA) ===
(Structure : Attention > Intérêt > Désir > Action.
Ton : Professionnel mais direct.
Mets en avant la force du réseau ABC Salles.)

=== OPTION 3 : MESSAGE LINKEDIN (Bonus) ===
(Une version très courte de moins de 300 caractères pour une note de connexion)

Reste concis, personne ne lit les mails longs.`,
        tip: 'L\'agent propose plusieurs objets de mail pour que vous puissiez tester celui qui a le meilleur taux d\'ouverture.',
      },
      {
        id: 'prompt-commercial-2',
        agentId: 'agent-negociation',
        title: 'Réponse à une Objection Prix',
        objective: 'Négociation',
        prompt: `Tu es l'Agent Négociation.
Contexte : J'ai proposé un abonnement à [PRIX ANNONCÉ] mais le prospect me dit que c'est trop cher ou hors budget.

Donne-moi 3 angles d'attaque pour répondre, séparés clairement :

=== ANGLE 1 : LE ROI (Retour sur Investissement) ===
(Démontre qu'une seule réservation couvre le coût de l'abonnement)

=== ANGLE 2 : LA COMPARAISON (Coût vs Publicité classique) ===
(Compare le prix ABC Salles au coût d'une campagne Google Ads ou papier)

=== ANGLE 3 : LA QUALITÉ (Filtrage) ===
(Explique que nos leads sont qualifiés, contrairement aux annuaires gratuits)

Termine chaque angle par une question de relance ouverte.`,
        tip: 'Utilisez ces arguments au téléphone ou copiez-les dans un email de réponse.',
      },
      {
        id: 'prompt-commercial-3',
        agentId: 'agent-suivi',
        title: 'Email de Relance (Silence Radio)',
        objective: 'Réactivation',
        prompt: `Tu es l'Agent Suivi Client.
J'ai envoyé une proposition il y a [DURÉE DU SILENCE] et je n'ai pas de réponse.

Rédige un email de relance "Magic Email" (très court, non culpabilisant).

Structure attendue :
1. Objet (Intriguant mais soft)
2. Une phrase pour demander si le projet est toujours d'actualité.
3. Une porte de sortie ("Si vous avez choisi une autre solution, dites-le moi simplement").

Le but est d'obtenir une réponse, même négative, pour nettoyer le pipe.`,
        tip: 'Cette technique de relance "douce" permet souvent de débloquer une situation sans harceler le prospect.',
      },
    ],
  },
  communication: {
    id: 'communication',
    title: 'Communication',
    subtitle: 'Faites rayonner la marque ABC Salles',
    icon: Megaphone,
    color: 'rose',
    description: 'Amplifiez votre message sur tous les canaux : réseaux sociaux, relations presse, gestion de réputation. Ces agents vous aident à communiquer avec impact.',
    agents: [
      {
        id: 'socializer',
        name: 'Socializer',
        badge: 'Réseaux Sociaux',
        description: 'Votre community manager virtuel ! Il crée des posts engageants pour LinkedIn, Instagram et TikTok, adaptés aux codes de chaque plateforme.',
        icon: Megaphone,
        externalLink: 'https://chat.openai.com',
        color: 'rose',
      },
      {
        id: 'press-officer',
        name: 'Press Officer',
        badge: 'Relations Presse',
        description: 'Expert en RP et communication institutionnelle. Communiqués de presse, pitchs journalistes, talking points... Il structure vos prises de parole officielles.',
        icon: Mail,
        externalLink: 'https://chat.openai.com',
        color: 'indigo',
      },
      {
        id: 'crisis-guard',
        name: 'Crisis Guard',
        badge: 'E-réputation',
        description: 'Gardien de votre réputation en ligne. Il rédige des réponses aux avis négatifs (Google, Trustpilot) qui désamorcent les conflits avec élégance.',
        icon: Shield,
        externalLink: 'https://chat.openai.com',
        color: 'amber',
      },
    ],
    prompts: [
      {
        id: 'prompt-comm-1',
        agentId: 'crisis-guard',
        title: 'Répondre à un avis Google négatif',
        objective: 'Avis Google',
        prompt: `Tu es un expert en gestion de réputation en ligne.

Voici un avis négatif reçu sur Google :
"[COLLER L'AVIS NÉGATIF]"

Contexte interne (si connu) :
- Ce qui s'est réellement passé : [CONTEXTE]
- Actions correctives prises : [ACTIONS]

Rédige une réponse publique qui :
- Reste courtoise et professionnelle (jamais défensive)
- Remercie pour le retour
- Reconnaît le ressenti (sans forcément admettre une faute)
- Propose une solution ou un contact direct
- Montre notre souci de la satisfaction client
- Fait entre 50 et 100 mots

Important : Cette réponse sera lue par les futurs clients.`,
        tip: 'La réponse à un avis négatif n\'est pas écrite pour le client mécontent, mais pour les centaines de futurs clients qui la liront. C\'est une vitrine de votre professionnalisme.',
      },
      {
        id: 'prompt-comm-2',
        agentId: 'socializer',
        title: 'Transformer un article en post LinkedIn',
        objective: 'LinkedIn',
        prompt: `Tu es un expert en content marketing LinkedIn.

Transforme cet article de blog en post LinkedIn viral :
[COLLER LE LIEN OU LE RÉSUMÉ DE L'ARTICLE]

Structure du post :
1. Accroche "Hook" (1 ligne choc qui stoppe le scroll)
2. Constat ou histoire personnelle (2-3 lignes)
3. Les 3-5 enseignements clés (liste à puces avec emojis)
4. Question ouverte pour engager les commentaires
5. 3-5 hashtags pertinents

Contraintes :
- Moins de 1300 caractères
- Ton : Expert mais accessible
- Éviter le jargon corporate

Propose 2 versions d'accroches différentes.`,
        tip: 'Le "Hook" (première ligne) fait 80% du succès d\'un post LinkedIn. Elle doit créer une rupture cognitive qui force à cliquer sur "voir plus".',
      },
      {
        id: 'prompt-comm-3',
        agentId: 'socializer',
        title: 'Créer un post Instagram événementiel',
        objective: 'Créativité',
        prompt: `Tu es un social media manager créatif.

Crée un post Instagram pour mettre en avant :
- Événement/Salle : [NOM]
- Angle : [MARIAGE RÉUSSI / NOUVELLE SALLE / SAISON / PROMO...]
- Visuel prévu : [DESCRIPTION DU VISUEL]

Génère :
1. Caption engageante (max 150 mots)
   - Accroche émotionnelle
   - Storytelling ou mise en situation
   - Call-to-action clair
2. 10-15 hashtags (mix populaires + niche)
3. Idée de stories complémentaires (3 stories)

Ton : Inspirant, chaleureux, qui fait rêver.`,
        tip: 'Sur Instagram, l\'émotion prime sur l\'information. Le storytelling et la mise en situation permettent aux futurs clients de se projeter.',
      },
      {
        id: 'prompt-comm-4',
        agentId: 'press-officer',
        title: 'Rédiger un communiqué de presse',
        objective: 'Structure',
        prompt: `Tu es un attaché de presse expérimenté.

Rédige un communiqué de presse pour annoncer :
[NOUVELLE - ex: "Ouverture d'un nouveau domaine", "Partenariat", "Distinction reçue"]

Informations clés :
- Qui : [ÉMETTEUR]
- Quoi : [L'ANNONCE]
- Quand : [DATE]
- Où : [LIEU]
- Pourquoi : [CONTEXTE / ENJEU]

Structure attendue :
1. Titre accrocheur + sous-titre factuel
2. Chapô (réponse aux 5W en 2-3 lignes)
3. Corps du communiqué (développement + citation)
4. Boilerplate ABC Salles (à propos)
5. Contact presse

Format : 400-500 mots maximum.`,
        tip: 'La structure "pyramide inversée" (info principale en premier) est le standard journalistique. Un journaliste pressé ne lit souvent que le chapô.',
      },
    ],
  },
  marketing: {
    id: 'marketing',
    title: 'Marketing',
    subtitle: 'Stratégies data-driven pour conquérir le marché',
    icon: Target,
    color: 'violet',
    description: 'Analysez votre marché, construisez vos personas et créez des campagnes publicitaires performantes. Ces agents transforment vos idées en plans d\'action.',
    agents: [
      {
        id: 'strat-guru',
        name: 'Stratège 360',
        badge: 'Stratégie',
        description: 'Votre consultant stratégie marketing. Analyses SWOT, études de marché, plans d\'action... Il structure votre réflexion et identifie les opportunités.',
        icon: Target,
        externalLink: 'https://chat.openai.com',
        color: 'violet',
      },
      {
        id: 'copy-ad',
        name: 'Copy Ad',
        badge: 'Publicité',
        description: 'Spécialiste des textes publicitaires. Google Ads, Facebook Ads, bannières... Il rédige des accroches qui cliquent et des descriptions qui convertissent.',
        icon: BarChart3,
        externalLink: 'https://chat.openai.com',
        color: 'blue',
      },
    ],
    prompts: [
      {
        id: 'prompt-marketing-1',
        agentId: 'strat-guru',
        title: 'Créer un persona client détaillé',
        objective: 'Persona',
        prompt: `Tu es un expert en marketing et connaissance client.

Crée une fiche persona détaillée pour ce profil type ABC Salles :
[PROFIL - ex: "Le DRH stressé qui organise sa première fête de Noël d'entreprise"]

La fiche doit inclure :

IDENTITÉ
- Prénom fictif, âge, poste, entreprise type
- Situation familiale, niveau de revenus

JOURNÉE TYPE
- Ses touchpoints avec la recherche de salle
- Ses moments de disponibilité

FRUSTRATIONS (Pain points)
- Ses 3 principales peurs/blocages
- Ce qui l'a déçu par le passé

MOTIVATIONS
- Ce qu'il veut vraiment accomplir (au-delà de l'événement)
- Comment il veut être perçu

OBJECTIONS D'ACHAT
- Ce qui pourrait le freiner
- Ses critères de décision

CITATION TYPE
- Une phrase qui résume son état d'esprit`,
        tip: 'La "citation type" humanise le persona. Affichez-la dans vos bureaux pour que toute l\'équipe garde le client en tête.',
      },
      {
        id: 'prompt-marketing-2',
        agentId: 'copy-ad',
        title: 'Rédiger des annonces Google Ads',
        objective: 'Créativité',
        prompt: `Tu es un expert Google Ads certifié.

Crée un set d'annonces responsive pour ce groupe d'annonces :
- Mot-clé principal : [MOT-CLÉ - ex: "salle séminaire Lyon"]
- Page de destination : [URL]
- Proposition de valeur : [AVANTAGE CLÉ]

Génère :
- 5 titres courts (max 30 caractères chacun)
- 5 titres longs (max 90 caractères chacun)
- 4 descriptions (max 90 caractères chacune)

Règles :
- Inclure le mot-clé dans au moins 3 titres
- Varier les angles (prix, qualité, urgence, social proof)
- Inclure des CTA variés
- Respecter STRICTEMENT les limites de caractères

Indique le nombre de caractères entre parenthèses.`,
        tip: 'Les annonces responsive Google Ads combinent automatiquement vos titres et descriptions. Varier les angles maximise les combinaisons performantes.',
      },
      {
        id: 'prompt-marketing-3',
        agentId: 'strat-guru',
        title: 'Analyse SWOT rapide',
        objective: 'Structure',
        prompt: `Tu es un consultant en stratégie marketing.

Réalise une analyse SWOT pour :
- Sujet : [SALLE / SERVICE / OFFRE à analyser]
- Contexte marché : [ZONE GÉOGRAPHIQUE, CONCURRENCE]

Pour chaque quadrant, donne :
- 4-5 points précis et actionnables
- Une priorité (Haute/Moyenne/Basse)

FORCES (internes, positives)
FAIBLESSES (internes, négatives)
OPPORTUNITÉS (externes, positives)
MENACES (externes, négatives)

Termine par :
- 3 actions prioritaires à court terme
- 1 recommandation stratégique globale`,
        tip: 'Ajouter les priorités (H/M/B) transforme une analyse statique en plan d\'action. Sans priorisation, une SWOT reste un exercice théorique.',
      },
    ],
  },
  creation: {
    id: 'creation',
    title: 'Création Visuelle',
    subtitle: 'Donnez vie à vos idées avec l\'IA générative',
    icon: Palette,
    color: 'orange',
    description: 'Créez des visuels impactants sans compétences techniques. Ces agents vous guident dans la création de prompts pour les IA d\'image (Midjourney, DALL-E...).',
    agents: [
      {
        id: 'visual-ai',
        name: 'Visual AI',
        badge: 'Génération d\'images',
        description: 'Créez des visuels uniques en quelques secondes. Bannières, illustrations d\'ambiance, mises en situation... Il traduit vos idées en prompts optimisés.',
        icon: ImagePlus,
        externalLink: 'https://chat.openai.com',
        color: 'orange',
      },
      {
        id: 'brand-keeper',
        name: 'Brand Keeper',
        badge: 'Charte graphique',
        description: 'Gardien de votre identité visuelle. Il s\'assure que chaque création respecte la charte ABC Salles et propose des déclinaisons cohérentes.',
        icon: Palette,
        externalLink: 'https://chat.openai.com',
        color: 'amber',
      },
    ],
    prompts: [
      {
        id: 'prompt-creation-1',
        agentId: 'visual-ai',
        title: 'Créer un prompt pour bannière web',
        objective: 'Créativité',
        prompt: `Tu es un expert en IA générative (Midjourney, DALL-E).

Génère un prompt optimisé pour créer une bannière web avec ces specs :
- Sujet : [THÈME - ex: "Mariage champêtre élégant"]
- Format : [DIMENSIONS - ex: 1920x600]
- Style : [MODERNE / ROMANTIQUE / CORPORATE / MINIMALISTE]
- Couleurs dominantes : [PALETTE]
- Éléments à inclure : [ÉLÉMENTS VISUELS SOUHAITÉS]
- Éléments à éviter : [PERSONNES / TEXTE / etc.]

Le prompt doit être :
- En anglais (meilleurs résultats)
- Précis sur le style artistique et l'éclairage
- Inclure les paramètres techniques (--ar pour aspect ratio)

Fournis également :
- 2 variations du prompt
- Les paramètres Midjourney recommandés`,
        tip: 'Les prompts en anglais donnent systématiquement de meilleurs résultats. Les paramètres comme --ar (aspect ratio) et --v (version) affinent considérablement le rendu.',
      },
      {
        id: 'prompt-creation-2',
        agentId: 'visual-ai',
        title: 'Décliner un visuel multi-formats',
        objective: 'Structure',
        prompt: `Tu es un directeur artistique digital.

À partir de ce concept visuel :
[DESCRIPTION DU VISUEL ORIGINAL]

Génère les prompts pour décliner sur :
1. Story Instagram (9:16 - 1080x1920)
2. Post carré Instagram (1:1 - 1080x1080)
3. Bannière LinkedIn (1.91:1 - 1200x627)
4. Header email (3:1 - 600x200)
5. Miniature YouTube (16:9 - 1280x720)

Pour chaque format, adapte :
- La composition (éléments centrés ou décalés)
- Le niveau de détail visible
- L'espace pour le texte overlay

Assure la cohérence visuelle entre tous les formats.`,
        tip: 'Penser en "système de déclinaison" plutôt qu\'en visuels isolés crée une identité cohérente et fait gagner énormément de temps sur le long terme.',
      },
      {
        id: 'prompt-creation-3',
        agentId: 'visual-ai',
        title: 'Brief créatif pour shooting photo',
        objective: 'Structure',
        prompt: `Tu es un directeur artistique événementiel.

Crée un brief créatif complet pour un shooting photo :
- Lieu : [NOM DE LA SALLE]
- Objectif : [SITE WEB / RÉSEAUX / BROCHURE]
- Style souhaité : [AMBIANCE RECHERCHÉE]

Le brief doit inclure :

1. CONCEPT CRÉATIF
- Direction artistique globale
- Mood / Atmosphère recherchée
- Références visuelles (décrire 2-3 images inspirantes)

2. LISTE DE PRISES DE VUE
- Plans larges (lesquels, pourquoi)
- Plans détails (lesquels, pourquoi)
- Mises en situation (avec/sans figurants)

3. CONTRAINTES TECHNIQUES
- Moments de la journée (lumière)
- Matériel recommandé
- Points d'attention

4. CHECKLIST LOGISTIQUE
- Accessoires à prévoir
- Préparation du lieu`,
        tip: 'Un brief visuel détaillé évite les allers-retours avec le photographe et garantit des photos utilisables pour toutes vos communications.',
      },
    ],
  },
};

export const navigation = [
  { id: 'home', label: 'Accueil', icon: 'Home', path: '/' },
  { id: 'redaction', label: 'Pôle Rédaction', icon: 'PenTool', path: '/redaction' },
  { id: 'commercial', label: 'Pôle Commercial', icon: 'Briefcase', path: '/commercial' },
  { id: 'communication', label: 'Communication', icon: 'Megaphone', path: '/communication' },
  { id: 'marketing', label: 'Marketing', icon: 'Target', path: '/marketing' },
  { id: 'creation', label: 'Création Visuelle', icon: 'Palette', path: '/creation' },
];

export const quickLinks = [
  {
    id: 'redaction',
    title: 'Pôle Rédaction',
    description: 'Contenus prêts pour le CRM : Guides, Tops, Actus',
    icon: PenTool,
    path: '/redaction',
    color: 'indigo',
    agentCount: 3,
    promptCount: 3,
  },
  {
    id: 'commercial',
    title: 'Pôle Commercial',
    description: 'Cold email, objections prix, relances',
    icon: Handshake,
    path: '/commercial',
    color: 'emerald',
    agentCount: 3,
    promptCount: 3,
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'Réseaux sociaux, RP, e-réputation',
    icon: Megaphone,
    path: '/communication',
    color: 'rose',
    agentCount: 3,
    promptCount: 4,
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Personas, Google Ads, stratégie',
    icon: Target,
    path: '/marketing',
    color: 'violet',
    agentCount: 2,
    promptCount: 3,
  },
  {
    id: 'creation',
    title: 'Création Visuelle',
    description: 'Prompts IA, briefs photo, déclinaisons',
    icon: Palette,
    path: '/creation',
    color: 'orange',
    agentCount: 2,
    promptCount: 3,
  },
];
