import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.join(__dirname, '../../../sample_data/cvs');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

export function generateSaraFrontendCV(outputPath) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Header
  doc.fontSize(22).font('Helvetica-Bold').text('Sara Mansouri', { align: 'center' });
  doc.fontSize(12).font('Helvetica').fillColor('#4B5563').text('Junior Full Stack & Frontend Developer', { align: 'center' });
  doc.fontSize(9).text('sara.mansouri@example.com | +33 6 12 34 56 78 | Paris, France | github.com/sara-dev', { align: 'center' });
  doc.moveDown(1.5);

  // Summary
  doc.fillColor('#1E3A8A').fontSize(14).font('Helvetica-Bold').text('Professional Summary');
  doc.rect(50, doc.y, 495, 1).fill('#CBD5E1');
  doc.moveDown(0.5);
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica').text(
    'Passionate and dedicated Junior Full Stack Developer with specialized expertise in React, Next.js, TypeScript, and Express.js. ' +
    'Demonstrated track record of building performant, responsive web applications and integrating RESTful APIs. ' +
    'Eager to contribute strong problem-solving skills and clean code practices to an innovative frontend engineering team.'
  );
  doc.moveDown(1);

  // Technical Skills
  doc.fillColor('#1E3A8A').fontSize(14).font('Helvetica-Bold').text('Technical Skills');
  doc.rect(50, doc.y, 495, 1).fill('#CBD5E1');
  doc.moveDown(0.5);
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica-Bold').text('Frontend: ', { continued: true });
  doc.font('Helvetica').text('React 18, Next.js 14, TypeScript, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, Redux Toolkit');
  doc.font('Helvetica-Bold').text('Backend & APIs: ', { continued: true });
  doc.font('Helvetica').text('Node.js, Express.js, REST APIs, JSON Web Tokens (JWT), basic MongoDB');
  doc.font('Helvetica-Bold').text('Tools & Practices: ', { continued: true });
  doc.font('Helvetica').text('Git, GitHub, VS Code, Agile/Scrum, Vite, Postman, Jest');
  doc.moveDown(1);

  // Projects
  doc.fillColor('#1E3A8A').fontSize(14).font('Helvetica-Bold').text('Key Projects');
  doc.rect(50, doc.y, 495, 1).fill('#CBD5E1');
  doc.moveDown(0.5);

  doc.fillColor('#1F2937').fontSize(11).font('Helvetica-Bold').text('DevConnect - Collaborative Developer Network');
  doc.fontSize(9).fillColor('#6B7280').text('Next.js, TypeScript, Tailwind CSS, Express.js, REST API | 2024');
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica').text(
    '• Built a responsive web platform allowing developers to share project portfolios and discover teammates.\n' +
    '• Architected frontend with Next.js App Router and TypeScript, achieving high Lighthouse performance scores.\n' +
    '• Integrated secure RESTful API endpoints built with Express.js and JWT authentication.'
  );
  doc.moveDown(0.8);

  doc.fillColor('#1F2937').fontSize(11).font('Helvetica-Bold').text('TaskFlow - Real-time Kanban Workspace');
  doc.fontSize(9).fillColor('#6B7280').text('React, TypeScript, Redux Toolkit, Node.js | 2023 - 2024');
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica').text(
    '• Developed an intuitive drag-and-drop task management interface using React and custom hooks.\n' +
    '• Implemented state management using Redux Toolkit to maintain seamless offline-first capability.\n' +
    '• Wrote unit tests for components using Jest and React Testing Library.'
  );
  doc.moveDown(1);

  // Education
  doc.fillColor('#1E3A8A').fontSize(14).font('Helvetica-Bold').text('Education & Certifications');
  doc.rect(50, doc.y, 495, 1).fill('#CBD5E1');
  doc.moveDown(0.5);
  doc.fillColor('#1F2937').fontSize(11).font('Helvetica-Bold').text('Bachelor of Science in Computer Science');
  doc.fontSize(9).fillColor('#6B7280').text('University of Paris-Saclay | 2021 - 2024');
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica').text('Relevant Coursework: Web Architecture, Software Engineering, Algorithms, Database Systems.');
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica-Bold').text('Meta Frontend Developer Professional Certificate', { continued: true });
  doc.font('Helvetica').text(' - Coursera (2024)');

  doc.end();
  return new Promise((resolve) => writeStream.on('finish', resolve));
}

