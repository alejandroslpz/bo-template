-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Memberships (user <-> org relationship)
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Members can read their organizations" ON public.organizations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.memberships WHERE organization_id = organizations.id AND user_id = auth.uid())
  );

CREATE POLICY "Owners can update their organization" ON public.organizations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.memberships WHERE organization_id = organizations.id AND user_id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Users can read their memberships" ON public.memberships
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Org admins can manage memberships" ON public.memberships
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.memberships m WHERE m.organization_id = memberships.organization_id AND m.user_id = auth.uid() AND m.role IN ('owner', 'admin'))
  );

-- Auto-create default org on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_org()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id UUID;
BEGIN
  INSERT INTO public.organizations (name, slug)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)) || '''s Org',
    NEW.id::text
  )
  RETURNING id INTO new_org_id;

  INSERT INTO public.memberships (user_id, organization_id, role)
  VALUES (NEW.id, new_org_id, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_org
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_org();

-- Updated_at trigger for organizations
CREATE TRIGGER on_organization_updated
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
