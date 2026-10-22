import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, '../../../CareerTech_Guide_Complet.pdf');

class GuidePDFBuilder {
  constructor(filePath) {
    this.filePath = filePath;
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 45,
      bufferPages: true,
      autoFirstPage: false,
    });
    this.stream = fs.createWriteStream(filePath);
    this.doc.pipe(this.stream);

    // Color Palette
    this.primary = '#4338CA'; // Indigo 700
    this.primaryDark = '#312E81'; // Indigo 900
    this.primaryLight = '#EEF2FF'; // Indigo 50
    this.secondary = '#0D9488'; // Teal 600
    this.dark = '#0F172A'; // Slate 900
    this.body = '#334155'; // Slate 700
    this.muted = '#64748B'; // Slate 500
    this.lightBg = '#F8FAFC'; // Slate 50
    this.border = '#E2E8F0'; // Slate 200
    this.emerald = '#059669'; // Emerald 600
    this.amber = '#D97706'; // Amber 600
  }

  addCoverPage() {
    this.doc.addPage();
    const { doc } = this;

    // Top decorative bar
    doc.rect(0, 0, 595, 14).fill(this.primary);

    // Header badge
    doc.moveDown(4);
    doc.fillColor(this.primary).fontSize(11).font('Helvetica-Bold')
      .text('MERN STACK EDITION  •  NODE.JS 24  •  REACT 18  •  MONGODB', 45, 75, { align: 'center', characterSpacing: 1 });

    doc.moveDown(2);
    // Main Title
    doc.fillColor(this.primaryDark).fontSize(34).font('Helvetica-Bold')
      .text('CareerTech', { align: 'center' });

    doc.moveDown(0.5);
    doc.fillColor(this.dark).fontSize(16).font('Helvetica')
      .text('Guide Complet d\'Utilisation & d\'Administration', { align: 'center' });

    doc.moveDown(0.4);
    doc.fillColor(this.muted).fontSize(12).font('Helvetica-Oblique')
      .text('Plateforme Intelligente de Suivi de Candidatures & Analyse de CV par IA', { align: 'center' });

    // Decorative separator box
    doc.moveDown(2);
    const boxY = doc.y;
    doc.rect(45, boxY, 505, 125).fillAndStroke(this.primaryLight, '#C7D2FE');

    doc.fillColor(this.primaryDark).fontSize(13).font('Helvetica-Bold')
      .text('A PROPOS DE CE GUIDE', 65, boxY + 18);

    doc.fillColor(this.body).fontSize(9.5).font('Helvetica')
      .text(
        'Ce document officiel détaille l\'ensemble des processus pour installer, configurer, administrer et exploiter la solution CareerTech. Il rassemble à la fois les instructions techniques pour les développeurs/évaluateurs et le manuel pas-à-pas pour les utilisateurs en recherche d\'emploi active.',
        65,
        boxY + 38,
        { width: 465, lineGap: 3 }
      );

    doc.moveDown(5);

    // Summary metadata grid
    const metaY = boxY + 155;
    doc.rect(45, metaY, 245, 135).fillAndStroke(this.lightBg, this.border);
    doc.rect(305, metaY, 245, 135).fillAndStroke(this.lightBg, this.border);

    // Left box: Tech specs
    doc.fillColor(this.dark).fontSize(11).font('Helvetica-Bold').text('Spécifications Techniques', 60, metaY + 15);
    doc.fillColor(this.body).fontSize(9).font('Helvetica')
      .text('• Frontend : React 18, Vite, Tailwind CSS', 60, metaY + 38)
      .text('• Backend : Express.js, Node.js v24.15', 60, metaY + 54)
      .text('• Base de données : MongoDB 9.0 & Mongoose', 60, metaY + 70)
      .text('• Traitement PDF : pdf-parse & pdfkit', 60, metaY + 86)
      .text('• Moteur IA : Gemini, OpenAI & NLP Heuristique', 60, metaY + 102);

    // Right box: Quick Demo credentials
    doc.fillColor(this.dark).fontSize(11).font('Helvetica-Bold').text('Accès Démonstration Rapide', 320, metaY + 15);
    doc.fillColor(this.body).fontSize(9).font('Helvetica')
      .text('• URL Frontend : http://127.0.0.1:5173', 320, metaY + 38)
      .text('• URL Backend API : http://localhost:5000', 320, metaY + 54)
      .text('• Compte Démo : sara@example.com', 320, metaY + 70)
      .text('• Mot de passe : Password123!', 320, metaY + 86)
      .text('• Scénario PDF : Validé de bout en bout', 320, metaY + 102);

    // Bottom copyright / info
    doc.fillColor(this.muted).fontSize(9).font('Helvetica')
      .text('CareerTech • Édition MERN Stack • Version 1.0.0 • Octobre 2026', 45, 750, { align: 'center' });
  }

  addTableOfContents() {
    this.doc.addPage();
    const { doc } = this;
    this.addPageHeader('Table des Matières');

    doc.fillColor(this.dark).fontSize(20).font('Helvetica-Bold').text('Sommaire du Guide', 45, 75);
    doc.rect(45, 102, 505, 1.5).fill(this.primary);

    const chapters = [
      { num: '1', title: 'Présentation Générale & Architecture MERN', page: '3', desc: 'Objectifs, principes directeurs, arborescence et rôles du système' },
      { num: '2', title: 'Installation, Configuration & Démarrage', page: '4', desc: 'Prérequis, commandes d\'installation, fichier .env et base de données' },
      { num: '3', title: 'Peuplement de Démonstration (Scénario Sara)', page: '5', desc: 'Génération des CVs PDF, création des offres et jeu de test initial' },
      { num: '4', title: 'Guide Utilisateur : Gestion du CV & Candidatures', page: '6', desc: 'Téléversement, extraction de texte, suivi des statuts, Kanban et notes' },
      { num: '5', title: 'Guide Utilisateur : Analyse de CV par IA', page: '7', desc: 'Choix du CV, soumission de poste, structure du rapport et score' },
      { num: '6', title: 'Historique, Export PDF & Suivi Temporel', page: '8', desc: 'Consultation hors-ligne, réouverture de rapports et téléchargement PDF' },
      { num: '7', title: 'Configuration des Moteurs IA (Gemini, OpenAI, NLP)', page: '9', desc: 'Clés API, variables d\'environnement et fonctionnement hors-ligne' },
      { num: '8', title: 'Déploiement en Production (Cloud)', page: '10', desc: 'Instructions pour Vercel, Render, Railway et MongoDB Atlas' },
      { num: '9', title: 'Résolution de Problèmes & FAQ Technique', page: '11', desc: 'Erreurs fréquentes, ports occupés, documents scannés et checklist' },
    ];

    let currentY = 120;
    chapters.forEach((c) => {
      // Circle number
      doc.circle(60, currentY + 12, 11).fill(this.primaryLight);
      doc.fillColor(this.primary).fontSize(10).font('Helvetica-Bold').text(c.num, 54, currentY + 7);

      // Title & page
      doc.fillColor(this.dark).fontSize(11).font('Helvetica-Bold').text(c.title, 80, currentY + 3);
      doc.fillColor(this.primary).fontSize(11).font('Helvetica-Bold').text(`Page ${c.page}`, 480, currentY + 3, { align: 'right' });

      // Description
      doc.fillColor(this.muted).fontSize(8.5).font('Helvetica').text(c.desc, 80, currentY + 18);

      // dotted separator line
      doc.strokeColor(this.border).lineWidth(0.5).moveTo(45, currentY + 36).lineTo(550, currentY + 36).stroke();
      currentY += 46;
    });
  }

  addPageHeader(title) {
    const { doc } = this;
    doc.fillColor(this.muted).fontSize(8).font('Helvetica').text('CAREERTECH — GUIDE COMPLET D\'UTILISATION & GESTION', 45, 25);
    doc.fillColor(this.primary).fontSize(8).font('Helvetica-Bold').text(title, 45, 25, { align: 'right' });
    doc.strokeColor(this.border).lineWidth(0.5).moveTo(45, 38).lineTo(550, 38).stroke();
  }

  addChapterTitle(num, title) {
    const { doc } = this;
    doc.moveDown(1.5);
    const startY = doc.y;
    doc.fillColor(this.primary).fontSize(10).font('Helvetica-Bold')
      .text(`CHAPITRE ${num}`, 45, startY);
    doc.fillColor(this.dark).fontSize(18).font('Helvetica-Bold')
      .text(title, 45, startY + 14);
    doc.rect(45, startY + 38, 505, 1.5).fill(this.primary);
    doc.y = startY + 48;
  }

  addSection(title) {
    const { doc } = this;
    this.checkPageBreak(50);
    doc.moveDown(0.8);
    doc.fillColor(this.primaryDark).fontSize(12).font('Helvetica-Bold').text(title);
    doc.moveDown(0.3);
  }

  addParagraph(text) {
    const { doc } = this;
    this.checkPageBreak(40);
    doc.fillColor(this.body).fontSize(9.5).font('Helvetica').text(text, { align: 'justify', lineGap: 2.5 });
    doc.moveDown(0.5);
  }

  addBullet(boldPrefix, text) {
    const { doc } = this;
    this.checkPageBreak(25);
    doc.fillColor(this.primary).fontSize(10).font('Helvetica-Bold').text('• ', { continued: true });
    doc.fillColor(this.dark).fontSize(9.5).font('Helvetica-Bold').text(boldPrefix + ' ', { continued: true });
    doc.fillColor(this.body).fontSize(9.5).font('Helvetica').text(text, { lineGap: 2 });
    doc.moveDown(0.2);
  }

  addCodeBlock(code) {
    const { doc } = this;
    this.checkPageBreak(60);
    const lines = code.split('\n');
    const height = lines.length * 12 + 16;
    const y = doc.y;

    doc.rect(45, y, 505, height).fillAndStroke('#1E293B', '#334155');
    doc.fillColor('#38BDF8').fontSize(8.5).font('Courier-Bold')
      .text(code, 55, y + 8, { lineGap: 2 });
    doc.y = y + height + 10;
  }

  addCallout(title, text, type = 'info') {
    const { doc } = this;
    this.checkPageBreak(65);
    const colors = {
      info: { bg: '#EEF2FF', stroke: '#C7D2FE', title: '#3730A3', tag: '[NOTE]' },
      success: { bg: '#ECFDF5', stroke: '#A7F3D0', title: '#065F46', tag: '[SUCCES]' },
      warning: { bg: '#FFFBEB', stroke: '#FDE68A', title: '#92400E', tag: '[ATTENTION]' },
    };
    const c = colors[type] || colors.info;
    const y = doc.y;

    doc.rect(45, y, 505, 52).fillAndStroke(c.bg, c.stroke);
    doc.fillColor(c.title).fontSize(9.5).font('Helvetica-Bold').text(`${c.tag}  ${title}`, 55, y + 8);
    doc.fillColor(this.body).fontSize(8.5).font('Helvetica').text(text, 55, y + 24, { width: 485, lineGap: 1.5 });
    doc.y = y + 60;
  }

  checkPageBreak(neededSpace = 80) {
    if (this.doc.y + neededSpace > 740) {
      this.doc.addPage();
      this.addPageHeader('Guide d\'Utilisation & Gestion');
      this.doc.y = 55;
    }
  }

  build() {
    this.addCoverPage();
    this.addTableOfContents();

    // -------------------------------------------------------------------
    // CHAPITRE 1 : Présentation Générale
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 1 : Présentation Générale');
    this.addChapterTitle('1', 'Présentation Générale & Architecture MERN');

    this.addParagraph(
      'CareerTech est une plateforme web moderne et intuitive conçue pour répondre à un défi majeur rencontré par les candidats : la gestion dispersée des opportunités d\'emploi et la difficulté d\'adapter efficacement leur CV aux fiches de poste sans inventer d\'expérience.'
    );

    this.addCallout(
      'Philosophie Candidat Unique',
      'CareerTech est un assistant personnel destiné au chercheur d\'emploi et non une plateforme de recrutement d\'entreprise. Aucun profil recruteur, candidature automatisée externe ou interfaçage avec des job boards tiers n\'est nécessaire.',
      'info'
    );

    this.addSection('1.1 Les Trois Piliers Fondamentaux');
    this.addBullet('Organisation Centralisée :', 'Suivi structuré des opportunités avec statuts précis (Saved, Applied, Interview, Offer, Rejected), notes d\'échanges et rappels d\'entretiens.');
    this.addBullet('Visibilité & Statistiques :', 'Tableau de bord dynamique calculant en temps réel les taux d\'avancement, la répartition du pipeline et l\'activité mensuelle.');
    this.addBullet('Analyse IA Éthique & Structurée :', 'Évaluation impartiale comparant le texte réel du CV à une offre, extrayant les preuves concrètes et suggérant des formulations percutantes sans aucune hallucination.');

    this.addSection('1.2 Architecture Technique du Projet');
    this.addParagraph(
      'L\'application repose rigoureusement sur la pile MERN (MongoDB, Express.js, React.js, Node.js) :'
    );
    this.addBullet('MongoDB & Mongoose :', 'Modélisation flexible des utilisateurs, offres d\'emploi et rapports historiques JSON complets.');
    this.addBullet('Express.js & Node.js 24 :', 'API RESTful sécurisée par JWT, middleware d\'upload Multer, parsing PDF et orchestration d\'IA.');
    this.addBullet('React 18 & Vite :', 'Interface Single Page Application (SPA) réactive, stylisée avec Tailwind CSS et icônes Lucide.');
    this.addBullet('Traitement PDF :', 'pdf-parse pour l\'extraction textuelle côté serveur et pdfkit pour la génération des rapports téléchargeables.');

    // -------------------------------------------------------------------
    // CHAPITRE 2 : Installation & Démarrage
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 2 : Installation & Démarrage');
    this.addChapterTitle('2', 'Installation, Configuration & Démarrage');

    this.addParagraph(
      'CareerTech a été structuré pour permettre une mise en route simple et rapide en environnement local ou conteneurisé.'
    );

    this.addSection('2.1 Prérequis Système');
    this.addBullet('Node.js :', 'Version 18.0 ou supérieure (recommandé : Node.js 24.x LTS).');
    this.addBullet('Gestionnaire npm :', 'Version 9.0 ou supérieure (inclus avec Node.js).');
    this.addBullet('MongoDB :', 'Instance locale sur le port par défaut 27017, ou une URL MongoDB Atlas.');

    this.addSection('2.2 Configuration des Variables d\'Environnement (.env)');
    this.addParagraph(
      'Le backend dispose d\'un fichier de configuration prêt à l\'emploi dans "backend/.env" :'
    );
    this.addCodeBlock(
`# Configuration Backend (backend/.env)
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careertech
JWT_SECRET=careertech_super_secret_jwt_key_2026_dev
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# Fournisseur d'IA : gemini | openai | heuristic
AI_PROVIDER=gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash`
    );

    this.addCallout(
      'Fonctionnement Autonome Sans Clé Externe',
      'Si aucune clé API Gemini ou OpenAI n\'est renseignée, le système bascule automatiquement sur l\'analyseur sémantique heuristique/NLP intégré. L\'application fonctionne donc immédiatement à 100% hors-ligne !',
      'success'
    );

    this.addSection('2.3 Commandes de Démarrage');
    this.addParagraph('Depuis la racine du projet, vous pouvez démarrer l\'ensemble des services :');
    this.addCodeBlock(
`# Démarrer le backend Express (Port 5000)
npm run dev:backend

# Démarrer le frontend React Vite (Port 5173)
npm run dev:frontend

# Ou compiler le frontend pour la production
npm run build:frontend`
    );

    // -------------------------------------------------------------------
    // CHAPITRE 3 : Jeu de Données de Démonstration (Scénario Sara)
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 3 : Jeu de Test Démo');
    this.addChapterTitle('3', 'Peuplement de Démonstration (Scénario Sara)');

    this.addParagraph(
      'Conformément au scénario du cahier des charges (page 12), un script automatisé génère des faux CVs PDF de qualité professionnelle et peuple la base de données avec des cas réalistes.'
    );

    this.addSection('3.1 Lancer le Seeder Automatique');
    this.addCodeBlock(
`# Exécuter depuis la racine ou dans le dossier backend/
npm run seed`
    );

    this.addParagraph(
      'Cette commande réalise automatiquement les actions suivantes :'
    );
    this.addBullet('Génération des PDF :', 'Crée Sara_Frontend_Developer_CV.pdf et Sara_Backend_Developer_CV.pdf dans sample_data/cvs/.');
    this.addBullet('Compte Sara Mansouri :', 'Crée l\'utilisatrice avec son CV principal complet et extrait 1843 caractères de texte.');
    this.addBullet('5 Opportunités Réalistes :', 'Frontend Developer (Interview chez Veloce), Full Stack (Applied chez NovaLabs), React Engineer (Saved chez Starlight), Web Dev (Offer chez Apex), Angular Dev (Rejected chez DataPulse).');
    this.addBullet('Rapport d\'Analyse Pré-généré :', 'Une évaluation complète pré-enregistrée dans l\'historique avec score de 88/100.');

    this.addSection('3.2 Identifiants du Compte Démo');
    this.addCallout(
      'Connexion Rapide Démo',
      'Email : sara@example.com   |   Mot de passe : Password123!\nAstuce : Sur la page de connexion, cliquez sur le bouton "Auto-fill" pour vous connecter en 1 clic.',
      'info'
    );

    // -------------------------------------------------------------------
    // CHAPITRE 4 : Guide Utilisateur - CV & Candidatures
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 4 : CV & Candidatures');
    this.addChapterTitle('4', 'Guide Utilisateur : Gestion du CV & Candidatures');

    this.addSection('4.1 Gestion du CV Principal (Page "CV Management")');
    this.addParagraph(
      'Chaque utilisateur dispose d\'un espace dédié pour maintenir son CV de référence :'
    );
    this.addBullet('Téléversement sécurisé :', 'Glissez-déposez votre CV au format .pdf (limite de 10 Mo).');
    this.addBullet('Validation intelligente :', 'Le système inspecte le fichier pour vérifier qu\'il contient bien une couche de texte sélectionnable (alerte si le PDF est un scan pur sans texte).');
    this.addBullet('Inspection du texte extrait :', 'Bouton "Inspect Text" pour visualiser le texte brut indexé par le moteur d\'IA.');
    this.addBullet('Remplacement transparent :', 'Vous pouvez téléverser une nouvelle version de votre CV à tout moment sans supprimer vos anciens rapports d\'analyse.');

    this.addSection('4.2 Suivi des Opportunités (Page "Job Tracker")');
    this.addParagraph(
      'Le tableau de suivi permet d\'organiser toutes vos démarches professionnelles :'
    );
    this.addBullet('Ajout d\'opportunité :', 'Renseignez l\'intitulé, l\'entreprise, le descriptif du poste, le lien direct, le salaire et le lieu.');
    this.addBullet('5 Statuts de suivi :', 'Saved (intéressé), Applied (postulé), Interview (entretien), Offer (offre reçue), Rejected (refus).');
    this.addBullet('Double Affichage :', 'Basculez à tout moment entre la vue Grille de cartes et la vue Tableau Kanban 5 colonnes.');
    this.addBullet('Planification :', 'Fixez une date d\'entretien ou une date de relance pour être alerté sur le tableau de bord.');
    this.addBullet('Journal d\'échanges :', 'Ajoutez des notes d\'interaction horodatées (ex: "Appel RH concluant, test technique jeudi").');

    // -------------------------------------------------------------------
    // CHAPITRE 5 : Guide Utilisateur - Analyse de CV par IA
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 5 : Analyse IA');
    this.addChapterTitle('5', 'Guide Utilisateur : Analyse de CV par IA');

    this.addParagraph(
      'La fonctionnalité d\'analyse par IA évalue l\'adéquation réelle entre votre CV et une offre d\'emploi ciblée, sans nécessiter d\'enregistrer préalablement l\'opportunité.'
    );

    this.addSection('5.1 Processus d\'Analyse en 3 Étapes');
    this.addBullet('Étape 1 - Sélection du CV :', 'Choisissez d\'utiliser votre "CV Principal" ou cochez "Upload Alternative CV" pour tester un CV spécialisé (ex: CV orienté backend) sans écraser votre profil principal.');
    this.addBullet('Étape 2 - Fiche de poste :', 'Collez la description et les exigences du poste (ou sélectionnez une offre déjà enregistrée dans la liste déroulante pour pré-remplir les champs).');
    this.addBullet('Étape 3 - Lancement :', 'Cliquez sur "Generate AI Assessment". Le backend extrait le texte, consulte le moteur d\'IA et valide le résultat selon un schéma strict.');

    this.addSection('5.2 Comprendre le Rapport d\'Évaluation Structuré');
    this.addParagraph(
      'Le rapport généré est structuré en 5 volets obligatoires et garantit une éthique rigoureuse :'
    );

    this.addBullet('1. Évaluation Globale :', 'Catégorie claire (Strong Match, Good Match, Partial Match, Low Match) étayée par un résumé circonstancié.');
    this.addBullet('2. Score d\'Alignement Explicable (0-100) :', 'Jauge visuelle accompagnée de la justification du barème (nombre de critères validés vs critères manquants).');
    this.addBullet('3. Qualifications Démontrées :', 'Liste chaque exigence avec citation exacte de la preuve textuelle identifiée dans votre CV.');
    this.addBullet('4. Exigences Non Confirmées :', 'Distingue clairement ce qui n\'apparaît pas dans le CV ("Unsupported") de ce qui est sous-entendu ou peu précis ("Unclear/Implicit"). L\'absence d\'une mention n\'est jamais considérée comme une incompétence.');
    this.addBullet('5. Expériences Pertinentes :', 'Met en lumière vos projets ou rôles passés les plus transférables pour ce poste.');
    this.addBullet('6. Suggestions Concrètes d\'Amélioration :', 'Conseils pratiques pour reformuler vos réalisations existantes, quantifier vos résultats et valoriser vos projets sans jamais inventer d\'expérience factice.');

    // -------------------------------------------------------------------
    // CHAPITRE 6 : Historique & Export PDF
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 6 : Historique & Export');
    this.addChapterTitle('6', 'Historique, Export PDF & Suivi Temporel');

    this.addSection('6.1 Préservation Historique Immuable');
    this.addParagraph(
      'Conformément aux exigences du projet, chaque rapport d\'analyse est conservé de manière autonome dans la collection AIAnalysis. Remplacer votre CV principal ou modifier une offre n\'altère en rien vos rapports passés.'
    );

    this.addSection('6.2 Consultation & Téléchargement');
    this.addBullet('Relecture instantanée :', 'Depuis la page "Analysis History", vous pouvez rouvrir n\'importe quel rapport antérieur en 1 clic sans avoir à ré-exécuter l\'IA.');
    this.addBullet('Traçabilité du CV utilisé :', 'Chaque rapport indique précisément le nom du document analysé et sa provenance (CV principal ou fichier alternatif).');
    this.addBullet('Export en document PDF :', 'Cliquez sur le bouton "Export as PDF" pour télécharger un document A4 officiel contenant l\'intégralité des sections, prêt à être archivé ou imprimé.');

    // -------------------------------------------------------------------
    // CHAPITRE 7 : Configuration des Moteurs IA
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 7 : Moteurs d\'IA');
    this.addChapterTitle('7', 'Configuration des Moteurs IA (Gemini, OpenAI, NLP)');

    this.addParagraph(
      'CareerTech embarque un gestionnaire d\'IA multi-fournisseurs hautement résilient qui garantit zéro échec de traitement :'
    );

    this.addSection('7.1 Utilisation de Google Gemini API (Recommandé)');
    this.addParagraph(
      'Google Gemini offre un quota gratuit généreux sans carte bancaire sur Google AI Studio :'
    );
    this.addBullet('1. Obtenir une clé :', 'Rendez-vous sur https://aistudio.google.com/ et cliquez sur "Get API key".');
    this.addBullet('2. Configurer dans .env :', 'Indiquez GEMINI_API_KEY=AIzaSy... et AI_PROVIDER=gemini.');
    this.addBullet('3. Modèle par défaut :', 'gemini-2.0-flash (très rapide et précis en mode JSON structuré).');

    this.addSection('7.2 Utilisation d\'OpenAI API');
    this.addParagraph('Si vous disposez d\'un compte OpenAI :');
    this.addBullet('1. Configurer dans .env :', 'Indiquez AI_PROVIDER=openai et OPENAI_API_KEY=sk-proj-...');
    this.addBullet('2. Modèle par défaut :', 'gpt-4o-mini.');

    this.addSection('7.3 Moteur Heuristique & NLP Intégré (Zéro Clé Requise)');
    this.addParagraph(
      'Si aucune clé externe n\'est configurée (ou en cas de panne réseau), le service bascule de manière transparente sur l\'algorithme d\'analyse heuristique intégré. Celui-ci analyse le vocabulaire technique, compare les compétences requises, calcule les correspondances et formule des recommandations étayées sans interruption.'
    );

    // -------------------------------------------------------------------
    // CHAPITRE 8 : Déploiement en Production
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 8 : Déploiement Cloud');
    this.addChapterTitle('8', 'Déploiement en Production (Cloud)');

    this.addParagraph(
      'La section 5.2 du cahier des charges préconise un déploiement gratuit et accessible en ligne :'
    );

    this.addSection('8.1 Base de Données : MongoDB Atlas');
    this.addBullet('Créer un cluster :', 'Créez un cluster gratuit M0 sur https://www.mongodb.com/cloud/atlas.');
    this.addBullet('Accès réseau :', 'Dans Network Access, autorisez les adresses IP (0.0.0.0/0).');
    this.addBullet('Chaîne de connexion :', 'Copiez l\'URI mongodb+srv://... dans la variable MONGODB_URI.');

    this.addSection('8.2 Backend : Render ou Railway');
    this.addBullet('Créer un Web Service :', 'Connectez votre dépôt GitHub et définissez le Root Directory sur "backend".');
    this.addBullet('Build Command :', 'npm install');
    this.addBullet('Start Command :', 'node src/server.js');
    this.addBullet('Variables d\'environnement :', 'Ajoutez MONGODB_URI, JWT_SECRET, CLIENT_URL, GEMINI_API_KEY.');

    this.addSection('8.3 Frontend : Vercel ou Netlify');
    this.addBullet('Créer un projet :', 'Connectez votre dépôt GitHub et définissez le Root Directory sur "frontend".');
    this.addBullet('Build Command :', 'npm run build');
    this.addBullet('Output Directory :', 'dist');

    // -------------------------------------------------------------------
    // CHAPITRE 9 : Résolution de Problèmes (FAQ)
    // -------------------------------------------------------------------
    this.doc.addPage();
    this.addPageHeader('Chapitre 9 : FAQ & Dépannage');
    this.addChapterTitle('9', 'Résolution de Problèmes & FAQ Technique');

    this.addSection('9.1 Problèmes Fréquents & Solutions');
    this.addBullet('Erreur "Failed to connect to MongoDB" :', 'Vérifiez que le service MongoDB local est bien démarré (Get-Service MongoDB sur Windows) ou vérifiez votre URI dans backend/.env.');
    this.addBullet('Erreur "Port 5000 is already in use" :', 'Un ancien processus Node tourne peut-être. Fermez-le ou modifiez la variable PORT dans backend/.env et le proxy dans frontend/vite.config.js.');
    this.addBullet('Erreur "PDF appears to be a scanned image" :', 'Votre PDF provient d\'une image ou d\'un scanner sans texte sélectionnable. Utilisez un PDF exporté depuis Word, Google Docs ou Canva avec du vrai texte.');
    this.addBullet('Déconnexion inattendue ou 401 Unauthorized :', 'Le token JWT a une durée de validité de 7 jours. Reconnectez-vous simplement via /login.');

    this.addSection('9.2 Aide-Mémoire des Commandes');
    this.addCodeBlock(
`# Réinitialiser la base et les CVs de test
npm run seed

# Démarrer le serveur backend
npm run dev:backend

# Démarrer le client frontend
npm run dev:frontend

# Vérifier la santé de l'API
curl http://localhost:5000/api/health`
    );

    // Number all pages dynamically
    const range = this.doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      this.doc.switchToPage(i);
      if (i > 0) { // skip cover page number
        this.doc.fillColor(this.muted).fontSize(8.5).font('Helvetica')
          .text(`Page ${i + 1} sur ${range.count}`, 45, 765, { align: 'right' });
        this.doc.fillColor(this.muted).fontSize(8.5).font('Helvetica')
          .text('CareerTech — Guide Officiel d\'Utilisation & d\'Administration', 45, 765, { align: 'left' });
      }
    }

    this.doc.end();

    return new Promise((resolve, reject) => {
      this.stream.on('finish', () => resolve(this.filePath));
      this.stream.on('error', reject);
    });
  }
}

async function run() {
  console.log(`Génération du Guide Complet PDF CareerTech : ${outputPath}`);
  const builder = new GuidePDFBuilder(outputPath);
  await builder.build();
  console.log(`Guide PDF régénéré avec succès (${fs.statSync(outputPath).size} octets) !`);
}

run();
