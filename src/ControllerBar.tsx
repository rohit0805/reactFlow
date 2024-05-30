import React from "react";
import "./app.scss";

const ControllerBar = ({ selectedNode, setSelectedNode, nodes, setNodes }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onSaveEdit = () => {
    const newNodes = nodes.map((node) => {
      if (node.id === selectedNode?.id) {
        return selectedNode;
      }
      return node;
    });
    setNodes(newNodes);
  };

  const editNodeDOM = () => {
    return (
      <div>
        <h3 className="text-xl mb-2 text-blue-900">Update Node</h3>
        <label className="block mb-2 text-sm font-medium text-blue-900">
          Node Name:
        </label>
        <input
          type="text"
          className="block w-full pt-2 px-3 pb-3 text-gray-700 border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
          value={selectedNode?.data?.label}
          onChange={(e) => {
            setSelectedNode({
              ...selectedNode,
              data: {
                ...selectedNode.data,
                label: e.target.value,
              },
            });
          }}
        />
        <button onClick={onSaveEdit}>Save</button>
        <button
          className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          onClick={() => setSelectedNode()}
        >
          Go Back
        </button>
      </div>
    );
  };
  return (
    <aside>
      {selectedNode ? (
        editNodeDOM()
      ) : (
        <div
          onDragStart={(event) => onDragStart(event, "randomText")}
          draggable
          className="messageBox"
        >
          Message
        </div>
      )}
    </aside>
  );
};

export default ControllerBar;
