# SVG Publish SharePoint Web Part - Video Presentation Script

**Target Duration**: 10 minutes  
**Target Audience**: SharePoint developers, business users, IT professionals

## Context (2025): Pure SVG export, no Custom Script

- Previous exports produced an .aspx page plus JavaScript assets, which required the SharePoint "Enable custom script" toggle and wasn’t suitable for many tenants.
- New: the SvgPublish/SvgExport tool can export pure .svg files (for multi-page diagrams: one SVG per page; no .aspx, no page-level scripts). This works in modern SharePoint without enabling custom script.
- The SvgPublish Web Part acts as a companion: it provides all runtime scripts and UI on the page and lets you configure and customize behavior directly in SharePoint.

## Video Structure & Timeline

### 1. Introduction (1 minute)

### 2. Problem Statement (1 minute)

### 3. Solution Overview (1 minute)

### 4. Live Demo - Setup (2 minutes)

### 5. Feature Demonstration (4 minutes)

### 6. Use Cases & Benefits (1 minute)

---

## Script & Scenario

### [0:00 - 1:00] Introduction

**Screen**: Title slide showing "SVG Publish SharePoint Web Part"

**Script**:
"Hello, I'm going to demonstrate the SVG Publish SharePoint Web Part. This web part allows you to display interactive Visio diagrams directly in SharePoint Online with enhanced functionality and better user experience.

The web part is part of the SVG Publish toolkit and converts standard Visio files into interactive SVG diagrams that work seamlessly in modern SharePoint.

What's new: instead of publishing .aspx pages with scripts (which required enabling custom script), you can now export pure SVG files. The companion web part supplies the scripts at runtime and lets you configure everything on the page."

**Actions**:

- Show title slide
- Brief overview of what we'll cover

---

### [1:00 - 2:00] Problem Statement

**Screen**: Split screen showing traditional Visio sharing issues

**Script**:
"Historically, exporting to SharePoint produced .aspx plus JavaScript files and required the tenant/site setting 'Enable custom script'—often restricted by IT policies. That blocked many scenarios and complicated deployments.

Now, with the pure SVG export, no .aspx or page-level scripts are stored in the library. The web part provides all the runtime features safely within modern pages, so you no longer need to enable custom script.

The SVG Publish Web Part also brings enhanced capabilities to Visio diagrams in SharePoint:

- Navigate between multiple diagram files seamlessly
- Set custom views and zoom levels for optimal presentation
- Rich tooltips and interactive sidebar with shape data
- Full-screen mode for detailed diagram review
- Complete touch support for mobile and tablet users
- Advanced search across diagram pages and shapes
- Layer management for complex multi-layered diagrams

The web part converts Visio diagrams to web-native SVG format, unlocking these advanced interactive features directly in SharePoint—without requiring custom script."

**Actions**:

- Show web part capabilities overview
- Highlight mobile touch interface

---

### [2:00 - 3:00] Solution Overview

**Screen**: Architecture diagram showing workflow

**Script**:
"The solution workflow is straightforward:

1. Export your Visio diagram using the SvgPublish/SvgExport add-in in 'Pure SVG' mode directly to a SharePoint document library (no .aspx, no page scripts)
2. Add the SVG Publish Web Part to your page
3. Point the web part to the exported .svg file and configure properties directly online

The exported SVG maintains all your original diagram elements while the web part supplies the interactive scripts at runtime—no 'Enable custom script' needed."

**Actions**:

- Show workflow diagram
- Highlight key components

---

### [3:00 - 5:00] Live Demo - Setup

**Screen**: SharePoint page in edit mode

**Script**:
"Let me show you how to set this up. I'm on a SharePoint page in edit mode.

First, I'll add the web part by clicking the plus icon and searching for 'SVG Publish'.

Now I see the web part with its property panel. The main setting is selecting the SVG file. I'll click 'Browse' and select a database schema diagram I exported earlier using the 'Pure SVG' export option.

The diagram loads immediately. You can see we have a complex database schema that's now interactive in SharePoint. The web part automatically detects the diagram dimensions and applies default settings."

**Actions**:

- Add web part to page
- Browse for SVG file
- Show initial diagram load
- Point out automatic sizing

**Demo Files to Use**:

- `packages/storybook/assets/OrgChart.svg` (database schema)

---

### [5:00 - 9:00] Feature Demonstration

**Screen**: Property panel with different feature groups

**Script**:
"The web part organizes features into logical groups. Let me demonstrate the key capabilities:

#### Pan & Zoom (30 seconds)

I'll enable pan and zoom functionality. Now users can navigate around large diagrams smoothly. This works with mouse, keyboard, and touch gestures."

**Actions**:

- Enable pan/zoom in properties
- Demonstrate navigation
- Show touch support on mobile view

