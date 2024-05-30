import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel
} from "reactflow";

import "reactflow/dist/style.css";
import ControllerBar from "./ControllerBar";

const flowKey = "flow-key";

const initialData = JSON.parse(localStorage.getItem(flowKey)) ? JSON.parse(localStorage.getItem(flowKey)) : [];
let id = initialData?.nodes?.length ? initialData?.nodes?.length: 0;
const initialNodes = initialData?.nodes ? initialData?.nodes : [];
const initialEdges = initialData?.edges ? initialData?.edges: [];

export default function NodesWithConnect() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
 
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (e, node) => {
    setSelectedNode(node);
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: `node_${id++}`,
        position,
        width: 150,
        height: 37,
        type: "target",
        data: { label: `${type}` },
      };

      setNodes((nds) => {
        return [...nds, newNode];
      });
    },
    [reactFlowInstance]
  );

  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        alert(
          "Error: More than one node has an empty target handle or there are unconnected nodes."
        );
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
        alert("Save successful!"); // Provide feedback when save is successful
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

  return (
    <div ref={reactFlowWrapper} className="container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        onDragOver={onDragOver}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <Panel>
          <button
            className=" m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onSave}
          >
            save flow
          </button>
        </Panel>
      </ReactFlow>
      <ControllerBar selectedNode={selectedNode} setSelectedNode={setSelectedNode} nodes={nodes} setNodes={setNodes}/>
    </div>
  );
}
