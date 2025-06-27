import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PropertiesView } from './PropertiesView';

interface Category {
  id: string;
  name: string;
  image_url: string;
  description: string;
}

interface CategoriesViewProps {
  type: 'buy' | 'rent';
  onBack: () => void;
}

export const CategoriesView = ({ type, onBack }: CategoriesViewProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', type)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        setCategories(getSampleCategories(type));
      } else if (!data || data.length === 0) {
        setCategories(getSampleCategories(type));
      } else {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(getSampleCategories(type));
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample categories
  function getSampleCategories(type: 'buy' | 'rent'): Category[] {
    if (type === 'buy') {
      return [
        {
          id: '1',
          name: 'Land',
          image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
          description: 'Plots and land for sale in prime locations.',
        },
        {
          id: '2',
          name: 'Independent House',
          image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
          description: 'Buy independent houses and villas.',
        },
        {
          id: '3',
          name: 'Apartment',
          image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400',
          description: 'Flats and apartments for sale.',
        },
      ];
    } else {
      return [
        {
          id: '4',
          name: '1BHK',
          image_url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400',
          description: '1 Bedroom Hall Kitchen apartments for rent.',
        },
        {
          id: '5',
          name: '2BHK',
          image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400',
          description: '2 Bedroom Hall Kitchen apartments for rent.',
        },
        {
          id: '6',
          name: '3BHK',
          image_url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=400',
          description: '3 Bedroom Hall Kitchen apartments for rent.',
        },
      ];
    }
  }

  if (selectedCategory) {
    return (
      <PropertiesView
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="border-l h-6"></div>
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {type} Properties
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
            {type} Property Categories
          </h2>
          <p className="text-gray-600">
            Choose a category to browse available properties
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="relative">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-lg"></div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
