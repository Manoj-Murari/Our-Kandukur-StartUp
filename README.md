# OUR KANDUKUR - Dynamic Community Website

A modern, dynamic website for the OUR KANDUKUR startup community with real-time updates and database integration.

## Features

### 🚀 Dynamic Content Management
- **Real-time Updates**: All content updates automatically without page refresh
- **Live Announcements**: Priority-based announcement system with auto-expiry
- **Dynamic Opportunities**: Real-time job, internship, and event listings
- **Team Management**: Dynamic team member profiles with contact information

### 🎨 Modern Design
- **Responsive Design**: Works perfectly on all devices
- **3D Effects**: Modern card animations and hover effects
- **Glassmorphism**: Beautiful glass-like UI elements
- **Custom Animations**: Smooth transitions and micro-interactions

### 🔧 Technical Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase real-time subscriptions
- **Icons**: Lucide React

## Database Schema

### Tables
1. **opportunities** - Job postings, internships, workshops, etc.
2. **announcements** - Community announcements with priority levels
3. **team_members** - Team member profiles and contact information

### Features
- Row Level Security (RLS) enabled
- Real-time subscriptions for live updates
- Public read access, authenticated admin access
- Automatic timestamp management

## Setup Instructions

### 1. Environment Setup
1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 2. Database Setup
1. Create a new Supabase project
2. Run the migration file `supabase/migrations/create_initial_schema.sql`
3. This will create all tables, policies, and sample data

### 3. Development
```bash
npm install
npm run dev
```

## Content Management

### Adding New Opportunities
```sql
INSERT INTO opportunities (title, company, location, type, deadline, description, requirements, stipend)
VALUES ('Your Title', 'Company Name', 'Location', 'internships', '2024-03-01', 'Description', ARRAY['Skill1', 'Skill2'], 'Stipend');
```

### Adding Announcements
```sql
INSERT INTO announcements (title, content, type, priority, expires_at)
VALUES ('Title', 'Content', 'featured', 'high', '2024-03-01 23:59:59');
```

### Managing Team Members
```sql
INSERT INTO team_members (name, role, location, phone, email, linkedin, instagram, resume_url)
VALUES ('Name', 'Role', 'Location', 'Phone', 'Email', 'LinkedIn URL', 'Instagram URL', 'Resume URL');
```

## Daily Updates Workflow

1. **Morning**: Add new opportunities and announcements
2. **Afternoon**: Update existing opportunities status
3. **Evening**: Review and expire old announcements
4. **Weekly**: Update team information and add new workshops

## Real-time Features

- **Live Updates**: Changes appear instantly across all connected users
- **Notification System**: Bell icon shows new announcements count
- **Auto-refresh**: Content refreshes automatically every few minutes
- **Status Indicators**: Live status indicators show real-time connectivity

## Logo Integration

The community logo is now integrated into the header with proper styling and background removal effects.

## Deployment

The website is ready for deployment with:
- Environment variable configuration
- Database migrations
- Production-ready build setup
- SEO optimization

## Support

For technical support or content management questions, contact the development team.