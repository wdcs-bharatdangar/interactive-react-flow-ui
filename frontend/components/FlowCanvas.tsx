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



const createInitialData = () => {
  return {
    nodes: [
      {
        id: "root",
        type: "circle",
        position: { x: 500, y: 400 },
        data: {
          label: "PoEL",
          isExpanded: false,
          size: 'large',
          glowColor: '#1e293b',
          children: [
            {
              id: "dexlyn",
              label: "DEXLYN",
              icon: "🔮",
              position: { x: -250, y: -200 },
              size: 'medium',
              glowColor: '#a855f7',
              children: [
                { id: "dexlyn-child-1", label: "ISUPRA - IUSDC", icon: "💎", position: { x: -150, y: -150 }, size: 'small', glowColor: '#3b82f6' },
                { id: "dexlyn-child-2", label: "ISUPRA", icon: "🔴", position: { x: -100, y: -200 }, size: 'small', glowColor: '#ef4444' },
              ],
            },
            {
              id: "evo",
              label: "EVO",
              icon: "⚡",
              position: { x: 0, y: -250 },
              size: 'medium',
              glowColor: '#10b981',
              children: [
                { id: "evo-child-1", label: "ISUPRA - IUSDC", icon: "💎", position: { x: -100, y: -150 }, size: 'small', glowColor: '#06b6d4' },
                { id: "evo-child-2", label: "IETH - USDC", icon: "💎", position: { x: 100, y: -150 }, size: 'small', glowColor: '#06b6d4' },
              ],
            },
            {
              id: "solido",
              label: "SOLIDO",
              icon: "🌊",
              position: { x: -100, y: -50 },
              size: 'medium',
              glowColor: '#06b6d4',
            },
            {
              id: "atmos",
              label: "ATMOS",
              icon: "🌀",
              position: { x: 250, y: -100 },
              size: 'medium',
              glowColor: '#14b8a6',
              children: [
                { id: "atmos-child-1", label: "ISSVBTC - ISUPRA", icon: "💎", position: { x: 150, y: -150 }, size: 'small', glowColor: '#f59e0b' },
                { id: "atmos-child-2", label: "IETH - ISUPRA", icon: "💎", position: { x: 100, y: -100 }, size: 'small', glowColor: '#3b82f6' },
                { id: "atmos-child-3", label: "USDC - ISUPRA", icon: "💎", position: { x: 150, y: -50 }, size: 'small', glowColor: '#ec4899' },
              ],
            },
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
          const newNodes: Node[] = nodeData.children.map(
            (child, index) => {
              let position;
              if (child.position) {
                position = {
                  x: clickedNode.position.x + child.position.x,
                  y: clickedNode.position.y + child.position.y,
                };
              } else {
                const spacing = 200;
                const childCount = nodeData.children?.length || 0;
                const totalWidth = (childCount - 1) * spacing;
                const startX = clickedNode.position.x - totalWidth / 2;
                position = {
                  x: startX + index * spacing,
                  y: clickedNode.position.y - 200,
                };
              }
              
              return {
                id: child.id,
                type: "circle",
                position,
                data: {
                  label: child.label,
                  icon: child.icon,
                  size: child.size,
                  glowColor: child.glowColor,
                  isExpanded: false,
                  children: child.children,
                } as CircleNodeData,
              };
            }
          );

          const newEdges: Edge[] = nodeData.children.map(
            (child) => ({
              id: `${nodeId}-${child.id}`,
              source: nodeId,
              target: child.id,
              type: "straight",
              animated: false,
              style: { 
                stroke: child.glowColor || '#06b6d4',
                strokeWidth: 2,
                opacity: 0.6
              },
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
        nodesDraggable={false}
        onNodeClick={(_, node) => handleNodeClick(node.id)}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
