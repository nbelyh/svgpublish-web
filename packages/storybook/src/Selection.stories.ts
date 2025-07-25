import type { Meta, StoryObj } from "@storybook/react";

import { SvgPublishComponent } from "svgpublish-react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Basic/Selection",
  component: SvgPublishComponent,
  tags: ["autodocs"],
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
    enableZoomCtrl: true,
  },
} satisfies Meta<typeof SvgPublishComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "enableSelection",
        "enableHover",
        "enableBlur",
        "blur",
        "enableDilate",
        "dilate",
        "selectionMode",
        "selectionColor",
        "hoverColor",
        "hyperlinkColor",
        "enableBoxSelection",
      ],
    },
  },
  args: {},
};

export const BoxSelection: Story = {
  parameters: {
    controls: { include: ["selectionColor", "hoverColor", "enableBoxSelection"] },
  },
  args: {
    selectionColor: "rgba(0, 50, 255, 0.8)",
    hoverColor: "rgba(0, 50, 255, 0.4)",
    enableBoxSelection: true,
  },
};

export const RedColor: Story = {
  parameters: {
    controls: { include: ["selectionColor", "hoverColor", "hyperlinkColor"] },
  },
  args: {
    selectionColor: "rgba(255, 0, 0, 0.8)",
    hoverColor: "rgba(255, 0, 0, 0.4)",
    hyperlinkColor: "rgba(0, 255, 0, 0.8)",
  },
};

export const Thin: Story = {
  parameters: {
    controls: { include: ["dilate"] },
  },
  args: {
    dilate: 1,
    enableDilate: true,
    blur: 0,
    enableBlur: false,
    selectionColor: "rgba(255, 0, 0, 0.8)",
  },
};

export const SelectionFillDarken: Story = {
  parameters: {
    controls: {
      include: ["selectionMode", "selectionColor", "dilate", "enableDilate"],
    },
  },
  args: {
    selectionMode: "darken",
    dilate: 0,
    enableDilate: false,
    enableBlur: false,
    selectionColor: "rgba(255, 255, 0, 0.5)",
  },
};

export const SelectionFillLighten: Story = {
  parameters: {
    controls: {
      include: ["selectionMode", "selectionColor", "dilate", "enableDilate"],
    },
  },
  args: {
    selectionMode: "lighten",
    dilate: 0,
    enableDilate: false,
    enableBlur: false,
    selectionColor: "rgba(255, 255, 0, 0.5)",
    selectedShapeId: "shape4",
  },
};

export const EventSelectionChanged: Story = {
  parameters: {
    layout: "fullscreen",
    controls: { include: ["onSelectionChanged"] },
  },
  argTypes: {
    onSelectionChanged: {
      action: "onSelectionChanged",
    },
  },
};

export const SetSelection: Story = {
  parameters: {
    controls: { include: ["selectedShapeId"] },
  },
  args: {
    selectedShapeId: "shape4",
  },
  argTypes: {
    selectedShapeId: {
      control: "select",
      options: [
        "shape1",
        "shape2",
        "shape3",
        "shape4",
        "shape5",
        "shape6",
        "shape8",
        "shape9",
      ],
    },
  },
};
