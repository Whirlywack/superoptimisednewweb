import type { Meta, StoryObj } from '@storybook/react';
import { RatingInput, RatingScale, LikertScale } from './RatingInput';
import { useState } from 'react';

const meta: Meta<typeof RatingInput> = {
  title: 'UI/RatingInput',
  component: RatingInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['dot', 'number', 'star', 'emoji'],
    },
    color: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 5,
    variant: 'dot',
  },
};

export const Number: Story = {
  args: {
    value: 7,
    variant: 'number',
    selected: true,
  },
};

export const Star: Story = {
  args: {
    value: 5,
    variant: 'star',
    selected: true,
    color: 'warning',
  },
};

export const Emoji: Story = {
  args: {
    value: 8,
    variant: 'emoji',
    selected: true,
  },
};

export const Hovered: Story = {
  args: {
    value: 6,
    variant: 'number',
    hovered: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <RatingInput value={5} variant="number" size="sm" selected />
      <RatingInput value={5} variant="number" size="md" selected />
      <RatingInput value={5} variant="number" size="lg" selected />
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <RatingInput value={5} variant="number" color="default" selected />
      <RatingInput value={5} variant="number" color="primary" selected />
      <RatingInput value={5} variant="number" color="success" selected />
      <RatingInput value={5} variant="number" color="warning" selected />
      <RatingInput value={5} variant="number" color="danger" selected />
    </div>
  ),
};

// RatingScale Stories
export const RatingScaleStory: Story = {
  render: () => {
    const [value, setValue] = useState<number>(7);
    
    return (
      <RatingScale
        min={1}
        max={10}
        value={value}
        onChange={setValue}
        variant="number"
        labels={{
          min: 'Not at all',
          max: 'Extremely',
          mid: 'Somewhat'
        }}
        showValue={true}
      />
    );
  },
};

export const StarRating: Story = {
  render: () => {
    const [value, setValue] = useState<number>(4);
    
    return (
      <RatingScale
        min={1}
        max={5}
        value={value}
        onChange={setValue}
        variant="star"
        color="warning"
        labels={{
          min: 'Poor',
          max: 'Excellent'
        }}
      />
    );
  },
};

export const EmojiScale: Story = {
  render: () => {
    const [value, setValue] = useState<number>(6);
    
    return (
      <RatingScale
        min={1}
        max={10}
        value={value}
        onChange={setValue}
        variant="emoji"
        size="lg"
        labels={{
          min: 'Very Unsatisfied',
          max: 'Very Satisfied'
        }}
        showValue={true}
      />
    );
  },
};

export const CompactScale: Story = {
  render: () => {
    const [value, setValue] = useState<number>(3);
    
    return (
      <RatingScale
        min={1}
        max={5}
        value={value}
        onChange={setValue}
        variant="dot"
        size="sm"
        color="primary"
      />
    );
  },
};

// LikertScale Stories
export const LikertScaleStory: Story = {
  render: () => {
    const [value, setValue] = useState<string>('agree');
    
    return (
      <LikertScale
        value={value}
        onChange={setValue}
        options={[
          { value: 'strongly-disagree', label: 'Strongly Disagree', shortLabel: 'SD' },
          { value: 'disagree', label: 'Disagree', shortLabel: 'D' },
          { value: 'neutral', label: 'Neutral', shortLabel: 'N' },
          { value: 'agree', label: 'Agree', shortLabel: 'A' },
          { value: 'strongly-agree', label: 'Strongly Agree', shortLabel: 'SA' },
        ]}
      />
    );
  },
};

export const VerticalLikert: Story = {
  render: () => {
    const [value, setValue] = useState<string>('satisfied');
    
    return (
      <LikertScale
        value={value}
        onChange={setValue}
        layout="vertical"
        size="lg"
        options={[
          { value: 'very-dissatisfied', label: 'Very Dissatisfied' },
          { value: 'dissatisfied', label: 'Dissatisfied' },
          { value: 'neutral', label: 'Neutral' },
          { value: 'satisfied', label: 'Satisfied' },
          { value: 'very-satisfied', label: 'Very Satisfied' },
        ]}
      />
    );
  },
};

export const CustomLikert: Story = {
  render: () => {
    const [value, setValue] = useState<string>('sometimes');
    
    return (
      <LikertScale
        value={value}
        onChange={setValue}
        options={[
          { value: 'never', label: 'Never', shortLabel: '0%' },
          { value: 'rarely', label: 'Rarely', shortLabel: '25%' },
          { value: 'sometimes', label: 'Sometimes', shortLabel: '50%' },
          { value: 'often', label: 'Often', shortLabel: '75%' },
          { value: 'always', label: 'Always', shortLabel: '100%' },
        ]}
      />
    );
  },
};

export const DeveloperLikert: Story = {
  render: () => {
    const [value, setValue] = useState<string>('proficient');
    
    return (
      <LikertScale
        value={value}
        onChange={setValue}
        size="md"
        options={[
          { value: 'beginner', label: 'Beginner', shortLabel: '🌱' },
          { value: 'intermediate', label: 'Intermediate', shortLabel: '🌿' },
          { value: 'proficient', label: 'Proficient', shortLabel: '🌳' },
          { value: 'expert', label: 'Expert', shortLabel: '🏆' },
          { value: 'guru', label: 'Guru', shortLabel: '🧙‍♂️' },
        ]}
      />
    );
  },
};