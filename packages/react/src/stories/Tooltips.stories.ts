import type { Meta, StoryObj } from "@storybook/react";

import { SvgPublishComponent } from "../../component/SvgPublishComponent";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Basic/Tooltips",
  component: SvgPublishComponent,
  tags: ["autodocs"],
  args: {
    url: "/assets/tooltips.svg",
    enablePan: true,
    enableZoom: true,
    twoFingersTouch: true,
    enableZoomCtrl: true,
    height: "80vh",

    enableTooltips: true,
    tooltipDelay: false,
    tooltipDelayShow: 500,
    tooltipDelayHide: 100,
    tooltipTrigger: 'mouseenter',
    tooltipPlacement: 'top',
    tooltipUseMousePosition: false,
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
        "enableTooltips",
        "tooltipTrigger",
        "tooltipPlacement",
        "tooltipUseMousePosition",
        "tooltipDelay",
        "tooltipDelayShow",
        "tooltipDelayHide",
      ]
    },
  },
};

export const Delay: Story = {

  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        "enableTooltips",
        "tooltipDelay",
        "tooltipDelayShow",
        "tooltipDelayHide",
      ]
    },
  },
  args: {
    tooltipDelay: true,
  },
};

export const UseMousePosition: Story = {

  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        "useMousePosition",
      ]
    },
  },
  args: {
    tooltipUseMousePosition: true,
  },
};

export const Interactive: Story = {

  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        "useMousePosition",
      ]
    },
  },
  args: {
    tooltipInteractive: true,
  },
};

export const Theme: Story = {

  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        'tooltipTheme',
      ]
    },
  },
  args: {
    tooltipUseMousePosition: true,
    tooltipTheme: 'light',
  },
};

export const Markdown: Story = {

  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "url",
        'tooltipMarkdown',
        'enableTooltipMarkdown',
      ]
    },
  },
  args: {
    enableTooltipMarkdown: true,
    tooltipInteractive: true,
    tooltipTheme: 'light',
    tooltipMarkdown: 'This is a **markdown** tooltip with a [link](https://www.google.com). <br>The shape comment is: {{Comment}}',
  },
};
