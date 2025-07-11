/*
  # Initial Database Schema for OUR KANDUKUR Community

  1. New Tables
    - `opportunities`
      - `id` (serial, primary key)
      - `title` (text, required)
      - `company` (text, required)
      - `location` (text, required)
      - `type` (text, required - internships, jobs, workshops, etc.)
      - `status` (text, default 'open')
      - `deadline` (date, required)
      - `description` (text, required)
      - `requirements` (text array, required)
      - `stipend` (text, required)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
    
    - `announcements`
      - `id` (serial, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `type` (text, default 'general')
      - `priority` (text, default 'medium')
      - `created_at` (timestamptz, default now)
      - `expires_at` (timestamptz, nullable)
    
    - `team_members`
      - `id` (serial, primary key)
      - `name` (text, required)
      - `role` (text, required)
      - `location` (text, required)
      - `phone` (text, required)
      - `email` (text, required)
      - `linkedin` (text, nullable)
      - `instagram` (text, nullable)
      - `resume_url` (text, nullable)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin access

  3. Sample Data
    - Insert sample opportunities, announcements, and team members
*/

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('internships', 'jobs', 'workshops', 'hackathons', 'seminars', 'webinars')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  deadline DATE NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  stipend TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general' CHECK (type IN ('general', 'urgent', 'info', 'featured')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  linkedin TEXT,
  instagram TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read opportunities"
  ON opportunities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read announcements"
  ON announcements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read team members"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to manage data
CREATE POLICY "Authenticated users can manage opportunities"
  ON opportunities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for opportunities table
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO opportunities (title, company, location, type, status, deadline, description, requirements, stipend) VALUES
('Full Stack Developer Internship', 'TechCorp Solutions', 'Hyderabad, India', 'internships', 'open', '2024-02-15', 'Join our team for a 6-month internship focusing on React and Node.js development.', ARRAY['React', 'Node.js', 'MongoDB'], '₹15,000/month'),
('AI/ML Workshop Series', 'DataScience Academy', 'Online', 'workshops', 'open', '2024-02-20', 'Comprehensive workshop series on Machine Learning and AI fundamentals.', ARRAY['Python', 'Statistics', 'Basic ML'], 'Free'),
('Backend Developer Position', 'StartupHub', 'Bangalore, India', 'jobs', 'open', '2024-02-28', 'Full-time backend developer role with competitive salary and benefits.', ARRAY['Java', 'Spring Boot', 'PostgreSQL'], '₹8-12 LPA'),
('Blockchain Hackathon 2024', 'CryptoInnovate', 'Mumbai, India', 'hackathons', 'open', '2024-02-25', '48-hour hackathon focusing on blockchain solutions for social good.', ARRAY['Blockchain', 'Smart Contracts', 'Web3'], '₹1,00,000 Prize Pool'),
('Cloud Computing Seminar', 'CloudTech Institute', 'Chennai, India', 'seminars', 'open', '2024-02-18', 'Expert-led seminar on AWS, Azure, and Google Cloud platforms.', ARRAY['Basic Cloud Knowledge'], '₹500'),
('Digital Marketing Webinar', 'MarketingPro', 'Online', 'webinars', 'open', '2024-02-22', 'Learn advanced digital marketing strategies from industry experts.', ARRAY['Basic Marketing Knowledge'], 'Free');

INSERT INTO announcements (title, content, type, priority, expires_at) VALUES
('New Internship Opportunities Available!', 'We have added 15+ new internship opportunities from top companies. Check them out now!', 'featured', 'high', '2024-02-29 23:59:59'),
('Weekly Workshop Schedule Released', 'This week we have workshops on AI/ML, Web Development, and Digital Marketing. Register now!', 'info', 'medium', '2024-02-10 23:59:59'),
('System Maintenance Notice', 'Our website will undergo maintenance on Sunday 2-4 AM. Some features may be temporarily unavailable.', 'urgent', 'low', '2024-02-05 23:59:59');

INSERT INTO team_members (name, role, location, phone, email, linkedin, instagram, resume_url) VALUES
('Rajesh Kumar', 'Founder & CEO', 'Kandukur, AP', '+91 9876543210', 'rajesh@ourkandukur.com', 'https://linkedin.com/in/rajeshkumar', 'https://instagram.com/rajeshkumar', 'https://example.com/resume/rajesh.pdf'),
('Priya Sharma', 'Head of Operations', 'Hyderabad, TS', '+91 9876543211', 'priya@ourkandukur.com', 'https://linkedin.com/in/priyasharma', 'https://instagram.com/priyasharma', NULL),
('Arjun Patel', 'Technical Lead', 'Bangalore, KA', '+91 9876543212', 'arjun@ourkandukur.com', 'https://linkedin.com/in/arjunpatel', 'https://instagram.com/arjunpatel', 'https://example.com/resume/arjun.pdf'),
('Sneha Reddy', 'Community Manager', 'Chennai, TN', '+91 9876543213', 'sneha@ourkandukur.com', 'https://linkedin.com/in/snehareddy', 'https://instagram.com/snehareddy', NULL),
('Vikram Singh', 'Business Development Head', 'Mumbai, MH', '+91 9876543214', 'vikram@ourkandukur.com', 'https://linkedin.com/in/vikramsingh', 'https://instagram.com/vikramsingh', 'https://example.com/resume/vikram.pdf'),
('Anitha Krishnan', 'Content & Training Head', 'Pune, MH', '+91 9876543215', 'anitha@ourkandukur.com', 'https://linkedin.com/in/anithakrishnan', 'https://instagram.com/anithakrishnan', NULL);