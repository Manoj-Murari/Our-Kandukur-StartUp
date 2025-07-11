/*
  # Authentication and Community System

  1. New Tables
    - `user_profiles` - Extended user profiles with tags and roles
    - `community_messages` - Community chat messages
    - `visitor_logs` - Visitor tracking for analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and public access where appropriate
    - Admin-only access for sensitive operations

  3. Features
    - User authentication with Google/Facebook
    - Professional tags and roles system
    - Community chat functionality
    - Visitor analytics
    - Admin panel for user management
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  avatar_url text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'founder', 'teacher', 'mentor', 'vip', 'manager')),
  tag text DEFAULT 'user' CHECK (tag IN ('user', 'student', 'admin', 'founder', 'teacher', 'mentor', 'vip', 'manager')),
  is_student boolean DEFAULT false,
  academic_details jsonb DEFAULT '{}',
  personal_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Community Messages Table
CREATE TABLE IF NOT EXISTS community_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_tag text NOT NULL,
  avatar_url text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Visitor Logs Table
CREATE TABLE IF NOT EXISTS visitor_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  visited_at timestamptz DEFAULT now(),
  page_url text,
  user_agent text,
  ip_address inet
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'founder')
    )
  );

-- Community Messages Policies
CREATE POLICY "Anyone can read messages"
  ON community_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert messages"
  ON community_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON community_messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Visitor Logs Policies
CREATE POLICY "Public can insert visitor logs"
  ON visitor_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read visitor logs"
  ON visitor_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'founder')
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_tag ON user_profiles(tag);
CREATE INDEX IF NOT EXISTS idx_community_messages_created_at ON community_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visited_at ON visitor_logs(visited_at DESC);

-- Insert sample admin user (you should update this with real credentials)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@ourkandukur.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;