export function generateSaraBackendCV(outputPath) {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Header
  doc.fontSize(22).font('Helvetica-Bold').text('Sara Mansouri', { align: 'center' });
  doc.fontSize(12).font('Helvetica').fillColor('#4B5563').text('Backend & Node.js Developer', { align: 'center' });
  doc.fontSize(9).text('sara.mansouri@example.com | +33 6 12 34 56 78 | Paris, France | github.com/sara-dev', { align: 'center' });
  doc.moveDown(1.5);

  // Summary
  doc.fillColor('#065F46').fontSize(14).font('Helvetica-Bold').text('Professional Summary');
  doc.rect(50, doc.y, 495, 1).fill('#CBD5E1');
  doc.moveDown(0.5);
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica').text(
    'Junior Backend Developer with strong foundations in Node.js, Express.js, MongoDB, and REST API engineering. ' +
    'Passionate about API design, authentication systems, data modeling with Mongoose, and server optimization. ' +
    'Experienced in testing with Mocha/Jest and containerized workflows with Docker.'
  );
  doc.moveDown(1);

  // Technical Skills
  doc.fillColor('#065F46').fontSize(14).font('Helvetica-Bold').text('Backend Technical Skills');
  doc.rect(50, doc.y, 495, 1).fill('#CBD5E1');
  doc.moveDown(0.5);
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica-Bold').text('Languages & Frameworks: ', { continued: true });
  doc.font('Helvetica').text('Node.js, Express.js, JavaScript (ES6+), TypeScript, Python basics');
  doc.font('Helvetica-Bold').text('Databases: ', { continued: true });
  doc.font('Helvetica').text('MongoDB, Mongoose ODM, Redis caching basics, PostgreSQL fundamentals');
  doc.font('Helvetica-Bold').text('Architecture & Security: ', { continued: true });
  doc.font('Helvetica').text('RESTful API Design, JWT, OAuth 2.0 basics, Helmet, CORS, Rate Limiting');
  doc.font('Helvetica-Bold').text('DevOps & Tools: ', { continued: true });
  doc.font('Helvetica').text('Docker, Git, GitHub Actions CI/CD, Postman, Linux CLI');
  doc.moveDown(1);

  // Projects
  doc.fillColor('#065F46').fontSize(14).font('Helvetica-Bold').text('Backend Projects');
  doc.rect(50, doc.y, 495, 1).fill('#CBD5E1');
  doc.moveDown(0.5);

  doc.fillColor('#1F2937').fontSize(11).font('Helvetica-Bold').text('E-Commerce RESTful Microservices API');
  doc.fontSize(9).fillColor('#6B7280').text('Node.js, Express.js, MongoDB, Docker | 2024');
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica').text(
    '• Designed modular REST API handling user auth, product catalogs, and order workflows.\n' +
    '• Implemented indexing and aggregation pipelines in MongoDB, reducing query latency by 35%.\n' +
    '• Containerized the application using Docker and configured CI pipeline with GitHub Actions.'
  );
  doc.moveDown(0.8);

  doc.fillColor('#1F2937').fontSize(11).font('Helvetica-Bold').text('Secure Authentication & File Vault');
  doc.fontSize(9).fillColor('#6B7280').text('Node.js, Express, JWT, Multer, bcrypt | 2023');
  doc.fillColor('#1F2937').fontSize(10).font('Helvetica').text(
    '• Created an encrypted document repository with role-based access control and JWT token refresh.\n' +
    '• Implemented rigorous file validation, MIME verification, and virus scanning stubs.'
  );
  doc.moveDown(1);

  // Education
  doc.fillColor('#065F46').fontSize(14).font('Helvetica-Bold').text('Education');
  doc.rect(50, doc.y, 495, 1).fill('#CBD5E1');
  doc.moveDown(0.5);
  doc.fillColor('#1F2937').fontSize(11).font('Helvetica-Bold').text('Bachelor of Science in Computer Science');
  doc.fontSize(9).fillColor('#6B7280').text('University of Paris-Saclay | 2021 - 2024');

  doc.end();
  return new Promise((resolve) => writeStream.on('finish', resolve));
}

async function run() {
  const frontendPdfPath = path.join(targetDir, 'Sara_Frontend_Developer_CV.pdf');
  const backendPdfPath = path.join(targetDir, 'Sara_Backend_Developer_CV.pdf');

  console.log(`Generating: ${frontendPdfPath}`);
  await generateSaraFrontendCV(frontendPdfPath);

  console.log(`Generating: ${backendPdfPath}`);
  await generateSaraBackendCV(backendPdfPath);

  console.log('Sample CV PDFs generated successfully!');
}

run();
