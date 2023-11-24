import type { Meta, StoryObj } from '@storybook/react';

import { SvgPublishComponent } from '../../lib/SvgPublishComponent';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Basic/Selection',
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
    controls: { include: ['enableSelection', 'enableHover', 'enableBlur', 'blur', 'enableDilate', 'dilate', 'selectionMode', 'selectColor', 'hoverColor', 'hyperlinkColor', 'enableBoxSelection']}
  },
  args: {
  },
};

export const BoxSelection: Story = {
  parameters: {
    controls: { include: ['selectColor', 'hoverColor', 'enableBoxSelection']}
  },
  args: {
    selectColor: 'rgba(0, 50, 255, 0.8)',
    hoverColor: 'rgba(0, 50, 255, 0.4)',
    enableBoxSelection: true,
  },
};

export const Color: Story = {
  parameters: {
    controls: { include: ['selectColor', 'hoverColor', 'hyperlinkColor']}
  },
  args: {
    selectColor: 'rgba(255, 0, 0, 0.8)',
    hoverColor: 'rgba(255, 255, 0, 0.4)',
    hyperlinkColor: 'rgba(0, 255, 0, 0.8)',
  },
};

export const Thin: Story = {
  parameters: {
    controls: { include: ['dilate']}
  },
  args: {
    dilate: 1,
    enableDilate: true,
    blur: 0,
    enableBlur: false,
    selectColor: 'rgba(255, 0, 0, 0.8)',
  },
};

export const SelectionMode: Story = {
  parameters: {
    controls: { include: ['selectionMode', 'selectColor', 'dilate', 'enableDilate']}
  },
  args: {
    selectionMode: 'darken',
    dilate: 0,
    enableDilate: false,
    enableBlur: false,
    selectColor: 'rgba(255, 255, 0, 0.5)',
  },
};