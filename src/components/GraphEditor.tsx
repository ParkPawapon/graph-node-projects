'use client';

import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  BackgroundVariant,
  OnDelete,
  ConnectionLineType,
  useReactFlow,
  ConnectionMode,
  ReactFlowProvider,
  Panel,
  type Node,
  type Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphStore } from '@/store/useGraphStore';

function GraphEditorContent() {
  const { 
      nodes, edges, 
      onNodesChange, onEdgesChange, onConnect, 
      deleteSelectedElements, addNode, 
      updateEdgeLabel, setStartNode, setEndNode, // ✅ เพิ่ม setEndNode
      startNodeId, endNodeId 
  } = useGraphStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDelete: OnDelete = useCallback(({ nodes, edges }) => {
      const nodeIds = nodes.map(n => n.id);
      const edgeIds = edges.map(e => e.id);
      deleteSelectedElements(nodeIds, edgeIds);
  }, [deleteSelectedElements]);

  const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('.react-flow__node') || target.closest('.react-flow__edge')) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      addNode({ 
        x: Math.round(position.x / 10) * 10, 
        y: Math.round(position.y / 10) * 10 
      });
    },
    [addNode, screenToFlowPosition]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    const currentLabel = edge.label as string || '1';
    const newWeight = window.prompt("Edit Edge Weight (แก้ไขน้ำหนัก):", currentLabel);
    
    if (newWeight !== null) {
        const num = parseFloat(newWeight);
        if (!isNaN(num)) {
            updateEdgeLabel(edge.id, num.toString());
        } else {
            alert("Please enter a valid number");
        }
    }
  }, [updateEdgeLabel]);

  // 🟢 Left Click = Start Node
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setStartNode(node.id);
  }, [setStartNode]);

  // 🔴 Right Click = End Node
  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault(); // ป้องกันเมนูคลิกขวาปกติ
    setEndNode(node.id);
  }, [setEndNode]);

  return (
    <div 
      className="w-full h-full bg-zinc-950 select-none"
      onDoubleClick={onPaneDoubleClick}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        
        onEdgeClick={onEdgeClick}
        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu} // ✅ ผูก Event คลิกขวา

        fitView
        minZoom={0.2}
        maxZoom={2}
        colorMode="dark"
        attributionPosition="bottom-right"
        
        panOnScroll={false}
        panOnDrag={true}
        zoomOnDoubleClick={false}
        selectionOnDrag={false}
        selectionKeyCode="Shift"
        
        connectionMode={ConnectionMode.Loose} 
        connectionLineType={ConnectionLineType.Bezier}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 3 }}
        
        snapToGrid={true}
        snapGrid={[10, 10]}
      >
        <Background color="#333" gap={20} variant={BackgroundVariant.Dots} size={1} />
        <Controls className="bg-zinc-800 border-zinc-700 fill-zinc-300" />
        <MiniMap 
            className="bg-zinc-900 border-zinc-800" 
            nodeColor="#4f46e5" 
            maskColor="rgba(0,0,0, 0.6)"
        />
        
        <Panel position="bottom-left" className="bg-zinc-900/90 p-3 rounded-lg text-xs text-zinc-400 border border-zinc-800 shadow-xl backdrop-blur-sm">
            <div className="font-semibold text-zinc-200 mb-1">Interactive Controls:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span>🖱️ Double Click:</span> <span className="text-zinc-300">Add Node</span>
                <span>🖱️ Click Node:</span> <span className="text-zinc-300">Start (Green)</span>
                <span>🖱️ Right Click:</span> <span className="text-zinc-300">Target (Red)</span>
                <span>🖱️ Click Edge:</span> <span className="text-zinc-300">Edit Weight</span>
            </div>
            
            {(startNodeId || endNodeId) && (
                <div className="mt-2 pt-2 border-t border-zinc-800 flex flex-col gap-1 font-medium">
                    {startNodeId && (
                        <span className="text-emerald-400">🎯 Start: {nodes.find(n => n.id === startNodeId)?.data.label}</span>
                    )}
                    {endNodeId && (
                        <span className="text-rose-400">🚩 Target: {nodes.find(n => n.id === endNodeId)?.data.label}</span>
                    )}
                </div>
            )}
        </Panel>

      </ReactFlow>
    </div>
  );
}

export default function GraphEditor() {
  return (
    <ReactFlowProvider>
      <GraphEditorContent />
    </ReactFlowProvider>
  );
}