**Script continues**:
"#### Selection & Highlighting (45 seconds)

Next, I'll enable shape selection. When I click on a table, it highlights clearly.

Now I'll enable connected shape highlighting. Watch what happens when I select this customer table - it automatically highlights all related tables and their connections in different colors. This helps users understand relationships in complex diagrams."

**Actions**:

- Enable selection
- Click shapes to show highlighting
- Enable connected highlighting
- Select shapes to show relationship mapping

**Script continues**:
"#### Interactive Sidebar (45 seconds)

I'll enable the sidebar with shape properties. When I select a shape, the sidebar opens automatically showing all the shape's metadata and properties. Users can see detailed information without cluttering the diagram."

**Actions**:

- Enable sidebar
- Enable auto-show on selection
- Select shapes to show property details
- Demonstrate property filtering

**Script continues**:
"#### Search Functionality (30 seconds)

The search feature lets users find shapes across all pages of the diagram. I'll search for 'customer' and it highlights matching shapes and shows results in the sidebar."

**Actions**:

- Enable search
- Perform search query
- Show highlighted results

**Script continues**:
"#### Layer Management (30 seconds)

For diagrams with layers, users can toggle layer visibility directly from the sidebar. This is useful for showing different aspects of the same diagram."

**Actions**:

- Show layer panel
- Toggle layer visibility
- Demonstrate layer search

**Script continues**:
"#### Tooltips & Hyperlinks (30 seconds)

The web part supports rich tooltips and hyperlinks. Hovering over shapes shows additional information, and embedded hyperlinks work seamlessly."

**Actions**:

- Enable tooltips
- Show tooltip on hover
- Click hyperlink to demonstrate navigation

---

### [9:00 - 10:00] Use Cases & Benefits

**Screen**: Examples of different diagram types

**Script**:
"This web part works well for various scenarios:

- Process Documentation: Interactive workflow diagrams with clickable steps
- System Architecture: Technical diagrams with detailed component information
- Organizational Charts: Personnel directories with contact information
- Network Diagrams: Infrastructure documentation with status indicators
- Floor Plans: Interactive building layouts with room details

Key benefits include:

- Enhanced interactivity beyond desktop Visio capabilities
- Full mobile and cross-browser compatibility
- Deep SharePoint integration
- Advanced search and navigation features
- No need to enable 'custom script'—fully compatible with modern SharePoint Online policies

The web part is actively developed and supports most Visio diagram types and features."

**Actions**:

- Show different diagram examples
- Highlight mobile view
- Show integration with SharePoint lists (if available)

---

## Demo Preparation Checklist

### Required Files

- [ ] Database schema SVG (`OrgChart.svg`)
- [ ] Process flow diagram with hyperlinks
- [ ] Multi-page diagram for page navigation
- [ ] Diagram with layers for layer demo
- [ ] Ensure all SVGs were exported using the 'Pure SVG' option (no .aspx)

### SharePoint Setup

- [ ] Test SharePoint site with web part installed
- [ ] Upload demo SVG files to document library
- [ ] Prepare page for demo
- [ ] Test all features work as expected
- [ ] Confirm tenant/site does NOT require enabling 'custom script' for this demo (not needed)

### Recording Setup

- [ ] Screen recording software configured
- [ ] Audio quality tested
- [ ] Browser zoom level appropriate for recording
- [ ] Property panel visible and readable

### Backup Plans

- [ ] Pre-configured web part ready if live setup fails
- [ ] Alternative demo files available
- [ ] Screenshots of expected results

---

## Technical Notes

### Property Groups to Demonstrate

1. Source File - File selection
2. Appearance - Pan/zoom, dimensions
3. Highlight & Selection - Colors, effects
4. Previous/Next Highlight - Connected shape highlighting
5. Sidebar - Properties, auto-show
6. Search - Cross-page search
7. Layers - Layer management
8. Tooltips - Hover information

### Avoid These Common Issues

- Ensure SVG files are accessible to demo user
- Test web part permissions beforehand
- Have fallback files if primary demos fail
- Check browser compatibility for recording
- Verify audio levels and clarity
- Don’t upload or rely on legacy .aspx-based exports; use the pure .svg file and point the web part to it

### Post-Demo Actions

- Save the configured web part as template
- Export demo files for future use
- Document any issues encountered
- Update script based on actual recording experience

---

## Technical Addendum: Deployment model (no custom script)

- Export mode: use 'Pure SVG' in the SvgPublish/SvgExport add-in. This produces .svg files—one per page for multi-page diagrams (no .aspx, no packaged scripts).
- Runtime model: the SvgPublish Web Part hosts the viewer and provides all interactive scripts on the page.
- Governance: works on modern SharePoint sites with 'Enable custom script' disabled.
- Customization: all viewer options are configured in the web part property pane; changes apply immediately without republishing the SVG.
