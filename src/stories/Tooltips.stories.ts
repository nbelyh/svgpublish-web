import type { Meta, StoryObj } from "@storybook/react";

import { SvgPublishComponent } from "../../lib/SvgPublishComponent";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Basic/Tooltips",
  component: SvgPublishComponent,
  tags: ["autodocs"],
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
        "tooltipOutsideClick",
        "tooltipDelay",
        "tooltipDelayShow",
        "tooltipDelayHide",
      ]
    },
  },
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
    tooltipPlacement: 'bottom',
    tooltipUseMousePosition: false,
    tooltipOutsideClick: true
  },
};
