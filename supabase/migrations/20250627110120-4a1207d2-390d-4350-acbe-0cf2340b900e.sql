
-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'rent')),
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  location TEXT NOT NULL,
  full_address TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  owner_contact TEXT NOT NULL,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'sold', 'rented', 'pending')),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  furnished BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Properties policies
CREATE POLICY "Anyone can view available properties" ON public.properties
  FOR SELECT USING (availability_status = 'available');

CREATE POLICY "Users can create properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all properties" ON public.properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample categories
INSERT INTO public.categories (name, type, image_url, description) VALUES
('Land', 'buy', 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400', 'Vacant land for development'),
('Agriculture Land', 'buy', 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400', 'Agricultural and farming land'),
('Independent House', 'buy', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400', 'Standalone residential houses'),
('Flat in Apartment', 'buy', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400', 'Apartments and flats in complexes'),
('1BHK', 'rent', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400', '1 Bedroom rental properties'),
('2BHK', 'rent', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400', '2 Bedroom rental properties'),
('3BHK', 'rent', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400', '3 Bedroom rental properties'),
('4BHK', 'rent', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400', '4 Bedroom rental properties'),
('5BHK', 'rent', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400', '5 Bedroom rental properties');
