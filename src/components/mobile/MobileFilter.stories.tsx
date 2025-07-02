import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MobileFilter, QuickFilter, FilterGroup, FilterOption } from './MobileFilter';

const meta = {
  title: 'Mobile/MobileFilter',
  component: MobileFilter,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Touch-optimized filter component for mobile devices. Features slide-out drawer, collapsible groups, and large touch targets.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    groups: {
      control: 'object',
      description: 'Filter groups with options',
    },
    selectedFilters: {
      control: 'object',
      description: 'Currently selected filter values',
    },
    onFilterChange: {
      action: 'filterChanged',
      description: 'Callback when filter selection changes',
    },
    onApplyFilters: {
      action: 'filtersApplied',
      description: 'Callback when apply button is clicked',
    },
    onClearFilters: {
      action: 'filtersCleared',
      description: 'Callback when clear button is clicked',
    },
    showApplyButton: {
      control: 'boolean',
      description: 'Show apply filters button',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear all button',
    },
  },
} satisfies Meta<typeof MobileFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleFilterGroups: FilterGroup[] = [
  {
    id: 'category',
    label: 'Category',
    options: [
      { id: 'tech', label: 'Technology', value: 'technology', count: 45 },
      { id: 'design', label: 'Design', value: 'design', count: 23 },
      { id: 'business', label: 'Business', value: 'business', count: 67 },
      { id: 'marketing', label: 'Marketing', value: 'marketing', count: 34 },
    ],
    multiple: true,
  },
  {
    id: 'difficulty',
    label: 'Difficulty Level',
    options: [
      { id: 'beginner', label: 'Beginner', value: 'beginner', count: 89 },
      { id: 'intermediate', label: 'Intermediate', value: 'intermediate', count: 56 },
      { id: 'advanced', label: 'Advanced', value: 'advanced', count: 23 },
    ],
    multiple: false,
  },
  {
    id: 'duration',
    label: 'Duration',
    options: [
      { id: 'short', label: 'Under 1 hour', value: 'short', count: 34 },
      { id: 'medium', label: '1-3 hours', value: 'medium', count: 78 },
      { id: 'long', label: '3+ hours', value: 'long', count: 45 },
    ],
    multiple: true,
  },
  {
    id: 'price',
    label: 'Price Range',
    options: [
      { id: 'free', label: 'Free', value: 'free', count: 123 },
      { id: 'under50', label: 'Under $50', value: 'under50', count: 67 },
      { id: 'under100', label: 'Under $100', value: 'under100', count: 34 },
      { id: 'premium', label: '$100+', value: 'premium', count: 12 },
    ],
    multiple: false,
  },
];

