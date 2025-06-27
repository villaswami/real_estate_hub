import { ArrowLeft, MapPin, IndianRupee, Bed, Bath, Square, Phone, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  availability_status: string;
  owner_name: string;
  owner_contact: string;
  description?: string;
  full_address?: string;
  furnished?: boolean;
}

interface PropertyDetailsProps {
  property: Property;
  onBack: () => void;
}

export const PropertyDetails = ({ property, onBack }: PropertyDetailsProps) => {
  // Guard: If property is missing or has no id, show not found
  if (!property || !property.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you are looking for does not exist or could not be loaded.</p>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Crore`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lakh`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
            <div className="border-l h-6"></div>
            <h1 className="text-xl font-semibold text-gray-900 line-clamp-1">
              {property.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={property.images[0] || 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800'}
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {property.availability_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{property.title}</CardTitle>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.full_address || property.location}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-blue-600 font-bold text-3xl">
                  <IndianRupee className="h-8 w-8 mr-2" />
                  {formatPrice(property.price)}
                </div>

                {property.bedrooms && (
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="font-medium">{property.bedrooms}</span>
                      <span className="text-gray-600 ml-1">Bedrooms</span>
                    </div>
                    {property.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-5 w-5 mr-2 text-gray-600" />
                        <span className="font-medium">{property.bathrooms}</span>
                        <span className="text-gray-600 ml-1">Bathrooms</span>
                      </div>
                    )}
                    {property.area_sqft && (
                      <div className="flex items-center">
                        <Square className="h-5 w-5 mr-2 text-gray-600" />
                        <span className="font-medium">{property.area_sqft}</span>
                        <span className="text-gray-600 ml-1">sq ft</span>
                      </div>
                    )}
                  </div>
                )}

                {property.furnished !== undefined && (
                  <div className="flex items-center">
                    <Badge variant={property.furnished ? "default" : "secondary"}>
                      {property.furnished ? "Furnished" : "Unfurnished"}
                    </Badge>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description || 
                     `This beautiful property offers comfortable living space with modern amenities. 
                      Located in a prime area with excellent connectivity and facilities nearby. 
                      Perfect for families looking for a quality home in a great neighborhood.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Owner Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Owner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">
                      {property.owner_name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {property.owner_name}
                  </h3>
                  <p className="text-gray-600">Property Owner</p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {property.owner_contact}
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500 pt-4 border-t">
                  Always verify property details and ownership before making any payments
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">Residential</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge variant="secondary">{property.availability_status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{property.location}</span>
                </div>
                {property.furnished !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Furnished</span>
                    <span className="font-medium">
                      {property.furnished ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
