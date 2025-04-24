# GPA Mate

✅ GPA Mate is a Micro SaaS web application designed for university students and college advisors to calculate and track GPA effortlessly. Built with Vite JS and Firebase, it offers secure user authentication, course management, GPA calculation, and PDF report downloads. The app is deployed on Vercel with a CI/CD pipeline managed via GitHub Actions, ensuring scalability and reliability.

**🟢 Live Demo**: [https://gpa-mate.vercel.app/](https://gpa-mate.vercel.app/)

## ⭕ Features

- **User Authentication**: Secure login/signup using Firebase Authentication.
- **Course Management**: Add, delete, and view courses with grades and credits.
- **GPA Calculation**: Automatically calculate GPA based on entered grades and credits.
- **PDF Export**: Download GPA reports as PDFs using jsPDF.
- **Responsive Design**: Modern, clean UI built with Vite JS, accessible on all devices.
- **Data Persistence**: Store user data securely in Firebase Firestore.

## ⭕ Tech Stack

- **Frontend**: Vite JS
- **Backend/Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **PDF Generation**: jsPDF
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions

## ⭕ Project Structure

```
GPA-Mate/
├── .github/                 # GitHub Actions workflows and templates
│   └── workflows/ci.yml     # CI pipeline configuration
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # Reusable UI components
│   ├── pages/               # Next.js pages and API routes
│   ├── utils/               # Utility functions (e.g., GPA calculation)
│   └── lib/firebase.ts      # Firebase config
├── .gitignore               # Git ignore file
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## ⭕ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project setup
- Vercel account for deployment

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/VishwaSaranga/GPA-Mate.git
   cd GPA-Mate
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Firebase**:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password) and Firestore Database.
   - Copy your Firebase config and add it to a `.env.local` file:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

4. **Run Locally**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Testing

Run the test suite to ensure everything works as expected:
```bash
npm test
```

### Deployment

GPA Mate is deployed on Vercel with automatic CI/CD via GitHub Actions.

1. **Push to GitHub**:
   - Commit your changes and push to the `main` branch for production or `staging` for testing.

2. **Vercel Deployment**:
   - Link your GitHub repository to Vercel.
   - Vercel will automatically build and deploy on every push to the specified branches.

## ⭕ CI/CD Pipeline

The CI/CD pipeline is managed by GitHub Actions, defined in `.github/workflows/ci.yml`:
- **Matrix Testing**: Tests across Node.js versions 16, 18, and 20.
- **Security Scanning**: Includes SAST (CodeQL), DAST (Gitleaks), and SCA (Dependabot).
- **Quality Gates**: Ensures all tests and scans pass before deployment.

## ⭕ Security & Compliance

- **Firebase Security Rules**: Restrict access to user data (`firestore.rules`).
- **GDPR Compliance**: Anonymized user data in PDFs (optional email inclusion).
- **Secrets Scanning**: Automated checks for exposed secrets using Gitleaks.

## ⭕ Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request with a detailed description.

Use the [Pull Request Template](.github/pull_request_template.md) and adhere to [Conventional Commits](https://www.conventionalcommits.org/).

## ⭕ Collaboration Protocols

- Use GitHub Issues for task tracking.
- PRs require at least 1 review before merging.
- Weekly dependency update reviews via Dependabot.

## ⭕ Future Roadmap

- Add dark mode for better accessibility.
- Implement role-based access for advisors.
- Introduce GPA trend analytics for semester-wise tracking.

## ⭕ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## ⭕ Acknowledgments

- Developed as part of the Systems Administration & Maintenance course (IT31023) under Mr. Isuru Samarappulige.
- Student: <br>
ITBNM-2211-0124 | W.V.S. Dissanayaka <br>
Designer and Developer | GPA Mate <br>
Horizon Campus | Faculty of IT (NMC Intake 11)
