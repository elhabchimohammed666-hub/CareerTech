## License
   © 2026 Elhabchi Mohammed. All Rights Reserved.

# CareerTech 🚀
### AI-Powered Personal Job Application Tracker — MERN Stack Edition

![CareerTech](https://img.shields.io/badge/Stack-MERN-blueviolet)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20TailwindCSS-blue)
![Express](https://img.shields.io/badge/Backend-Express.js%20%2B%20Node.js%2024-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-brightgreen)
![AI](https://img.shields.io/badge/AI-Gemini%20%2F%20OpenAI%20%2F%20Heuristic%20NLP-purple)

---

## 📌 1. Project Overview

**CareerTech** is a comprehensive, personal job application management platform designed to help job seekers organize their opportunities, track application pipelines, and improve their CVs for specific positions using artificial intelligence.

Unlike generic recruitment or recruiter platforms, CareerTech is **exclusively focused on empowering the individual job seeker**:
- 🗂️ **Centralized Opportunity Tracking**: Manage opportunities from initial discovery (`Saved`), submission (`Applied`), interviews (`Interview`), job offers (`Offer`), to outcomes (`Rejected`).
- 📊 **Dynamic Personal Dashboard**: Real-time statistics, monthly application activity, conversion rates, and upcoming interview/follow-up reminders.
- 📄 **Private CV Workspace**: Secure PDF CV upload, automatic text extraction, and version replacement.
- 🤖 **AI-Powered CV Analysis**: Grounded assessment comparing CV credentials against any job description, identifying demonstrated qualifications, unconfirmed requirements, and actionable presentation suggestions without ever hallucinating qualifications.
- 📜 **Report History & PDF Export**: Reopen previous analyses without re-querying AI, or export them as clean PDF reports.

---

## 🏛️ 2. Architecture & Technology Stack

The project is built entirely on the **MERN** stack:

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Database** | **MongoDB** + **Mongoose ODM** | Stores users, job opportunities, note timelines, and structured AI reports |
| **Backend** | **Node.js** + **Express.js** | REST API, JWT auth, Multer file handling, PDF text extraction, AI orchestration |
| **Frontend** | **React 18** + **Vite** + **Tailwind CSS** | Responsive SPA, interactive pipeline board, gauges, Lucide icons |
| **Document Processing** | **pdf-parse** | Robust server-side PDF text extraction with empty/scanned document detection |
| **AI Integration** | **Google Gemini** / **OpenAI** / **NLP Engine** | Strict schema validation, grounded analysis, match scoring |
| **Export Engine** | **pdfkit** | On-the-fly generation of downloadable PDF evaluation reports |

---

## ✨ 3. Feature Breakdown

### 3.1 Must Have (Core Features)
- **Authentication & User Management**: Secure registration, login, JWT authentication, bcrypt password hashing, and complete data isolation between accounts.
- **Master CV Management**: Upload main CV in PDF format, inspect extracted text, replace with an updated version, or download the original file.
- **Job Opportunity & Application Tracking**: Create, view, edit, search, filter, and delete opportunities with custom notes and status stages (`Saved`, `Applied`, `Interview`, `Offer`, `Rejected`).
- **AI CV Analysis**:
  - 1-Click option: Use Main Profile CV or upload an alternative one-off PDF (without replacing the main CV).
  - Paste any target job description.
  - Grounded structured report:
    1. Overall Assessment (`Strong Match`, `Good Match`, `Partial Match`, `Low Match`).
    2. Matching Qualifications (with exact CV evidence quotes).
    3. Unconfirmed Requirements (distinguishing unsupported requirements vs implicit/unclear ones).
    4. Relevant Experience highlighted.
    5. Actionable improvement suggestions (without inventing qualifications).
- **AI Analysis History**: View all past analyses, reopen previous reports, inspect the CV used, and delete old reports.

### 3.2 Should Have (Recommended Features)
- **Explainable CV Match Score**: Numerical score (0 to 100) with a clear explanation of how the assessment was calculated.
- **Application Follow-Up & Interview Dates**: Record expected follow-up dates and scheduled interview dates, highlighted on cards and dashboard.
- **Advanced Filtering & Sorting**: Filter by status, search by company or title, sort by date added, submission date, or company name.
- **Activity Statistics**: Distribution graphs and monthly application counts.

### 3.3 Could Have (Bonus Enhancements)
- **Downloadable AI Reports**: Export any AI analysis report as an elegant PDF.
- **Section-by-Section Tailoring Recommendations**: Targeted guidance for Summary, Experience, and Skills sections.
- **Application Notes History**: Log timestamped interactions (interviews, recruiter emails, follow-ups).
- **Kanban Board & Grid Views**: Toggle between a card grid and a 5-column Kanban pipeline view.

---

## 🚀 4. Quick Start & Installation

### Prerequisites
- **Node.js** (v18.0 or higher, tested on v24.15)
- **npm** (v9+ or higher)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 4.1 Clone & Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd careertech2
```

### 4.2 Backend Installation & Configuration
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env
```

Configure `backend/.env` (optional API keys):

> **Note**: If you don't supply a Gemini or OpenAI API key, CareerTech will automatically use its built-in **Intelligent Semantic Heuristic NLP Analyzer**. The entire application works 100% out of the box with zero external dependencies!

### 4.3 Generate Sample CVs & Seed Database
Run the seeder to automatically generate fictional PDFs and populate Sara's demo scenario:
```bash
npm run seed
```
This command:
1. Generates `Sara_Frontend_Developer_CV.pdf` and `Sara_Backend_Developer_CV.pdf` in `sample_data/cvs/`.
2. Creates the demo user `sara@example.com` (password: `Password123!`).
3. Attaches Sara's master CV and extracts readable text.
4. Populates 5 realistic job opportunities with various statuses and interview dates.
5. Pre-generates a historical AI evaluation report.

### 4.4 Frontend Installation & Launch
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will start on **`http://localhost:5173`** with automated proxying to the backend API on port 5000.

---

## 🧪 5. Testing the End-to-End Demonstration Scenario

You can walk through the exact end-to-end scenario described on **Page 12 of the CareerTech specification**:

1. **Log In**:
   - Go to `http://localhost:5173/login`.
   - Click the **"Auto-fill"** button to load Sara's credentials (`sara@example.com` / `Password123!`) and click **Sign In**.
2. **Dashboard Overview**:
   - Review the metrics, status pipeline, upcoming interview for Thursday at *Veloce Technologies*, and Sara's master CV status.
3. **Job Opportunity Tracking**:
   - Navigate to **Job Tracker** (`/jobs`).
   - Switch between **Grid** and **Kanban Board** views.
   - Search by company ("Veloce") or filter by stage ("Interview").
   - Click on an opportunity to open the drawer, view interview dates, and add interaction notes.
4. **AI-Powered CV Analysis**:
   - Navigate to **AI CV Analysis** (`/ai-analysis`).
   - Select **"Use Main CV"** (Sara's Frontend CV is selected automatically).
   - In the dropdown, select **Frontend Developer (Veloce Technologies)** to pre-fill the job requirements.
   - Click **Generate AI Assessment**.
   - Review the structured report: Match Score Gauge, Matching Qualifications with evidence quotes, Unconfirmed Requirements, and Grounded Improvement Suggestions.
5. **Alternative CV Analysis**:
   - Select **"Upload Alternative CV"**.
   - Upload `sample_data/cvs/Sara_Backend_Developer_CV.pdf`.
   - Paste a Backend/Node.js job description.
   - Run the assessment. Notice how the analysis is saved independently while Sara's main CV remains untouched!
6. **Analysis History & PDF Export**:
   - Navigate to **Analysis History** (`/ai-history`).
   - Open any previous report without re-running the AI.
   - Click **Export as PDF** to download a formatted assessment report.

---

## 📡 6. REST API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate and receive JWT token.
- `GET /api/auth/me` - Get current authenticated user profile.
- `PUT /api/auth/profile` - Update user profile information.

### CV Management (`/api/cv`)
- `POST /api/cv/main` - Upload or replace master CV (PDF only, max 10MB).
- `GET /api/cv/main` - View master CV details and extracted text preview.
- `GET /api/cv/main/file` - Stream/download original PDF file.
- `DELETE /api/cv/main` - Delete master CV.

### Job Opportunities (`/api/jobs`)
- `GET /api/jobs` - List user's jobs with search, status filter, and sorting.
- `POST /api/jobs` - Create a new job opportunity.
- `GET /api/jobs/:id` - Get specific opportunity details.
- `PUT /api/jobs/:id` - Update opportunity information, stage, or append notes.
- `DELETE /api/jobs/:id` - Delete job opportunity.
- `GET /api/jobs/stats` - Retrieve dashboard analytics & pipeline metrics.

### AI Analysis (`/api/ai`)
- `POST /api/ai/analyze` - Execute CV analysis (supports main CV or alternative uploaded file).
- `GET /api/ai/history` - List user's past AI assessments.
- `GET /api/ai/history/:id` - Retrieve full structured report.
- `DELETE /api/ai/history/:id` - Delete an assessment record.
- `GET /api/ai/history/:id/pdf` - Export report as a PDF document.

---

## 🌐 7. Deployment Instructions

### Frontend (Vercel or Netlify)
1. Set the root directory to `frontend`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Configure environment variable: `VITE_API_URL` pointing to your deployed backend.

### Backend (Render or Railway)
1. Set the root directory to `backend`.
2. Build command: `npm install`.
3. Start command: `node src/server.js`.
4. Configure environment variables in the host dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random secret key.
   - `CLIENT_URL`: URL of your deployed frontend.
   - `GEMINI_API_KEY`: (Optional) Your Google Gemini API key.

### Database (MongoDB Atlas)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user with read/write permissions.
3. Whitelist IP addresses (`0.0.0.0/0` for cloud deployment).
4. Paste the connection string into `MONGODB_URI`.

---

## 🛡️ 8. AI Grounding & Ethical Principles

CareerTech strictly enforces ethical AI guidelines:
1. **No Hallucinations**: The system never manufactures skills or job experiences.
2. **Constructive Gap Identification**: Missing skills are classified as either "unsupported" or "implicit/unclear" rather than presuming candidate incompetence.
3. **No Automated Decisions**: The AI provides guidance; it never alters application statuses or applies to jobs automatically.
4. **Data Isolation**: Each user's documents and analysis reports are strictly private.

---

## 📄 License
ISC License — Created for the CareerTech MERN Edition Project.
