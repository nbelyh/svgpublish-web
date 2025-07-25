import type { Meta, StoryObj } from "@storybook/react";

import { SvgPublishComponent } from "svgpublish-react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Basic/Links",
  component: SvgPublishComponent,
  argTypes: {
    selectionMode: {
      control: "select",
      options: ["normal", "lighten", "darken"],
    },
  },
  parameters: {
    layout: "fullscreen",
  },
  args: {
    url: "/assets/Links.svg",
    height: "80vh",
    selectionMode: "normal",
    enableDilate: true,
    enableBlur: true,
    enableBoxSelection: false,
    enableFollowHyperlinks: true,
    enableSelection: false,
    enablePan: false,
    enableHover: true,
  },
} satisfies Meta<typeof SvgPublishComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  parameters: {
    controls: { include: ["enableFollowHyperlinks"] },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const OpenInNew: Story = {
  parameters: {
    controls: {
      include: ["enableFollowHyperlinks", "openHyperlinksInNewWindow"],
    },
  },
  args: {
    openHyperlinksInNewWindow: true,
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const MetroSBahn: Story = {
  parameters: {
    controls: {
      include: ["enableFollowHyperlinks", "openHyperlinksInNewWindow"],
    },
  },
  args: {
    url: "/assets/ViennaSbahn.svg",
    openHyperlinksInNewWindow: true,
    enablePan: true,
    enableZoom: true,
  },
};
