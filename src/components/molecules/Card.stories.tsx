import type { Meta, StoryObj } from "@storybook/react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  ImageCard, 
  StatCard, 
  ActionCard 
} from "./Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Tag";
import { Avatar } from "./Avatar";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  MapPin,
  Clock,
  Star,
  Download,
  Share,
  Heart,
  MessageSquare,
  Bookmark
} from "lucide-react";

const meta: Meta = {
  title: "Design System/Molecules/Card",
  component: Card,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Card components for displaying content in containers. Includes specialized variants for images, statistics, and actions.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "filled"],
    },
    hover: {
      control: "boolean",
    },
    clickable: {
      control: "boolean",
    },
  },
};

export default meta;

type CardStory = StoryObj<typeof Card>;
type ImageCardStory = StoryObj<typeof ImageCard>;
type StatCardStory = StoryObj<typeof StatCard>;
type ActionCardStory = StoryObj<typeof ActionCard>;

// Basic Card Stories
export const CardDefault: CardStory = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          This is a basic card component with header, content, and footer sections.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm">
          Card content goes here. You can add any content like text, images, forms, or other components.
        </p>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full">Action Button</Button>
      </CardFooter>
    </Card>
  ),
  args: {},
};

export const CardVariants: CardStory = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="default" className="max-w-sm">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>A card with default styling including shadow and border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Default variant content.</p>
        </CardContent>
      </Card>
      
      <Card variant="outline" className="max-w-sm">
        <CardHeader>
          <CardTitle>Outline Card</CardTitle>
          <CardDescription>A card with only border and no background.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Outline variant content.</p>
        </CardContent>
      </Card>
      
      <Card variant="filled" className="max-w-sm">
        <CardHeader>
          <CardTitle>Filled Card</CardTitle>
          <CardDescription>A card with filled background and no border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Filled variant content.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const CardWithHover: CardStory = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card hover className="max-w-sm">
        <CardHeader>
          <CardTitle>Hover Effect</CardTitle>
          <CardDescription>This card has hover effects enabled.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Hover over this card to see the effect.</p>
        </CardContent>
      </Card>
      
      <Card clickable className="max-w-sm">
        <CardHeader>
          <CardTitle>Clickable Card</CardTitle>
          <CardDescription>This card appears clickable with cursor pointer.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This card looks clickable.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// Image Card Stories
export const ImageCardBasic: ImageCardStory = {
  render: (args) => (
    <ImageCard {...args} className="max-w-sm" />
  ),
  args: {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop",
    alt: "Beautiful landscape",
    title: "Mountain Landscape", 
    description: "A breathtaking view of mountains during sunset.",
  },
};

export const ImageCardAspectRatios: ImageCardStory = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
        alt="Square image"
        title="Square Ratio"
        description="1:1 aspect ratio"
        aspectRatio="square"
        className="max-w-xs"
      />
      
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop"
        alt="Video ratio image"
        title="Video Ratio"
        description="16:9 aspect ratio"
        aspectRatio="video"
        className="max-w-xs"
      />
      
      <ImageCard
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop"
        alt="Portrait image"
        title="Portrait Ratio"
        description="3:4 aspect ratio"
        aspectRatio="portrait"
        className="max-w-xs"
      />
    </div>
  ),
};

export const ImageCardWithFooter: ImageCardStory = {
  render: () => (
    <ImageCard
      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop"
      alt="Beautiful landscape"
      title="Mountain Adventure"
      description="Explore the breathtaking mountain ranges."
      className="max-w-sm"
    >
      <CardFooter className="gap-2">
        <Button size="sm" className="flex-1">
          <Heart className="w-4 h-4 mr-2" />
          Like
        </Button>
        <Button size="sm" variant="outline">
          <Bookmark className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Share className="w-4 h-4" />
        </Button>
      </CardFooter>
    </ImageCard>
  ),
};

// Stat Card Stories
export const StatCardBasic: StatCardStory = {
  render: (args) => <StatCard {...args} className="max-w-xs" />,
  args: {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "from last month",
    trend: {
      value: 20.1,
      direction: "up",
      label: "from last month",
    },
    icon: <DollarSign className="h-4 w-4" />,
  },
};

