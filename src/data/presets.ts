import { Node, Edge } from '@xyflow/react';

export type GraphPreset = {
  nodes: Node[];
  edges: Edge[];
  description: string;
};

const createTree = () => {
    const nodes: Node[] = [
        { id: 'A', position: { x: 400, y: 50 }, data: { label: 'A' }, type: 'default', style: { width: 56, height: 56 } },
        { id: 'B', position: { x: 250, y: 180 }, data: { label: 'B' }, type: 'default', style: { width: 56, height: 56 } },
        { id: 'C', position: { x: 550, y: 180 }, data: { label: 'C' }, type: 'default', style: { width: 56, height: 56 } },
        { id: 'D', position: { x: 100, y: 320 }, data: { label: 'D' }, type: 'default', style: { width: 56, height: 56 } },
        { id: 'E', position: { x: 250, y: 320 }, data: { label: 'E' }, type: 'default', style: { width: 56, height: 56 } },
        { id: 'F', position: { x: 400, y: 320 }, data: { label: 'F' }, type: 'default', style: { width: 56, height: 56 } },
        { id: 'G', position: { x: 700, y: 320 }, data: { label: 'G' }, type: 'default', style: { width: 56, height: 56 } },
        { id: 'H', position: { x: 400, y: 450 }, data: { label: 'H' }, type: 'default', style: { width: 56, height: 56 } },
        { id: 'I', position: { x: 700, y: 450 }, data: { label: 'I' }, type: 'default', style: { width: 56, height: 56 } },
    ];

    const edges: Edge[] = [
        { id: 'e-AB', source: 'A', target: 'B', label: '1' },
        { id: 'e-AC', source: 'A', target: 'C', label: '1' },
        { id: 'e-BD', source: 'B', target: 'D', label: '1' },
        { id: 'e-BE', source: 'B', target: 'E', label: '1' },
        { id: 'e-BF', source: 'B', target: 'F', label: '1' },
        { id: 'e-CG', source: 'C', target: 'G', label: '1' },
        { id: 'e-FH', source: 'F', target: 'H', label: '1' },
        { id: 'e-GI', source: 'G', target: 'I', label: '1' },
    ].map(e => ({ ...e, type: 'default', style: { stroke: '#71717a', strokeWidth: 2 }, animated: false }));

    return { nodes, edges };
};

const createTextbookGraph = () => {
    const nodes: Node[] = [
        { id: '0', position: { x: 50, y: 250 }, data: { label: '0' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '1', position: { x: 230, y: 100 }, data: { label: '1' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '2', position: { x: 410, y: 100 }, data: { label: '2' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '3', position: { x: 590, y: 100 }, data: { label: '3' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '4', position: { x: 770, y: 250 }, data: { label: '4' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '5', position: { x: 590, y: 400 }, data: { label: '5' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '6', position: { x: 410, y: 400 }, data: { label: '6' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '7', position: { x: 230, y: 400 }, data: { label: '7' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '8', position: { x: 410, y: 250 }, data: { label: '8' }, type: 'default', style: { width: 56, height: 56 } },
    ];

    const edges: Edge[] = [
        { id: 'e-0-1', source: '0', target: '1', label: '4' },
        { id: 'e-0-7', source: '0', target: '7', label: '8' },
        { id: 'e-1-2', source: '1', target: '2', label: '8' },
        { id: 'e-1-7', source: '1', target: '7', label: '11' },
        { id: 'e-2-3', source: '2', target: '3', label: '7' },
        { id: 'e-2-8', source: '2', target: '8', label: '2' },
        { id: 'e-2-5', source: '2', target: '5', label: '4' },
        { id: 'e-3-4', source: '3', target: '4', label: '9' },
        { id: 'e-3-5', source: '3', target: '5', label: '14' },
        { id: 'e-4-5', source: '4', target: '5', label: '10' },
        { id: 'e-5-6', source: '5', target: '6', label: '2' },
        { id: 'e-6-7', source: '6', target: '7', label: '1' },
        { id: 'e-6-8', source: '6', target: '8', label: '6' },
        { id: 'e-7-8', source: '7', target: '8', label: '7' },
    ].map(e => ({ ...e, type: 'default', style: { stroke: '#71717a', strokeWidth: 2 }, animated: false }));

    return { nodes, edges };
};

const treeData = createTree();
const textbookData = createTextbookGraph();

export const PRESETS: Record<string, GraphPreset> = {
  'DFS': {
    description: "Hierarchical Tree (DFS): ค้นหาแบบลึก (Depth-First)",
    nodes: treeData.nodes,
    edges: treeData.edges
  },
  'BFS': {
    description: "Hierarchical Tree (BFS): ค้นหาแบบกว้าง (Breadth-First)",
    nodes: treeData.nodes,
    edges: treeData.edges
  },
  'Dijkstra': {
    description: "Standard Graph (Dijkstra): กราฟมาตรฐานที่มีน้ำหนักและเส้นเชื่อมซับซ้อน",
    nodes: textbookData.nodes,
    edges: textbookData.edges
  },
  'MST-Prim': {
    description: "Standard Graph (Prim): กราฟมาตรฐานสำหรับทดสอบ Minimum Spanning Tree",
    nodes: textbookData.nodes,
    edges: textbookData.edges
  },
  'MST-Kruskal': {
    description: "Standard Graph (Kruskal): กราฟมาตรฐานสำหรับทดสอบ Minimum Spanning Tree",
    nodes: textbookData.nodes,
    edges: textbookData.edges
  }
};