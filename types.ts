
export type TripCategory = 'Royal' | 'Nature' | 'Adventure' | 'Wellness' | 'Heritage' | 'Beach';

export interface TripRequest {
  destination: string;
  duration: string;
  preferredDates: string;
  budget: string;
  adults: number;
  children: number;
  interests: string[];
  additionalNotes: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface FeaturedTrip {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  tags: TripCategory[];
  description?: string;
  itinerary?: string;
  status: 'Active' | 'Draft';
}
