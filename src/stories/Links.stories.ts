import type { Meta, StoryObj } from '@storybook/react';

import { SvgPublishComponent } from '../../lib/SvgPublishComponent';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Basic/Links',
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
    url: '/src/stories/assets/Links.svg',
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
    controls: { include: ['enableLinks']}
  },
  args: {
    enableLinks: true,
    enableSelection: false,
    enablePan: false,
    enableHover: false,
  },
};
