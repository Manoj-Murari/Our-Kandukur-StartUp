# OUR KANDUKUR - Startup Community Website

<!-- 
NOTE: The previous screenshot link was broken. 
To add a new one:
1. Take a screenshot of your homepage.
2. Drag and drop the image into a new issue or a comment on GitHub to generate a permanent URL.
3. Replace this comment block with the new Markdown for your image, like this:
   ![Our Kandukur Homepage](PASTE_YOUR_NEW_IMAGE_URL_HERE)
-->

Welcome to the official repository for the **Our Kandukur Startup Community Website**. This platform is designed to serve as a dynamic bridge between students and the industry in Kandukur, Prakasam District, Andhra Pradesh. We provide comprehensive support through internships, workshops, hackathons, and job opportunities to help students build successful careers.

This project is built with a modern, real-time technology stack to ensure a fast, responsive, and engaging user experience.

---

## ✨ Features

### For Students & Job Seekers
- **Dynamic Opportunities Board**: View real-time listings for jobs, internships, workshops, and more.
- **Advanced Filtering**: Filter opportunities by category, work mode (On-site, Remote, Hybrid), and stipend/salary.
- **Featured Opportunities**: Easily spot highlighted opportunities, which are always displayed at the top.
- **User Profiles**: Create and manage a detailed professional profile, including academic and social links.
- **Seamless Application Process**: Apply for opportunities with a single click after completing your profile.
- **Community Engagement**: View team members, partners, and testimonials to understand the community's impact.

### For Administrators
- **Comprehensive Admin Dashboard**: A central hub for managing all aspects of the website.
- **Content Management**:
    - **Post & Manage Opportunities**: Add, edit, and delete opportunities with a full-featured form, including a "Featured" option.
    - **Manage Team Members**: Add and edit detailed profiles for all team members.
    - **Manage Partners**: Add and manage partner logos, grouped by category.
    - **Manage Testimonials**: Control the student testimonials displayed on the site.
- **User & Message Management**: View and manage registered users and contact form submissions with bulk-delete functionality.
- **Site Settings**: Update global site information, such as social media and WhatsApp links, from the dashboard.

---

## 🛠️ Tech Stack

- **Frontend**:
    - **Framework**: [React](https://reactjs.org/)
    - **Language**: [TypeScript](https://www.typescriptlang.org/)
    - **Build Tool**: [Vite](https://vitejs.dev/)
    - **Styling**: [Tailwind CSS](https://tailwindcss.com/)
    - **Icons**: [Lucide React](https://lucide.dev/)
- **Backend**:
    - **Service**: [Firebase](https://firebase.google.com/)
    - **Authentication**: Firebase Authentication (Google Sign-In)
    - **Database**: Firestore (Real-time NoSQL Database)
- **Deployment**:
    - **CI/CD**: GitHub Actions
    - **Hosting**: Deployed via FTP to Hostingial

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or later recommended)
- npm

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/Manoj-Murari/Our-Kandukur-StartUp.git](https://github.com/Manoj-Murari/Our-Kandukur-StartUp.git)
    cd Our-Kandukur-StartUp
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    - Create a new file named `.env.local` in the root of your project.
    - You will need to get your web app's Firebase configuration keys from the Firebase Console.
    - Add your Firebase keys to the `.env.local` file, following the format in `.env.example`:

    ```env
    # .env.local
    VITE_API_KEY="AIzaSy..."
    VITE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
    VITE_PROJECT_ID="your-project-id"
    VITE_STORAGE_BUCKET="your-project-id.appspot.com"
    VITE_MESSAGING_SENDER_ID="1234567890"
    VITE_APP_ID="1:1234567890:web:abcdef123456"
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 🔄 Automated Deployment

This project is configured for continuous deployment using **GitHub Actions**. Any push to the `main` branch will automatically trigger a workflow that:
1.  Builds the React application for production (`npm run build`).
2.  Deploys the contents of the `dist` folder to the hosting server via FTP.

For this to work, the following secrets must be set in the GitHub repository's **Settings > Secrets and variables > Actions**:
- `FTP_SERVER`: The FTP host address.
- `FTP_USERNAME`: The FTP username.
- `FTP_PASSWORD`: The FTP password.

---

## 📂 Project Structure

- **`.github/workflows/`**: Contains the GitHub Actions workflow file (`deploy.yml`) for automated deployment.
- **`public/`**: Contains static assets like `index.html` and the site logo/favicon.
- **`src/`**: Contains the main source code for the application.
    - **`components/`**: Reusable React components that make up the UI.
    - **`contexts/`**: React Context providers, such as `AuthContext` for managing user state.
    - **`hooks/`**: Custom React hooks for fetching data from Firebase (e.g., `useOpportunities`, `useTeamMembers`).
    - **`lib/`**: Firebase initialization and configuration.

---

## 📜 License

Copyright © 2025 Manoj Murari. All Rights Reserved.

---

## 📬 Contact

**Manoj Murari** - [LinkedIn](https://www.linkedin.com/in/manojmurari/) - manojmurari357@gmail.com

Project Link: [https://github.com/Manoj-Murari/Our-Kandukur-StartUp](https://github.com/Manoj-Murari/Our-Kandukur-StartUp)
