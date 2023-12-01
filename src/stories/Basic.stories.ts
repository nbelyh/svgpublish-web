import type { Meta, StoryObj } from '@storybook/react';

import { SvgPublishComponent } from '../../lib/SvgPublishComponent';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Basic/Basics',
  component: SvgPublishComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof SvgPublishComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const EmbedForceCtrl: Story = {
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['url', 'enableZoomCtrl']}
  },
  args: {
    url: '/src/stories/assets/POW.svg',
    height: '80vh',
    enableZoomCtrl: true,
  },
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const WidthAndHeight: Story = {
  parameters: {
    layout: 'centered',
    controls: { include: ['url', 'width', 'height', 'enableZoomCtrl']}
  },
  args: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Ghostscript_Tiger.svg',
    height: 500,
    width: 500,
    enableZoomCtrl: false,
  },
};