export const Default: Story = {
  render: () => {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    const handleFilterChange = (groupId: string, values: string[]) => {
      setSelectedFilters(prev => ({
        ...prev,
        [groupId]: values,
      }));
    };

    const handleApplyFilters = () => {
      console.log('Applied filters:', selectedFilters);
    };

    const handleClearFilters = () => {
      setSelectedFilters({});
    };

    return (
      <div className="p-4 bg-off-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-h2 font-bold text-off-black">Course Library</h1>
          <MobileFilter
            groups={sampleFilterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
        
        <div className="space-y-4">
          {Object.keys(selectedFilters).length > 0 && (
            <div className="p-4 bg-light-gray rounded-lg">
              <h3 className="font-semibold text-off-black mb-2">Active Filters:</h3>
              <pre className="text-small text-warm-gray">
                {JSON.stringify(selectedFilters, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 bg-white rounded-lg border border-light-gray">
                <h3 className="font-semibold text-off-black mb-2">Course Title {i}</h3>
                <p className="text-warm-gray mb-3">
                  Course description goes here. This would show relevant courses based on the selected filters.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-small rounded">Technology</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-small rounded">Intermediate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

export const ProductFilters: Story = {
  render: () => {
    const productFilters: FilterGroup[] = [
      {
        id: 'brand',
        label: 'Brand',
        options: [
          { id: 'apple', label: 'Apple', value: 'apple', count: 156 },
          { id: 'samsung', label: 'Samsung', value: 'samsung', count: 89 },
          { id: 'google', label: 'Google', value: 'google', count: 45 },
          { id: 'oneplus', label: 'OnePlus', value: 'oneplus', count: 23 },
        ],
        multiple: true,
      },
      {
        id: 'price_range',
        label: 'Price Range',
        options: [
          { id: 'under300', label: 'Under $300', value: 'under300', count: 67 },
          { id: '300to600', label: '$300 - $600', value: '300to600', count: 89 },
          { id: '600to900', label: '$600 - $900', value: '600to900', count: 123 },
          { id: 'over900', label: 'Over $900', value: 'over900', count: 45 },
        ],
        multiple: false,
      },
      {
        id: 'features',
        label: 'Features',
        options: [
          { id: '5g', label: '5G Support', value: '5g', count: 234 },
          { id: 'wireless_charging', label: 'Wireless Charging', value: 'wireless_charging', count: 156 },
          { id: 'waterproof', label: 'Waterproof', value: 'waterproof', count: 189 },
          { id: 'face_id', label: 'Face ID', value: 'face_id', count: 98 },
        ],
        multiple: true,
      },
    ];

    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
      brand: ['apple'],
      features: ['5g', 'wireless_charging'],
    });

    return (
      <div className="p-4 bg-off-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-h2 font-bold text-off-black">Smartphones</h1>
          <MobileFilter
            groups={productFilters}
            selectedFilters={selectedFilters}
            onFilterChange={(groupId, values) => {
              setSelectedFilters(prev => ({ ...prev, [groupId]: values }));
            }}
            onApplyFilters={() => console.log('Product filters applied')}
            onClearFilters={() => setSelectedFilters({})}
          />
        </div>
        
        <p className="text-warm-gray mb-6">
          Showing 89 smartphones matching your criteria
        </p>
        
        <div className="grid gap-4">
          {['iPhone 15 Pro', 'Samsung Galaxy S24', 'Google Pixel 8'].map((phone) => (
            <div key={phone} className="p-4 bg-white rounded-lg border border-light-gray">
              <h3 className="font-semibold text-off-black mb-2">{phone}</h3>
              <p className="text-primary font-bold mb-2">$899</p>
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-small rounded">5G</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-small rounded">Wireless Charging</span>
              </div>
              <button className="w-full bg-primary text-off-white py-2 rounded-lg">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const QuickFilterExample: Story = {
  render: () => {
    const quickFilterOptions: FilterOption[] = [
      { id: 'all', label: 'All', value: 'all', count: 245 },
      { id: 'react', label: 'React', value: 'react', count: 89 },
      { id: 'vue', label: 'Vue', value: 'vue', count: 45 },
      { id: 'angular', label: 'Angular', value: 'angular', count: 34 },
      { id: 'svelte', label: 'Svelte', value: 'svelte', count: 23 },
      { id: 'next', label: 'Next.js', value: 'nextjs', count: 67 },
    ];

    const [selectedTags, setSelectedTags] = useState<string[]>(['react', 'nextjs']);

    return (
      <div className="p-4 bg-off-white min-h-screen">
        <h1 className="text-h2 font-bold text-off-black mb-6">Quick Filters</h1>
        
        <div className="mb-6">
          <h3 className="text-h4 font-semibold text-off-black mb-3">Filter by Technology</h3>
          <QuickFilter
            options={quickFilterOptions}
            selectedValues={selectedTags}
            onFilterChange={setSelectedTags}
            multiple={true}
          />
        </div>
        
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white rounded-lg border border-light-gray">
              <h3 className="font-semibold text-off-black mb-2">Project Example {i}</h3>
              <p className="text-warm-gray mb-3">
                A sample project using the selected technologies.
              </p>
              <div className="flex gap-2">
                {selectedTags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-small rounded">
                    {quickFilterOptions.find(opt => opt.value === tag)?.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const MinimalFilter: Story = {
  render: () => {
    const minimalGroups: FilterGroup[] = [
      {
        id: 'status',
        label: 'Status',
        options: [
          { id: 'active', label: 'Active', value: 'active' },
          { id: 'inactive', label: 'Inactive', value: 'inactive' },
          { id: 'pending', label: 'Pending', value: 'pending' },
        ],
        multiple: false,
      },
      {
        id: 'type',
        label: 'Type',
        options: [
          { id: 'user', label: 'User', value: 'user' },
          { id: 'admin', label: 'Admin', value: 'admin' },
          { id: 'guest', label: 'Guest', value: 'guest' },
        ],
        multiple: true,
      },
    ];

    const [filters, setFilters] = useState<Record<string, string[]>>({});

    return (
      <div className="p-4 bg-off-white min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-h2 font-bold text-off-black">User Management</h1>
          <MobileFilter
            groups={minimalGroups}
            selectedFilters={filters}
            onFilterChange={(groupId, values) => {
              setFilters(prev => ({ ...prev, [groupId]: values }));
            }}
            onApplyFilters={() => console.log('Filters applied')}
            onClearFilters={() => setFilters({})}
            showApplyButton={false}
            showClearButton={true}
          />
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 bg-white rounded-lg border border-light-gray flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-off-black">User {i}</h3>
                <p className="text-small text-warm-gray">user{i}@example.com</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-small rounded">Active</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-small rounded">Admin</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};