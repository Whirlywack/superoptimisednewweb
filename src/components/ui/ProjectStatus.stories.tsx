import type { Meta, StoryObj } from "@storybook/react";
import { ProjectStatus, ProjectPhase, BuildingStatus } from "./ProjectStatus";
import { Card, CardHeader, CardContent } from "../molecules/Card";

const meta: Meta<typeof ProjectStatus> = {
  title: "Design System/ProjectStatus",
  component: ProjectStatus,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Project status components for indicating the current state of projects and builds. Includes status badges, phase tracking, and building status displays.",
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: ["concept", "planning", "in-progress", "paused", "complete", "archived", "featured"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    showIcon: {
      control: "boolean",
    },
    showLabel: {
      control: "boolean",
    },
    animated: {
      control: "boolean",
    },
  },
};

export default meta;

type ProjectStatusStory = StoryObj<typeof ProjectStatus>;
type ProjectPhaseStory = StoryObj<typeof ProjectPhase>;
type BuildingStatusStory = StoryObj<typeof BuildingStatus>;

// Basic ProjectStatus Stories
export const ProjectStatusDefault: ProjectStatusStory = {
  render: (args) => <ProjectStatus {...args} />,
  args: {
    status: "in-progress",
  },
};

export const ProjectStatusAll: ProjectStatusStory = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ProjectStatus status="concept" />
      <ProjectStatus status="planning" />
      <ProjectStatus status="in-progress" animated />
      <ProjectStatus status="paused" />
      <ProjectStatus status="complete" />
      <ProjectStatus status="archived" />
      <ProjectStatus status="featured" />
    </div>
  ),
};

export const ProjectStatusSizes: ProjectStatusStory = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ProjectStatus status="in-progress" size="sm" />
        <ProjectStatus status="in-progress" size="md" />
        <ProjectStatus status="in-progress" size="lg" />
      </div>
      
      <div className="flex items-center gap-3">
        <ProjectStatus status="complete" size="sm" />
        <ProjectStatus status="complete" size="md" />
        <ProjectStatus status="complete" size="lg" />
      </div>
    </div>
  ),
};

export const ProjectStatusVariations: ProjectStatusStory = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">With Icon and Label</p>
        <div className="flex gap-3">
          <ProjectStatus status="concept" showIcon showLabel />
          <ProjectStatus status="in-progress" showIcon showLabel animated />
          <ProjectStatus status="complete" showIcon showLabel />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Icon Only</p>
        <div className="flex gap-3">
          <ProjectStatus status="concept" showIcon={true} showLabel={false} />
          <ProjectStatus status="in-progress" showIcon={true} showLabel={false} animated />
          <ProjectStatus status="complete" showIcon={true} showLabel={false} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Label Only</p>
        <div className="flex gap-3">
          <ProjectStatus status="concept" showIcon={false} showLabel />
          <ProjectStatus status="in-progress" showIcon={false} showLabel />
          <ProjectStatus status="complete" showIcon={false} showLabel />
        </div>
      </div>
    </div>
  ),
};

// ProjectPhase Stories
export const ProjectPhaseDefault: ProjectPhaseStory = {
  render: (args) => <ProjectPhase {...args} className="max-w-sm" />,
  args: {
    currentPhase: "in-progress",
  },
};

export const ProjectPhaseCompact: ProjectPhaseStory = {
  render: () => (
    <div className="space-y-4">
      <ProjectPhase currentPhase="concept" compact />
      <ProjectPhase currentPhase="planning" compact />
      <ProjectPhase currentPhase="in-progress" compact />
      <ProjectPhase currentPhase="complete" compact />
    </div>
  ),
};

export const ProjectPhaseCustom: ProjectPhaseStory = {
  render: () => (
    <ProjectPhase
      currentPhase="in-progress"
      phases={[
        { 
          phase: "concept", 
          label: "Ideation", 
          description: "Initial concept and research",
          completedAt: "2 weeks ago"
        },
        { 
          phase: "planning", 
          label: "Design", 
          description: "UX/UI design and architecture",
          completedAt: "1 week ago"
        },
        { 
          phase: "in-progress", 
          label: "Development", 
          description: "Implementation and testing"
        },
        { 
          phase: "complete", 
          label: "Launch", 
          description: "Deployment and monitoring"
        },
      ]}
      className="max-w-md"
    />
  ),
};

