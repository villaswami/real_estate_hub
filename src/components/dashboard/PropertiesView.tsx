import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, IndianRupee, Bed, Bath, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { PropertyDetails } from './PropertyDetails';

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

interface Category {
  id: string;
  name: string;
  image_url: string;
  description: string;
}

interface PropertiesViewProps {
  category: Category;
  onBack: () => void;
}

export const PropertiesView = ({ category, onBack }: PropertiesViewProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.id]);

  // Helper: fallback demo data for Land, Independent House, Apartment, and Rent categories
  function getDemoProperties(): Property[] {
    if (category.name.toLowerCase() === 'land') {
      return [
        {
          id: 'land-1',
          title: 'Premium Land Plot in Mumbai',
          price: 1500000,
          location: 'Mumbai, Maharashtra',
          images: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&fit=crop', // open land
            'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&fit=crop' // green field
          ],
          bedrooms: undefined,
          bathrooms: undefined,
          area_sqft: 2400,
          availability_status: 'available',
          owner_name: 'Rajesh Sharma',
          owner_contact: '+91 98765 43210',
          description: 'A premium plot of land in a prime Mumbai location, perfect for building your dream home.',
          full_address: 'Sector 15, Andheri West, Mumbai, Maharashtra 400053',
          furnished: undefined
        },
        {
          id: 'land-2',
          title: 'Investment Land in Pune',
          price: 950000,
          location: 'Pune, Maharashtra',
          images: [
            'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&fit=crop', // brown land
            'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&fit=crop' // field
          ],
          bedrooms: undefined,
          bathrooms: undefined,
          area_sqft: 1800,
          availability_status: 'available',
          owner_name: 'Amit Patel',
          owner_contact: '+91 98765 54321',
          description: 'Well-located land with great potential for investment and future growth.',
          full_address: 'Hinjewadi Phase 2, Pune, Maharashtra 411057',
          furnished: undefined
        }
      ];
    }
    if (category.name.toLowerCase() === 'independent house') {
      return [
        {
          id: 'house-1',
          title: 'Spacious 3BHK Independent House',
          price: 3200000,
          location: 'Bangalore, Karnataka',
          images: [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&fit=crop', // modern house
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&fit=crop' // villa
          ],
          bedrooms: 3,
          bathrooms: 2,
          area_sqft: 1800,
          availability_status: 'available',
          owner_name: 'Sunita Reddy',
          owner_contact: '+91 98765 67890',
          description: 'A large independent house with garden space, perfect for families.',
          full_address: 'Whitefield, Bangalore, Karnataka 560066',
          furnished: true
        },
        {
          id: 'house-2',
          title: 'Modern 4BHK Villa',
          price: 4500000,
          location: 'Delhi, Delhi',
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop', // luxury villa
            'https://images.unsplash.com/photo-1600585154207-439b387441b0?w=800&fit=crop' // villa exterior
          ],
          bedrooms: 4,
          bathrooms: 3,
          area_sqft: 2200,
          availability_status: 'available',
          owner_name: 'Priya Gupta',
          owner_contact: '+91 87654 32109',
          description: 'Luxury villa with modern amenities, parking, and 24/7 security.',
          full_address: 'Connaught Place, New Delhi, Delhi 110001',
          furnished: false
        }
      ];
    }
    if (category.name.toLowerCase() === 'apartment') {
      return [
        {
          id: 'apt-1',
          title: '2BHK Apartment in Hyderabad',
          price: 2800000,
          location: 'Hyderabad, Telangana',
          images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&fit=crop', // apartment building
            'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&fit=crop' // apartment interior
          ],
          bedrooms: 2,
          bathrooms: 2,
          area_sqft: 1200,
          availability_status: 'available',
          owner_name: 'Vikram Singh',
          owner_contact: '+91 98765 13579',
          description: 'Contemporary apartment near IT hub with excellent connectivity.',
          full_address: 'Gachibowli, Hyderabad, Telangana 500032',
          furnished: true
        },
        {
          id: 'apt-2',
          title: 'Affordable 1BHK Flat',
          price: 1800000,
          location: 'Pune, Maharashtra',
          images: [
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&fit=crop', // small apartment
            'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&fit=crop' // apartment exterior
          ],
          bedrooms: 1,
          bathrooms: 1,
          area_sqft: 650,
          availability_status: 'available',
          owner_name: 'Amit Patel',
          owner_contact: '+91 98765 54321',
          description: 'Well-located flat with great potential for investment.',
          full_address: 'Hinjewadi Phase 2, Pune, Maharashtra 411057',
          furnished: false
        }
      ];
    }
    // Rent categories (1BHK, 2BHK, 3BHK, etc.)
    if (category.name.match(/bhk/i)) {
      const bhk = parseInt(category.name) || 1;
      return [
        {
          id: `${category.name}-rent-1`,
          title: `Spacious ${category.name} for Rent in Mumbai`,
          price: 25000,
          location: 'Mumbai, Maharashtra',
          images: [
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&fit=crop', // modern flat
            'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&fit=crop' // flat interior
          ],
          bedrooms: bhk,
          bathrooms: Math.ceil(bhk / 2),
          area_sqft: bhk * 400,
          availability_status: 'available',
          owner_name: 'Rohit Mehra',
          owner_contact: '+91 90000 11111',
          description: `Well-maintained ${category.name} apartment available for rent in a prime location.`,
          full_address: 'Andheri East, Mumbai, Maharashtra 400069',
          furnished: true
        },
        {
          id: `${category.name}-rent-2`,
          title: `Affordable ${category.name} in Pune`,
          price: 18000,
          location: 'Pune, Maharashtra',
          images: [
            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&fit=crop', // affordable flat
            'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&fit=crop' // flat exterior
          ],
          bedrooms: bhk,
          bathrooms: Math.ceil(bhk / 2),
          area_sqft: bhk * 350,
          availability_status: 'available',
          owner_name: 'Sneha Kulkarni',
          owner_contact: '+91 98888 22222',
          description: `Comfortable ${category.name} flat for rent with all amenities nearby.`,
          full_address: 'Baner, Pune, Maharashtra 411045',
          furnished: false
        }
      ];
    }
    return [];
  }

  const fetchProperties = async (afterInsert = false) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('category_id', category.id)
        .eq('availability_status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        setProperties(getDemoProperties());
      } else if (!data || data.length === 0) {
        // Add rent demo fallback for BHK categories
        if (
          ['land', 'independent house', 'apartment'].includes(category.name.toLowerCase()) ||
          category.name.match(/bhk/i)
        ) {
          setProperties(getDemoProperties());
        } else if (!afterInsert) {
          await createSampleProperties();
          return;
        } else {
          setProperties([]);
        }
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties(getDemoProperties());
    } finally {
      setLoading(false);
    }
  };

  const createSampleProperties = async () => {
    const now = Date.now();
    const sampleProperties = [
      {
        // id: `${category.id}-1-${now}`, // REMOVE id if your DB auto-generates it
        title: `Beautiful ${category.name} in Premium Location`,
        description: `Spacious and well-maintained ${category.name.toLowerCase()} in prime location with modern amenities and excellent connectivity.`,
        price: category.name.includes('BHK') ? 25000 : category.name === 'Land' ? 1500000 : category.name === 'Agriculture Land' ? 800000 : 3200000,
        location: 'Mumbai, Maharashtra',
        full_address: 'Sector 15, Andheri West, Mumbai, Maharashtra 400053',
        category_id: category.id,
        owner_name: 'Rajesh Sharma',
        owner_contact: '+91 98765 43210',
        images: [category.image_url, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
        bedrooms: category.name.includes('BHK') ? parseInt(category.name[0]) : category.name === 'Independent House' ? 3 : null,
        bathrooms: category.name.includes('BHK') ? Math.ceil(parseInt(category.name[0]) / 2) : category.name === 'Independent House' ? 2 : null,
        area_sqft: category.name.includes('BHK') ? parseInt(category.name[0]) * 400 : category.name === 'Land' ? 2400 : category.name === 'Agriculture Land' ? 43560 : 1800,
        furnished: category.name.includes('BHK') ? true : false,
        availability_status: 'available'
      },
      {
        // id: `${category.id}-2-${now}`,
        title: `Premium ${category.name} for ${category.name.includes('BHK') ? 'Rent' : 'Sale'}`,
        description: `Luxury ${category.name.toLowerCase()} with modern amenities, parking facility, and 24/7 security.`,
        price: category.name.includes('BHK') ? 35000 : category.name === 'Land' ? 2200000 : category.name === 'Agriculture Land' ? 1200000 : 4500000,
        location: 'Delhi, Delhi',
        full_address: 'Connaught Place, New Delhi, Delhi 110001',
        category_id: category.id,
        owner_name: 'Priya Gupta',
        owner_contact: '+91 87654 32109',
        images: [category.image_url, 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400'],
        bedrooms: category.name.includes('BHK') ? parseInt(category.name[0]) : category.name === 'Independent House' ? 4 : null,
        bathrooms: category.name.includes('BHK') ? Math.ceil(parseInt(category.name[0]) / 2) : category.name === 'Independent House' ? 3 : null,
        area_sqft: category.name.includes('BHK') ? parseInt(category.name[0]) * 450 : category.name === 'Land' ? 3200 : category.name === 'Agriculture Land' ? 87120 : 2200,
        furnished: category.name.includes('BHK') ? false : null,
        availability_status: 'available'
      },
      {
        // id: `${category.id}-3-${now}`,
        title: `Affordable ${category.name} in Growing Area`,
        description: `Well-located ${category.name.toLowerCase()} with great potential for investment and future growth.`,
        price: category.name.includes('BHK') ? 18000 : category.name === 'Land' ? 950000 : category.name === 'Agriculture Land' ? 600000 : 2800000,
        location: 'Pune, Maharashtra',
        full_address: 'Hinjewadi Phase 2, Pune, Maharashtra 411057',
        category_id: category.id,
        owner_name: 'Amit Patel',
        owner_contact: '+91 98765 54321',
        images: [category.image_url, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'],
        bedrooms: category.name.includes('BHK') ? parseInt(category.name[0]) : category.name === 'Independent House' ? 2 : null,
        bathrooms: category.name.includes('BHK') ? Math.ceil(parseInt(category.name[0]) / 2) : category.name === 'Independent House' ? 2 : null,
        area_sqft: category.name.includes('BHK') ? parseInt(category.name[0]) * 350 : category.name === 'Land' ? 1800 : category.name === 'Agriculture Land' ? 21780 : 1400,
        furnished: category.name.includes('BHK') ? true : null,
        availability_status: 'available'
      },
      {
        // id: `${category.id}-4-${now}`,
        title: `Spacious ${category.name} with Garden`,
        description: `Large ${category.name.toLowerCase()} with garden space, perfect for families looking for comfort and space.`,
        price: category.name.includes('BHK') ? 42000 : category.name === 'Land' ? 1800000 : category.name === 'Agriculture Land' ? 900000 : 3800000,
        location: 'Bangalore, Karnataka',
        full_address: 'Whitefield, Bangalore, Karnataka 560066',
        category_id: category.id,
        owner_name: 'Sunita Reddy',
        owner_contact: '+91 98765 67890',
        images: [category.image_url, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'],
        bedrooms: category.name.includes('BHK') ? parseInt(category.name[0]) : category.name === 'Independent House' ? 4 : null,
        bathrooms: category.name.includes('BHK') ? Math.ceil(parseInt(category.name[0]) / 2) : category.name === 'Independent House' ? 3 : null,
        area_sqft: category.name.includes('BHK') ? parseInt(category.name[0]) * 500 : category.name === 'Land' ? 2800 : category.name === 'Agriculture Land' ? 65340 : 2400,
        furnished: category.name.includes('BHK') ? false : null,
        availability_status: 'available'
      },
      {
        // id: `${category.id}-5-${now}`,
        title: `Modern ${category.name} Near IT Hub`,
        description: `Contemporary ${category.name.toLowerCase()} near major IT companies with excellent transport connectivity.`,
        price: category.name.includes('BHK') ? 28000 : category.name === 'Land' ? 2800000 : category.name === 'Agriculture Land' ? 1100000 : 4200000,
        location: 'Hyderabad, Telangana',
        full_address: 'Gachibowli, Hyderabad, Telangana 500032',
        category_id: category.id,
        owner_name: 'Vikram Singh',
        owner_contact: '+91 98765 13579',
        images: [category.image_url, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'],
        bedrooms: category.name.includes('BHK') ? parseInt(category.name[0]) : category.name === 'Independent House' ? 3 : null,
        bathrooms: category.name.includes('BHK') ? Math.ceil(parseInt(category.name[0]) / 2) : category.name === 'Independent House' ? 2 : null,
        area_sqft: category.name.includes('BHK') ? parseInt(category.name[0]) * 420 : category.name === 'Land' ? 2200 : category.name === 'Agriculture Land' ? 32670 : 1900,
        furnished: category.name.includes('BHK') ? true : null,
        availability_status: 'available'
      }
    ];

    try {
      const { error } = await supabase
        .from('properties')
        .insert(sampleProperties);

      if (error) {
        console.error('Error inserting sample properties:', error);
      }
      // Fetch again to update the list after insert, and set loading only after this fetch
      await fetchProperties(true);
    } catch (error) {
      console.error('Error creating sample properties:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price}`;
  };

  if (selectedProperty) {
    return (
      <PropertyDetails
        property={selectedProperty}
        onBack={() => setSelectedProperty(null)}
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
              Back to Categories
            </Button>
            <div className="border-l h-6"></div>
            <h1 className="text-xl font-semibold text-gray-900">
              {category.name} Properties
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Available {category.name} Properties
          </h2>
          <p className="text-gray-600">
            Browse through our curated selection of {category.name.toLowerCase()} properties
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="relative">
                  <img
                    src={property.images[0] || category.image_url}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-2 left-2 bg-green-600">
                    {property.availability_status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-blue-600 font-bold text-xl mb-2">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {formatPrice(property.price)}
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>

                  {property.bedrooms && (
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms} Bed
                      </div>
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms} Bath
                        </div>
                      )}
                      {property.area_sqft && (
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.area_sqft} sqft
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              There are currently no {category.name.toLowerCase()} properties available in this category.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
