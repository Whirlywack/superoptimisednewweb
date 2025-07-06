import { JourneyPage } from '@/components/templates/JourneyPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Building Journey - Superoptimised',
  description: 'Follow the complete building journey. Every decision documented, every lesson shared. See how community feedback shapes product development in real-time.',
  openGraph: {
    title: 'Building Journey - Superoptimised',
    description: 'Follow the complete building journey. Every decision documented, every lesson shared.',
    type: 'website',
    images: ['/og-journey.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Building Journey - Superoptimised',
    description: 'Follow the complete building journey. Every decision documented, every lesson shared.',
    images: ['/og-journey.jpg'],
  },
};

export default function Journey() {
  return <JourneyPage />;
}