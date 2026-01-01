# 🔄 Workflow Builder

A modern, interactive **visual workflow builder** built with React. Create, edit, and manage complex workflows with an intuitive drag-and-drop-style interface featuring action nodes, conditional branches, and end points.

![Workflow Builder](https://img.shields.io/badge/React-19.2.3-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **🎨 Visual Workflow Design** - Build workflows visually with an intuitive node-based interface
- **🔀 Multiple Node Types**
  - **Action Nodes** - Sequential steps in your workflow
  - **Branch Nodes** - Create conditional paths (True/False branches)
  - **End Nodes** - Mark terminal points in your workflow
- **✏️ Live Editing** - Click any node to rename it instantly
- **↶↷ Undo/Redo** - Full history support to track all changes
- **🎯 Smart Delete** - Remove nodes while maintaining workflow connections
- **💾 Export Functionality** - Save workflows as JSON
- **📱 Responsive Design** - Beautiful gradient UI with smooth animations
- **🎭 Interactive UI** - Hover effects and visual feedback throughout

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd workflow-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Use

### Creating Workflows

1. **Start Node** - Every workflow begins with a "Start" action node
2. **Add Nodes** - Click any of these buttons on a node:
   - `+ Action` - Add a sequential step
   - `+ Branch` - Add a conditional split (True/False paths)
   - `+ End` - Add a terminal point

### Editing Nodes

- **Rename** - Click on any node label to edit its text
- **Delete** - Click the `×` button on any node (except Start)
- **Navigate Branches** - Branch nodes create two paths you can build independently

### Managing History

- **Undo** - Click `↶ Undo` or use Ctrl/Cmd + Z
- **Redo** - Click `↷ Redo` or use Ctrl/Cmd + Shift + Z

### Saving Workflows

Click the `💾 Save` button to export your workflow as JSON to the browser console. You can copy and save this data for later use.

## 🏗️ Project Structure

```
workflow-builder/
├── public/              # Static files
├── src/
│   ├── App.js          # Main WorkflowBuilder component
│   ├── App.css         # Additional styles
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🛠️ Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. The build is optimized and minified.

## 🎨 Tech Stack

- **React 19.2.3** - UI framework
- **CSS3** - Styling with gradients and animations
- **Create React App** - Build tooling and configuration

## 🔧 Key Components

### WorkflowBuilder
The main component that manages:
- Node creation and deletion
- Tree structure manipulation
- History management (undo/redo)
- Label editing
- Workflow export

### Node Types

```javascript
const NODE_TYPES = {
  ACTION: 'action',   // Sequential steps
  BRANCH: 'branch',   // Conditional splits
  END: 'end'         // Terminal nodes
};
```

## 📊 Workflow Data Structure

Workflows are stored as nested JSON:

```json
{
  "id": "root",
  "type": "action",
  "label": "Start",
  "children": [
    {
      "id": "node_123",
      "type": "branch",
      "label": "Decision Point",
      "children": [
        { "label": "True", "nodes": [...] },
        { "label": "False", "nodes": [...] }
      ]
    }
  ]
}
```

## 🎯 Use Cases

- **Business Process Modeling** - Map out company workflows
- **Decision Trees** - Create conditional logic flows
- **User Journey Mapping** - Design user flows and experiences
- **Algorithm Visualization** - Represent programmatic logic
- **Automation Planning** - Plan automated processes

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Known Issues

- Large workflows may require horizontal scrolling
- Export currently logs to console (file download coming soon)

## 🚧 Roadmap

- [ ] Drag-and-drop node repositioning
- [ ] Workflow templates
- [ ] Import from JSON file
- [ ] Download workflow as file
- [ ] Zoom and pan controls
- [ ] Node icons and colors customization
- [ ] Collaborative editing

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using React
