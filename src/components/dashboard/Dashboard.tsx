
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ShoppingCart, Building, LogOut, User, Settings } from 'lucide-react';
import { CategoriesView } from './CategoriesView';
import { UserSettings } from './UserSettings';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [selectedType, setSelectedType] = useState<'buy' | 'rent' | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <UserSettings onBack={() => setShowSettings(false)} />;
  }

  if (selectedType) {
    return <CategoriesView type={selectedType} onBack={() => setSelectedType(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">PropertyHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What are you looking for?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose whether you want to buy or rent a property, and we'll help you find the perfect match.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Buy Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500"
            onClick={() => setSelectedType('buy')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-green-100 p-4 rounded-full mb-4">
                <ShoppingCart className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Buy Property</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Find your dream home or investment property. Browse through various categories including land, houses, and apartments.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• Land & Agriculture Land</div>
                <div>• Independent Houses</div>
                <div>• Apartments & Flats</div>
                <div>• Commercial Properties</div>
              </div>
            </CardContent>
          </Card>

          {/* Rent Card */}
          <Card 
            className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-500"
            onClick={() => setSelectedType('rent')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-blue-100 p-4 rounded-full mb-4">
                <Building className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Rent Property</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Find the perfect rental property for your needs. From studio apartments to luxury penthouses.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <div>• 1BHK to 5BHK Options</div>
                <div>• Furnished & Unfurnished</div>
                <div>• Independent Houses</div>
                <div>• Apartment Complexes</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
            <div className="text-gray-600">Properties Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-gray-600">Cities Covered</div>
          </div>
        </div>
      </main>
    </div>
  );
};