export const StatCardGrid: StatCardStory = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Users"
        value="2,345"
        trend={{ value: 12.5, direction: "up" }}
        icon={<Users className="h-4 w-4" />}
      />
      
      <StatCard
        title="Revenue"
        value="$45,231"
        description="this month"
        trend={{ value: 8.2, direction: "up" }}
        icon={<DollarSign className="h-4 w-4" />}
      />
      
      <StatCard
        title="Active Sessions"
        value="1,234"
        trend={{ value: 2.1, direction: "down" }}
        icon={<Activity className="h-4 w-4" />}
      />
      
      <StatCard
        title="Conversion Rate"
        value="3.2%"
        trend={{ value: 0, direction: "neutral" }}
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </div>
  ),
};

// Action Card Stories
export const ActionCardBasic: ActionCardStory = {
  render: (args) => (
    <ActionCard {...args} className="max-w-sm" />
  ),
  args: {
    title: "Deploy Application",
    description: "Deploy your application to production with one click.",
    icon: <Activity className="h-5 w-5 text-primary" />,
    action: <Button className="w-full">Deploy Now</Button>,
  },
};

export const ActionCardWithBadge: ActionCardStory = {
  render: () => (
    <ActionCard
      title="New Feature Available"
      description="Try out our latest feature that improves your workflow."
      icon={<Star className="h-5 w-5 text-primary" />}
      badge={<Badge variant="success" size="sm">New</Badge>}
      action={
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1">Learn More</Button>
          <Button className="flex-1">Try Now</Button>
        </div>
      }
      className="max-w-sm"
    />
  ),
};

export const ActionCardList: ActionCardStory = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <ActionCard
        title="Backup Complete"
        description="Your data has been successfully backed up to the cloud."
        icon={<Download className="h-5 w-5 text-primary" />}
        badge={<Badge variant="default" size="sm">Complete</Badge>}
        action={<Button variant="outline" size="sm">View Details</Button>}
      />
      
      <ActionCard
        title="System Update Available"
        description="A new system update is ready to install."
        icon={<Activity className="h-5 w-5 text-primary" />}
        badge={<Badge variant="default" size="sm">Update</Badge>}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Later</Button>
            <Button size="sm">Install Now</Button>
          </div>
        }
      />
      
      <ActionCard
        title="Storage Almost Full"
        description="You're using 95% of your storage space."
        icon={<Activity className="h-5 w-5 text-warm-gray" />}
        badge={<Badge variant="warning" size="sm">Warning</Badge>}
        action={<Button variant="outline" size="sm">Manage Storage</Button>}
      />
    </div>
  ),
};

// Real-world Examples
export const ProductCard = {
  render: () => (
    <Card hover clickable className="max-w-sm">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
          alt="Wireless Headphones"
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="warning" size="sm">-20%</Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-base">Wireless Headphones</CardTitle>
        <CardDescription>Premium noise-canceling headphones</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">$199</span>
            <span className="text-sm text-muted-foreground line-through">$249</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm">4.8</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "E-commerce product card with image, pricing, rating, and action button.",
      },
    },
  },
};

export const UserProfileCard = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar
            size="xl"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            fallback="John Doe"
          />
        </div>
        <CardTitle>John Doe</CardTitle>
        <CardDescription>Software Engineer at TechCorp</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Joined March 2021</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Last seen 2 hours ago</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          <MessageSquare className="w-4 h-4 mr-2" />
          Message
        </Button>
        <Button className="flex-1">Follow</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "User profile card with avatar, bio, metadata, and action buttons.",
      },
    },
  },
};

export const EventCard = {
  render: () => (
    <Card hover className="max-w-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Design System Workshop</CardTitle>
            <CardDescription>Learn to build scalable design systems</CardDescription>
          </div>
          <Badge variant="success" size="sm">Free</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>March 15, 2024 at 2:00 PM</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>Online Event</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>142 attending</span>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Join us for an interactive workshop on building design systems that scale across teams and products.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button className="flex-1">Register Now</Button>
        <Button variant="outline" size="sm">
          <Share className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "Event card with details, metadata, and registration actions.",
      },
    },
  },
};