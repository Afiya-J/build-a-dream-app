CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.colleges TO authenticated;
GRANT ALL ON public.colleges TO service_role;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Colleges are readable by signed-in users" ON public.colleges FOR SELECT TO authenticated USING (true);

INSERT INTO public.colleges (name, code) VALUES ('K. Ramakrishnan College of Technology', 'KRCT');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID REFERENCES public.colleges(id),
  full_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  department TEXT NOT NULL,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profiles_role_check CHECK (role IN ('student', 'admin')),
  CONSTRAINT profiles_year_check CHECK (year BETWEEN 1 AND 4),
  CONSTRAINT profiles_semester_check CHECK (semester BETWEEN 1 AND 8)
);

CREATE UNIQUE INDEX profiles_college_regno_key
  ON public.profiles (college_id, upper(registration_number));

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = _user_id AND role = 'admin'
  )
$$;

CREATE POLICY "Users can read their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update their own profile safely" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = 'student'
    AND is_active = true
    AND college_id = (SELECT id FROM public.colleges WHERE code = 'KRCT')
  );

CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  krct_id UUID;
BEGIN
  SELECT id INTO krct_id FROM public.colleges WHERE code = 'KRCT';

  INSERT INTO public.profiles (
    id, college_id, full_name, registration_number, department, year, semester, role, is_active
  ) VALUES (
    NEW.id,
    krct_id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Student'),
    upper(trim(COALESCE(NEW.raw_user_meta_data ->> 'registration_number', NEW.id::text))),
    COALESCE(NEW.raw_user_meta_data ->> 'department', 'CSE'),
    COALESCE((NEW.raw_user_meta_data ->> 'year')::int, 1),
    COALESCE((NEW.raw_user_meta_data ->> 'semester')::int, 1),
    'student',
    true
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();