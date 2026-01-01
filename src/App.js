import React, { useState, useCallback } from 'react';

const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const INITIAL_WORKFLOW = {
  id: 'root',
  type: 'action',
  label: 'Start',
  children: []
};

const NODE_TYPES = {
  ACTION: 'action',
  BRANCH: 'branch',
  END: 'end'
};

const WorkflowBuilder = () => {
  const [workflow, setWorkflow] = useState(INITIAL_WORKFLOW);
  const [history, setHistory] = useState([INITIAL_WORKFLOW]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [editingNode, setEditingNode] = useState(null);
  const [editLabel, setEditLabel] = useState('');

  const updateHistory = useCallback((newWorkflow) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newWorkflow);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setWorkflow(newWorkflow);
  }, [history, historyIndex]);

  // Recursively find and update nodes in the tree
  const findAndUpdateNode = useCallback((node, targetId, updateFn) => {
    if (node.id === targetId) {
      return updateFn(node);
    }

    if (node.type === NODE_TYPES.BRANCH && Array.isArray(node.children)) {
      return {
        ...node,
        children: node.children.map(branch => ({
          ...branch,
          nodes: branch.nodes.map(child => findAndUpdateNode(child, targetId, updateFn))
        }))
      };
    }

    if (node.type === NODE_TYPES.ACTION && node.children.length > 0) {
      return {
        ...node,
        children: [findAndUpdateNode(node.children[0], targetId, updateFn)]
      };
    }

    return node;
  }, []);

  const addNode = useCallback((parentId, nodeType, branchIndex = null) => {
    const newNode = {
      id: generateId(),
      type: nodeType,
      label: nodeType === NODE_TYPES.ACTION ? 'New Action' : 
             nodeType === NODE_TYPES.BRANCH ? 'Branch' : 'End',
      children: nodeType === NODE_TYPES.BRANCH ? [
        { label: 'True', nodes: [] },
        { label: 'False', nodes: [] }
      ] : []
    };

    const updatedWorkflow = findAndUpdateNode(workflow, parentId, (node) => {
      if (node.type === NODE_TYPES.END) return node;

      if (node.type === NODE_TYPES.BRANCH && branchIndex !== null) {
        const newChildren = [...node.children];
        newChildren[branchIndex] = {
          ...newChildren[branchIndex],
          nodes: [...newChildren[branchIndex].nodes, newNode]
        };
        return { ...node, children: newChildren };
      }

      if (node.type === NODE_TYPES.ACTION) {
        return { ...node, children: [newNode] };
      }

      return node;
    });

    updateHistory(updatedWorkflow);
  }, [workflow, findAndUpdateNode, updateHistory]);

  const deleteNode = useCallback((nodeId) => {
    if (nodeId === 'root') return;

    // When deleting a node, connect its children to its parent
    const deleteRecursive = (node) => {
      if (node.id === nodeId) {
        if (node.type === NODE_TYPES.ACTION && node.children.length > 0) {
          return node.children[0];
        }
        return null;
      }

      if (node.type === NODE_TYPES.BRANCH) {
        return {
          ...node,
          children: node.children.map(branch => ({
            ...branch,
            nodes: branch.nodes
              .map(child => deleteRecursive(child))
              .filter(Boolean)
          }))
        };
      }

      if (node.type === NODE_TYPES.ACTION && node.children.length > 0) {
        const updatedChild = deleteRecursive(node.children[0]);
        return {
          ...node,
          children: updatedChild ? [updatedChild] : []
        };
      }

      return node;
    };

    const updatedWorkflow = deleteRecursive(workflow);
    updateHistory(updatedWorkflow);
  }, [workflow, updateHistory]);

  const updateNodeLabel = useCallback((nodeId, newLabel) => {
    const updatedWorkflow = findAndUpdateNode(workflow, nodeId, (node) => ({
      ...node,
      label: newLabel
    }));
    updateHistory(updatedWorkflow);
  }, [workflow, findAndUpdateNode, updateHistory]);

  const startEditing = (node) => {
    setEditingNode(node.id);
    setEditLabel(node.label);
  };

  const finishEditing = () => {
    if (editingNode && editLabel.trim()) {
      updateNodeLabel(editingNode, editLabel.trim());
    }
    setEditingNode(null);
    setEditLabel('');
  };

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setWorkflow(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setWorkflow(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const saveWorkflow = () => {
    console.log('Workflow Data:', JSON.stringify(workflow, null, 2));
    alert('Workflow saved to console! Check your browser console.');
  };

  const renderNode = (node, parentId = null, branchIndex = null) => {
    const isRoot = node.id === 'root';
    const canAddChildren = node.type !== NODE_TYPES.END;

    return (
      <div key={node.id} className="node-container">
        <div className={`node node-${node.type}`}>
          <div className="node-header">
            <span className="node-type-badge">{node.type.toUpperCase()}</span>
            {!isRoot && (
              <button 
                className="node-delete"
                onClick={() => deleteNode(node.id)}
                title="Delete Node"
              >
                ×
              </button>
            )}
          </div>

          {editingNode === node.id ? (
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onBlur={finishEditing}
              onKeyPress={(e) => e.key === 'Enter' && finishEditing()}
              autoFocus
              className="node-label-input"
            />
          ) : (
            <div 
              className="node-label"
              onClick={() => startEditing(node)}
              title="Click to edit"
            >
              {node.label}
            </div>
          )}

          {canAddChildren && (
            <div className="node-actions">
              <button onClick={() => addNode(node.id, NODE_TYPES.ACTION, branchIndex)} className="btn-add">
                + Action
              </button>
              <button onClick={() => addNode(node.id, NODE_TYPES.BRANCH, branchIndex)} className="btn-add">
                + Branch
              </button>
              <button onClick={() => addNode(node.id, NODE_TYPES.END, branchIndex)} className="btn-add">
                + End
              </button>
            </div>
          )}
        </div>

        {(node.children.length > 0 || (node.type === NODE_TYPES.BRANCH && node.children.length > 0)) && (
          <div className="connector-line"></div>
        )}

        {node.type === NODE_TYPES.BRANCH && Array.isArray(node.children) ? (
          <div className="branch-container">
            {node.children.map((branch, idx) => (
              <div key={idx} className="branch-path">
                <div className="branch-label">{branch.label}</div>
                <div className="branch-nodes">
                  {branch.nodes.map(child => renderNode(child, node.id, idx))}
                  {branch.nodes.length === 0 && (
                    <div className="empty-branch">
                      <button onClick={() => addNode(node.id, NODE_TYPES.ACTION, idx)} className="btn-add-empty">
                        + Add First Step
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : node.type === NODE_TYPES.ACTION && node.children.length > 0 ? (
          renderNode(node.children[0], node.id)
        ) : null}
      </div>
    );
  };

  return (
    <div className="workflow-builder">
      <div className="toolbar">
        <h1>Workflow Builder</h1>
        <div className="toolbar-actions">
          <button onClick={undo} disabled={historyIndex === 0} className="btn-toolbar">
            ↶ Undo
          </button>
          <button onClick={redo} disabled={historyIndex === history.length - 1} className="btn-toolbar">
            ↷ Redo
          </button>
          <button onClick={saveWorkflow} className="btn-toolbar btn-save">
            💾 Save
          </button>
        </div>
      </div>

      <div className="canvas">
        {renderNode(workflow)}
      </div>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .workflow-builder {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .toolbar {
          background: rgba(255, 255, 255, 0.95);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .toolbar h1 {
          font-size: 1.5rem;
          color: #333;
        }

        .toolbar-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-toolbar {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          background: #667eea;
          color: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .btn-toolbar:hover:not(:disabled) {
          background: #5568d3;
          transform: translateY(-1px);
        }

        .btn-toolbar:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-save {
          background: #48bb78;
        }

        .btn-save:hover {
          background: #38a169;
        }

        .canvas {
          padding: 3rem;
          display: flex;
          justify-content: center;
          overflow-x: auto;
        }

        .node-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .node {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          min-width: 250px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          position: relative;
        }

        .node:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
        }

        .node-action {
          border-left: 4px solid #4299e1;
        }

        .node-branch {
          border-left: 4px solid #ed8936;
        }

        .node-end {
          border-left: 4px solid #48bb78;
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .node-type-badge {
          background: #edf2f7;
          color: #4a5568;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .node-delete {
          background: #fc8181;
          color: white;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          line-height: 1;
          transition: all 0.2s;
        }

        .node-delete:hover {
          background: #f56565;
          transform: scale(1.1);
        }

        .node-label {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .node-label:hover {
          background: #f7fafc;
        }

        .node-label-input {
          width: 100%;
          padding: 0.5rem;
          border: 2px solid #4299e1;
          border-radius: 4px;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .node-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-add {
          padding: 0.5rem 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          color: #4a5568;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
          flex: 1;
        }

        .btn-add:hover {
          border-color: #4299e1;
          color: #4299e1;
          background: #ebf8ff;
        }

        .connector-line {
          width: 2px;
          height: 30px;
          background: rgba(255, 255, 255, 0.5);
          margin: 0.5rem 0;
        }

        .branch-container {
          display: flex;
          gap: 3rem;
          margin-top: 1rem;
        }

        .branch-path {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .branch-label {
          background: rgba(255, 255, 255, 0.9);
          color: #2d3748;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .branch-nodes {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .empty-branch {
          padding: 2rem;
          border: 2px dashed rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-add-empty {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.9);
          color: #4a5568;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-add-empty:hover {
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default WorkflowBuilder;
