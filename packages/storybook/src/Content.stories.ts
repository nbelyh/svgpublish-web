import type { Meta, StoryObj } from "@storybook/react";

import { SvgPublishComponent } from "svgpublish-react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Basic/Content",
  component: SvgPublishComponent,
  tags: ["autodocs"],
  args: {
    url: "/assets/connected-highlight.svg",
    enablePan: true,
    enableZoom: true,
    twoFingersTouch: true,
    enableZoomCtrl: true,
    height: "80vh",

    enableContentMarkdown: true,
  },
} satisfies Meta<typeof SvgPublishComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        "enableContentMarkdown",
        "contentMarkdown",
      ]
    },
  },
  args: {
    enableContentMarkdown: true,
    contentMarkdown: "Text: {{Text}}<br/>Shape ID: {{ShapeId}}",
  },
};

export const SimpleText: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        "enableContentMarkdown",
        "contentMarkdown",
      ]
    },
  },
  args: {
    enableContentMarkdown: true,
    contentMarkdown: "{{Text}}",
  },
};

export const RichMarkdown: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        "enableContentMarkdown",
        "contentMarkdown",
      ]
    },
  },
  args: {
    enableContentMarkdown: true,
    contentMarkdown: "**Shape:** {{Text}}<br/>**ID:** {{ShapeId}}<br/> Extra Text",
  },
};

export const Disabled: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        "enableContentMarkdown",
        "contentMarkdown",
      ]
    },
  },
  args: {
    enableContentMarkdown: false,
    contentMarkdown: "This content should not appear",
  },
};