export const ProjectPhaseNoProgress: ProjectPhaseStory = {
  render: () => (
    <ProjectPhase
      currentPhase="planning"
      showProgress={false}
      className="max-w-sm"
    />
  ),
};

// BuildingStatus Stories
export const BuildingStatusDefault: BuildingStatusStory = {
  render: (args) => <BuildingStatus {...args} className="max-w-sm" />,
  args: {
    project: "Design System Components",
    status: "in-progress",
    progress: 75,
    lastUpdated: "2 hours ago",
    nextMilestone: "Complete molecule components",
  },
};

export const BuildingStatusVariants: BuildingStatusStory = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <BuildingStatus
        project="Component Library"
        status="in-progress"
        progress={85}
        lastUpdated="30 minutes ago"
        nextMilestone="Organism components"
      />
      
      <BuildingStatus
        project="Documentation Site"
        status="planning"
        lastUpdated="1 day ago"
        nextMilestone="Content strategy"
      />
      
      <BuildingStatus
        project="Mobile App"
        status="concept"
        lastUpdated="3 days ago"
        nextMilestone="User research"
      />
      
      <BuildingStatus
        project="API Integration"
        status="complete"
        progress={100}
        lastUpdated="1 week ago"
      />
    </div>
  ),
};

export const BuildingStatusMinimal: BuildingStatusStory = {
  render: () => (
    <div className="space-y-3 max-w-sm">
      <BuildingStatus
        project="Quick Prototype"
        status="in-progress"
        showDetails={false}
      />
      
      <BuildingStatus
        project="Bug Fixes"
        status="complete"
        showDetails={false}
      />
    </div>
  ),
};

// Real-world Examples
export const ProjectPortfolioCards = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-h3">Superoptimised Web</h3>
            <ProjectStatus status="in-progress" size="sm" animated />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Personal website and blog showcasing projects and thoughts on web development.
          </p>
          <ProjectPhase currentPhase="in-progress" compact />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-h3">Component Library</h3>
            <ProjectStatus status="featured" size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Reusable React components following atomic design principles.
          </p>
          <ProjectPhase currentPhase="complete" compact />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-h3">Mobile Analytics</h3>
            <ProjectStatus status="concept" size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Native mobile app for tracking user engagement and performance metrics.
          </p>
          <ProjectPhase currentPhase="concept" compact />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-h3">API Gateway</h3>
            <ProjectStatus status="paused" size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Microservices gateway for handling authentication and rate limiting.
          </p>
          <ProjectPhase currentPhase="planning" compact />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-h3">E-commerce Platform</h3>
            <ProjectStatus status="complete" size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Full-stack e-commerce solution with payment processing and inventory management.
          </p>
          <ProjectPhase currentPhase="complete" compact />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-h3">Legacy Migration</h3>
            <ProjectStatus status="archived" size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Migration of legacy PHP application to modern React/Node.js stack.
          </p>
          <ProjectPhase currentPhase="complete" compact />
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world project portfolio showing different project statuses and phases.",
      },
    },
  },
};

/*
export const CurrentFocusSection: Story = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-h2 mb-2">What I'm Building</h2>
        <p className="text-muted-foreground">
          Current focus areas and active projects
        </p>
      </div>
      
      <BuildingStatus
        project="Superoptimised Design System"
        status="in-progress"
        progress={78}
        lastUpdated="2 hours ago"
        nextMilestone="Complete organism components and templates"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BuildingStatus
          project="Blog Platform"
          status="planning"
          lastUpdated="1 day ago"
          nextMilestone="Content management system"
          showDetails={false}
        />
        
        <BuildingStatus
          project="Portfolio Redesign"
          status="concept"
          lastUpdated: "3 days ago"
          nextMilestone="User experience research"
          showDetails={false}
        />
      </div>
      
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-h4 mb-3">Recent Completions</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Atomic Component Library</span>
            <ProjectStatus status="complete" size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Molecular Components</span>
            <ProjectStatus status="complete" size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Storybook Documentation</span>
            <ProjectStatus status="complete" size="sm" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Homepage section showing current building focus and recent completions.",
      },
    },
  },
};
*/