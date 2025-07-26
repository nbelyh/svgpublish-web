import type { Meta, StoryObj } from '@storybook/react';
import { SvgPublishComponent } from 'svgpublish-react';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'SVG Publish/Sidebar',
  component: SvgPublishComponent,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-stories/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    url: {
      control: {
        type: 'select',
        options: [
          'assets/Drawing1.svg',
          'assets/POW.svg',
          'assets/tooltips.svg',
          'assets/ViennaSbahn.svg',
        ]
      }
    },
  },
  args: {
    url: 'assets/Drawing1.svg',
    width: '100%',
    height: '100vh',
    enableSelection: true,
    enableHover: true,

    // Basic sidebar settings
    enableSidebar: true,
    rightSidebar: false,
    showSidebarOnSelection: false,
    enableSidebarTitle: true,
    enableSidebarMarkdown: false,
    sidebarMarkdown: '',
    sidebarDefaultWidth: '300px',
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
        "enableSidebar",
        "rightSidebar",
        "showSidebarOnSelection",
        "enableSidebarTitle",
        "sidebarDefaultWidth",
      ],
    },
  },
};

export const RightSidebar: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "enableSidebar",
        "rightSidebar",
        "showSidebarOnSelection",
        "enableSidebarTitle",
        "sidebarDefaultWidth",
      ],
    },
  },
  args: {
    rightSidebar: true,
  },
};

export const ShowOnSelection: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "enableSidebar",
        "rightSidebar",
        "showSidebarOnSelection",
        "enableSidebarTitle",
        "sidebarDefaultWidth",
        "enableSelection",
      ],
    },
  },
  args: {
    showSidebarOnSelection: true,
  },
};

export const CustomContent: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "enableSidebar",
        "rightSidebar",
        "showSidebarOnSelection",
        "enableSidebarTitle",
        "enableSidebarMarkdown",
        "sidebarMarkdown",
        "sidebarDefaultWidth",
      ],
    },
  },
  args: {
    enableSidebarMarkdown: true,
    sidebarMarkdown: `# Custom Sidebar Content

This is **custom markdown content** for the sidebar.

- Item 1
- Item 2
- Item 3

[Learn more](https://example.com)

> This is a blockquote with additional information.`,
  },
};

export const WideCustomSidebar: Story = {
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "enableSidebar",
        "rightSidebar",
        "enableSidebarTitle",
        "enableSidebarMarkdown",
        "sidebarMarkdown",
        "sidebarDefaultWidth",
      ],
    },
  },
  args: {
    enableSidebarMarkdown: true,
    sidebarDefaultWidth: '450px',
    sidebarMarkdown: `# Project Documentation

## Overview
This sidebar demonstrates custom content capabilities with a wider layout.

## Features
- **Custom Width**: Set to 450px
- **Rich Content**: Supports full markdown
- **Interactive**: Links and formatting work

## Configuration
\`\`\`json
{
  "sidebarDefaultWidth": "450px",
  "enableSidebarMarkdown": true
}
\`\`\`

## Status
✅ Implemented
🚧 In Progress
❌ Not Started
`,
  },
};
