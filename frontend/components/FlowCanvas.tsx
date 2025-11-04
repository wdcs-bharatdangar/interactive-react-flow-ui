import { useCallback, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CircleNode, { CircleNodeData } from "./CircleNode";

const nodeTypes = {
  circle: CircleNode,
};



// Sample hierarchical data
const createInitialData = () => {
  return {
    nodes: [
      {
        id: "root",
        type: "circle",
        position: { x: 400, y: 100 },
        data: {
          label: "Main Node",
          isExpanded: false,
          children: [
            {
              id: "child-1",
              label: "Child 1",
              children: [
                { id: "grandchild-1-1", label: "Grandchild 1.1" },
                { id: "grandchild-1-2", label: "Grandchild 1.2" },
              ],
            },
            {
              id: "child-2",
              label: "Child 2",
              children: [{ id: "grandchild-2-1", label: "Grandchild 2.1" }],
            },
            { id: "child-3", label: "Child 3" },
          ],
        } as CircleNodeData,
      },
    ] as Node[],
    edges: [] as Edge[],
  };
};

export default function FlowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(createInitialData().nodes);
  const [edges, setEdges] = useState<Edge[]>(createInitialData().edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      setNodes((nds) => {
        const clickedNode = nds.find((n) => n.id === nodeId);
        const nodeData = clickedNode?.data as CircleNodeData | undefined;
        if (!clickedNode || !nodeData?.children) return nds;

        const isExpanded = nodeData.isExpanded;

        if (isExpanded) {
          // Collapse: remove child nodes
          const childIds = new Set(
            nodeData.children.map((c) => c.id)
          );
          const grandchildIds = new Set(
            nodeData.children.flatMap((c) =>
              c.children?.map((gc) => gc.id) || []
            )
          );

          const allDescendantIds = new Set([...childIds, ...grandchildIds]);

          setEdges((eds) =>
            eds.filter((e) => !allDescendantIds.has(e.target))
          );

          return nds
            .filter((n) => !allDescendantIds.has(n.id))
            .map((n) =>
              n.id === nodeId
                ? { ...n, data: { ...n.data, isExpanded: false } }
                : n
            );
        } else {
          // Expand: add child nodes
          const childCount = nodeData.children.length;
          const spacing = 200;
          const totalWidth = (childCount - 1) * spacing;
          const startX = clickedNode.position.x - totalWidth / 2;

          const newNodes: Node[] = nodeData.children.map(
            (child, index) => ({
              id: child.id,
              type: "circle",
              position: {
                x: startX + index * spacing,
                y: clickedNode.position.y + 200,
              },
              data: {
                label: child.label,
                isExpanded: false,
                children: child.children,
              } as CircleNodeData,
            })
          );

          const newEdges: Edge[] = nodeData.children.map(
            (child) => ({
              id: `${nodeId}-${child.id}`,
              source: nodeId,
              target: child.id,
              type: "smoothstep",
              animated: true,
              style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
            })
          );

          setEdges((eds) => [...eds, ...newEdges]);

          return [
            ...nds.map((n) =>
              n.id === nodeId
                ? { ...n, data: { ...n.data, isExpanded: true } }
                : n
            ),
            ...newNodes,
          ];
        }
      });
    },
    []
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        nodesDraggable={true}
        onNodeClick={(_, node) => handleNodeClick(node.id)}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
