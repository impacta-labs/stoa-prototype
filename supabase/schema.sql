-- STOA — Supabase schema
-- Run this in the Supabase SQL editor of your project

-- ─── Tables ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orgs (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name    TEXT NOT NULL DEFAULT 'Nueva organización',
  sector  TEXT NOT NULL DEFAULT '',
  context TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES orgs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decisions (
  id         TEXT NOT NULL,
  org_id     UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, org_id)
);

-- ─── Row Level Security ──────────────────────────────────────────────────────

ALTER TABLE orgs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

-- Profiles: users manage their own row
CREATE POLICY "own profile select" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "own profile insert" ON profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON profiles FOR UPDATE USING (id = auth.uid());

-- Orgs: any authenticated user can create an org (needed at sign-up)
CREATE POLICY "create org" ON orgs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- Members can read/update their org
CREATE POLICY "org member select" ON orgs FOR SELECT
  USING (id = (SELECT org_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "org member update" ON orgs FOR UPDATE
  USING (id = (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- Decisions: full access for org members
CREATE POLICY "org decisions all" ON decisions FOR ALL
  USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()))
  WITH CHECK (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS decisions_org_id_idx ON decisions (org_id);
CREATE INDEX IF NOT EXISTS profiles_org_id_idx  ON profiles  (org_id);
