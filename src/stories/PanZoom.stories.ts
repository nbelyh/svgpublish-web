import type { Meta, StoryObj } from '@storybook/react';

import { SvgPublishComponent } from '../../lib/SvgPublishComponent';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Basic/Pan Zoom',
  component: SvgPublishComponent,
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['normal', 'lighten', 'darken']
    }
  },
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    url: '/src/stories/assets/CustomerFlow.svg',
    enableSelection: true,
    enableHover: true,
    height: '80vh',
    selectionMode: 'normal',
    enableDilate: true,
    dilate: 2,
    enableBlur: true,
    blur: 2,
    enableBoxSelection: false,
    selectedShapeId: 'shape2',
  },
} satisfies Meta<typeof SvgPublishComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['enableSelection', 'enableHover', 'enablePan', 'enableZoom']}
  },
  args: {
  },
};

export const DisablePanAndZoom: Story = {
  parameters: {
    controls: { include: ['enablePan', 'enableZoom']}
  },
  args: {
    enablePan: false,
    enableZoom: false
  },
};


export const EnableOnlyPan: Story = {
  parameters: {
    controls: { include: ['enablePan', 'enableZoom']}
  },
  args: {
    enablePan: true,
    enableZoom: false
  },
};

export const EnableOnlyZoom: Story = {
  parameters: {
    controls: { include: ['enablePan', 'enableZoom']}
  },
  args: {
    enableZoom: true,
    enablePan: false
  },
};

export const RequireCtrlForZoom: Story = {
  parameters: {
    controls: { include: ['enableZoom', 'enableZoomCtrl']}
  },
  args: {
    enableZoom: true,
    enableZoomCtrl: true,
  },
}

export const RequireShiftForZoom: Story = {
  parameters: {
    controls: { include: ['enableZoom', 'enableZoomShift']}
  },
  args: {
    enableZoom: true,
    enableZoomShift: true,
  },
}