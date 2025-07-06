import type { Meta, StoryObj } from "@storybook/react";
import HomePage from "./page";

const meta = {
  title: "Pages/Homepage",
  component: HomePage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Main homepage matching the HTML mockup design with proper brutalist typography and left-aligned sections.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Complete homepage with navigation, hero section, building philosophy, community proof, newsletter signup, and footer. All sections now use proper typography hierarchy and alignment to match the design mockup.",
      },
    },
  },
};