import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel, Select, Menu } from "./Dropdown";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  LogOut, 
  Edit, 
  Trash2, 
  Copy, 
  Share,
  Download,
  MoreHorizontal,
  ChevronDown 
} from "lucide-react";
import React from "react";

const meta: Meta = {
  title: "Design System/Molecules/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Dropdown components for creating menus, selects, and other overlay content. Includes keyboard navigation and accessibility features.",
      },
    },
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
    },
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
  },
};

export default meta;

type DropdownStory = StoryObj<typeof Dropdown>;
type SelectStory = StoryObj<typeof Select>;

// Basic Dropdown Stories
export const DropdownBasic: DropdownStory = {
  render: (args) => (
    <Dropdown
      {...args}
      trigger={
        <Button variant="outline">
          Open Menu
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      }
    >
      <DropdownItem>Profile</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownSeparator />
      <DropdownItem>Logout</DropdownItem>
    </Dropdown>
  ),
};

export const DropdownWithIcons: DropdownStory = {
  render: () => (
    <Dropdown
      trigger={
        <Button variant="outline">
          User Menu
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      }
    >
      <DropdownItem icon={<User className="w-4 h-4" />}>
        Profile
      </DropdownItem>
      <DropdownItem icon={<Settings className="w-4 h-4" />}>
        Settings
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={<LogOut className="w-4 h-4" />}>
        Logout
      </DropdownItem>
    </Dropdown>
  ),
};

export const DropdownWithShortcuts: DropdownStory = {
  render: () => (
    <Dropdown
      trigger={
        <Button variant="outline">
          Actions
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      }
    >
      <DropdownItem icon={<Edit className="w-4 h-4" />} shortcut="⌘E">
        Edit
      </DropdownItem>
      <DropdownItem icon={<Copy className="w-4 h-4" />} shortcut="⌘C">
        Copy
      </DropdownItem>
      <DropdownItem icon={<Share className="w-4 h-4" />} shortcut="⌘S">
        Share
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem icon={<Trash2 className="w-4 h-4" />} shortcut="⌫">
        Delete
      </DropdownItem>
    </Dropdown>
  ),
};

export const DropdownWithLabels: DropdownStory = {
  render: () => (
    <Dropdown
      trigger={
        <Button variant="outline">
          Options
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      }
    >
      <DropdownLabel>Account</DropdownLabel>
      <DropdownItem icon={<User className="w-4 h-4" />}>Profile</DropdownItem>
      <DropdownItem icon={<Settings className="w-4 h-4" />}>Settings</DropdownItem>
      
      <DropdownSeparator />
      
      <DropdownLabel>Actions</DropdownLabel>
      <DropdownItem icon={<Download className="w-4 h-4" />}>Download</DropdownItem>
      <DropdownItem icon={<Share className="w-4 h-4" />}>Share</DropdownItem>
      
      <DropdownSeparator />
      
      <DropdownItem icon={<LogOut className="w-4 h-4" />}>Logout</DropdownItem>
    </Dropdown>
  ),
};

export const DropdownWithDisabled: DropdownStory = {
  render: () => (
    <Dropdown
      trigger={
        <Button variant="outline">
          File Menu
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      }
    >
      <DropdownItem>New File</DropdownItem>
      <DropdownItem>Open</DropdownItem>
      <DropdownItem disabled>Save (No changes)</DropdownItem>
      <DropdownItem>Save As</DropdownItem>
      <DropdownSeparator />
      <DropdownItem>Close</DropdownItem>
    </Dropdown>
  ),
};

export const DropdownAlignments: DropdownStory = {
  render: () => (
    <div className="flex gap-4 justify-center">
      <Dropdown
        align="start"
        trigger={<Button variant="outline">Align Start</Button>}
      >
        <DropdownItem>Option 1</DropdownItem>
        <DropdownItem>Option 2</DropdownItem>
        <DropdownItem>Option 3</DropdownItem>
      </Dropdown>
      
      <Dropdown
        align="center"
        trigger={<Button variant="outline">Align Center</Button>}
      >
        <DropdownItem>Option 1</DropdownItem>
        <DropdownItem>Option 2</DropdownItem>
        <DropdownItem>Option 3</DropdownItem>
      </Dropdown>
      
      <Dropdown
        align="end"
        trigger={<Button variant="outline">Align End</Button>}
      >
        <DropdownItem>Option 1</DropdownItem>
        <DropdownItem>Option 2</DropdownItem>
        <DropdownItem>Option 3</DropdownItem>
      </Dropdown>
    </div>
  ),
};

// Select Component Stories
export const SelectBasic: SelectStory = {
  render: (args) => <Select {...args} className="w-48" />,
  args: {
    placeholder: "Choose an option",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
      { value: "date", label: "Date" },
    ],
  },
};

