import type { Meta, StoryObj } from "@storybook/react";

import { SvgPublishComponent } from "svgpublish-react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Basic/Disable Things",
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
    url: "/assets/CustomerFlow.svg",
    enableSelection: true,
    enableHover: true,
    height: "80vh",
    selectionMode: "normal",
    enableDilate: true,
    dilate: 2,
    enableBlur: true,
    blur: 2,
    enableBoxSelection: false,
    selectedShapeId: "shape2",
    enablePan: true,
    enableZoom: true,
    twoFingersTouch: true,
    enableZoomCtrl: true,
  },
} satisfies Meta<typeof SvgPublishComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Enabled: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: ["enableSelection", "enableHover", "enablePan", "enableZoom"],
    },
  },
  args: {},
};

export const DisableSelection: Story = {
  parameters: {
    controls: { include: ["enableSelection"] },
  },
  args: {
    enableSelection: false,
    enableHover: true,
  },
};

export const DisableHover: Story = {
  parameters: {
    controls: { include: ["enableHover"] },
  },
  args: {
    enableSelection: true,
    enableHover: false,
  },
};

export const DisableHoverAndSelection: Story = {
  parameters: {
    controls: { include: ["enableHover", "enableSelection"] },
  },
  args: {
    enableSelection: false,
    enableHover: false,
  },
};