export const SelectWithDefault: SelectStory = {
  render: () => (
    <Select
      className="w-48"
      defaultValue="medium"
      options={[
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "xl", label: "Extra Large" },
      ]}
    />
  ),
};

export const SelectWithDisabledOptions: SelectStory = {
  render: () => (
    <Select
      className="w-48"
      placeholder="Select a plan"
      options={[
        { value: "free", label: "Free Plan" },
        { value: "pro", label: "Pro Plan" },
        { value: "enterprise", label: "Enterprise Plan", disabled: true },
        { value: "custom", label: "Custom Plan", disabled: true },
      ]}
    />
  ),
};

function ControlledSelectDemo() {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-4">
      <Select
        className="w-48"
        value={value}
        onChange={setValue}
        placeholder="Select a color"
        options={[
          { value: "red", label: "Red" },
          { value: "green", label: "Green" },
          { value: "blue", label: "Blue" },
          { value: "yellow", label: "Yellow" },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        Selected value: {value || "None"}
      </p>
    </div>
  );
}

export const ControlledSelect = {
  render: () => <ControlledSelectDemo />,
  parameters: {
    docs: {
      description: {
        story: "Controlled select component showing how to manage the selected value externally.",
      },
    },
  },
};

// Menu Component Stories
export const ContextMenu: DropdownStory = {
  render: () => (
    <div className="flex gap-4">
      <Menu
        trigger={
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        }
      >
        <DropdownItem icon={<Edit className="w-4 h-4" />}>Edit</DropdownItem>
        <DropdownItem icon={<Copy className="w-4 h-4" />}>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon={<Trash2 className="w-4 h-4" />}>Delete</DropdownItem>
      </Menu>
      
      <Menu
        align="end"
        trigger={
          <Button variant="outline">
            File Options
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        }
      >
        <DropdownItem icon={<Download className="w-4 h-4" />}>Download</DropdownItem>
        <DropdownItem icon={<Share className="w-4 h-4" />}>Share</DropdownItem>
        <DropdownItem icon={<Copy className="w-4 h-4" />}>Copy Link</DropdownItem>
        <DropdownSeparator />
        <DropdownItem icon={<Edit className="w-4 h-4" />}>Rename</DropdownItem>
        <DropdownItem icon={<Trash2 className="w-4 h-4" />}>Delete</DropdownItem>
      </Menu>
    </div>
  ),
};

// Real-world Examples
function TableRowActionsDemo() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th>
            <th className="w-12 p-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-3 font-medium">{user.name}</td>
              <td className="p-3 text-muted-foreground">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">
                <Menu
                  align="end"
                  trigger={
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  }
                >
                  <DropdownItem icon={<User className="w-4 h-4" />}>
                    View Profile
                  </DropdownItem>
                  <DropdownItem icon={<Edit className="w-4 h-4" />}>
                    Edit User
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem icon={<Trash2 className="w-4 h-4" />}>
                    Delete User
                  </DropdownItem>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const TableRowActions = {
  render: () => <TableRowActionsDemo />,
  parameters: {
    docs: {
      description: {
        story: "Real-world example showing dropdown menus used for row actions in a table interface.",
      },
    },
  },
};

function FormWithSelectsDemo() {
  const [country, setCountry] = React.useState("");
  const [timezone, setTimezone] = React.useState("");

  return (
    <form className="max-w-md space-y-4">
      <div>
        <h3 className="text-h3 mb-4">User Preferences</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Country</label>
        <Select
          value={country}
          onChange={setCountry}
          placeholder="Select your country"
          options={[
            { value: "us", label: "United States" },
            { value: "ca", label: "Canada" },
            { value: "uk", label: "United Kingdom" },
            { value: "au", label: "Australia" },
            { value: "de", label: "Germany" },
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Timezone</label>
        <Select
          value={timezone}
          onChange={setTimezone}
          placeholder="Select your timezone"
          options={[
            { value: "pst", label: "Pacific Time (PST)" },
            { value: "mst", label: "Mountain Time (MST)" },
            { value: "cst", label: "Central Time (CST)" },
            { value: "est", label: "Eastern Time (EST)" },
            { value: "utc", label: "UTC" },
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Language</label>
        <Select
          defaultValue="en"
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
            { value: "fr", label: "Français" },
            { value: "de", label: "Deutsch" },
            { value: "zh", label: "中文", disabled: true },
          ]}
        />
      </div>
      
      <Button type="submit" className="w-full">
        Save Preferences
      </Button>
    </form>
  );
}

export const FormWithSelects = {
  render: () => <FormWithSelectsDemo />,
  parameters: {
    docs: {
      description: {
        story: "Example showing select components used within a form for user preferences.",
      },
    },
  },
};