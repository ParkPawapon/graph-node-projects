import { Node, Edge } from '@xyflow/react';

export type GraphPreset = {
  nodes: Node[];
  edges: Edge[];
  description: string;
};

const createTree = () => {
    const nodes: Node[] = [
        { id: '1', position: { x: 400, y: 50 }, data: { label: '1' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '2', position: { x: 250, y: 180 }, data: { label: '2' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '3', position: { x: 550, y: 180 }, data: { label: '3' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '4', position: { x: 100, y: 320 }, data: { label: '4' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '5', position: { x: 250, y: 320 }, data: { label: '5' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '6', position: { x: 400, y: 320 }, data: { label: '6' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '7', position: { x: 700, y: 320 }, data: { label: '7' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '8', position: { x: 400, y: 450 }, data: { label: '8' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '9', position: { x: 700, y: 450 }, data: { label: '9' }, type: 'default', style: { width: 56, height: 56 } },
    ];

    const edges: Edge[] = [
        { id: 'e-1-2', source: '1', target: '2', label: '1' },
        { id: 'e-1-3', source: '1', target: '3', label: '1' },
        { id: 'e-2-4', source: '2', target: '4', label: '1' },
        { id: 'e-2-5', source: '2', target: '5', label: '1' },
        { id: 'e-2-6', source: '2', target: '6', label: '1' },
        { id: 'e-3-7', source: '3', target: '7', label: '1' },
        { id: 'e-6-8', source: '6', target: '8', label: '1' },
        { id: 'e-7-9', source: '7', target: '9', label: '1' },
    ].map(e => ({ ...e, type: 'default', style: { stroke: '#71717a', strokeWidth: 2 }, animated: false }));

    return { nodes, edges };
};

const createDiamondGraph = () => {
    const nodes: Node[] = [
        { id: '1', position: { x: 50, y: 250 }, data: { label: '1' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '2', position: { x: 200, y: 100 }, data: { label: '2' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '3', position: { x: 200, y: 400 }, data: { label: '3' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '4', position: { x: 400, y: 100 }, data: { label: '4' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '5', position: { x: 400, y: 400 }, data: { label: '5' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '6', position: { x: 550, y: 250 }, data: { label: '6' }, type: 'default', style: { width: 56, height: 56 } },
    ];

    const edges: Edge[] = [
        { id: 'e-1-2', source: '1', target: '2', label: '5' },
        { id: 'e-1-3', source: '1', target: '3', label: '2' },
        { id: 'e-2-3', source: '2', target: '3', label: '1' }, 
        { id: 'e-2-4', source: '2', target: '4', label: '4' },
        { id: 'e-3-5', source: '3', target: '5', label: '7' },
        { id: 'e-4-5', source: '4', target: '5', label: '1' },
        { id: 'e-4-6', source: '4', target: '6', label: '3' },
        { id: 'e-5-6', source: '5', target: '6', label: '1' },
    ].map(e => ({ ...e, type: 'default', style: { stroke: '#71717a', strokeWidth: 2 }, animated: false }));

    return { nodes, edges };
};

const createGridGraph = (rows: number, cols: number) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const spacingX = 180;
    const spacingY = 120;
    const startX = 100;
    const startY = 50;

    let nodeCount = 1;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const id = `${nodeCount}`;
            const label = id;
            
            nodes.push({
                id,
                position: { x: startX + c * spacingX, y: startY + r * spacingY },
                data: { label },
                type: 'default',
                style: { width: 56, height: 56 }
            });

            if (c > 0) {
                const prevId = `${nodeCount - 1}`;
                const weight = Math.floor(Math.random() * 5) + 1;
                edges.push({
                    id: `e-${prevId}-${id}`,
                    source: prevId,
                    target: id,
                    label: weight.toString(),
                    type: 'default',
                    style: { stroke: '#71717a', strokeWidth: 2 }
                });
            }

            if (r > 0) {
                const aboveId = `${nodeCount - cols}`;
                const weight = Math.floor(Math.random() * 8) + 1;
                edges.push({
                    id: `e-${aboveId}-${id}`,
                    source: aboveId,
                    target: id,
                    label: weight.toString(),
                    type: 'default',
                    style: { stroke: '#71717a', strokeWidth: 2 }
                });
            }
            nodeCount++;
        }
    }
    return { nodes, edges };
};

const createWheelGraph = (outerCount: number, radius: number) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const centerX = 400;
    const centerY = 300;

    nodes.push({
        id: '1',
        position: { x: centerX, y: centerY },
        data: { label: '1' },
        type: 'default',
        style: { width: 56, height: 56 }
    });

    for (let i = 1; i <= outerCount; i++) {
        const angle = ((i - 1) / outerCount) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const id = `${i + 1}`;
        
        nodes.push({
            id,
            position: { x, y },
            data: { label: id },
            type: 'default',
            style: { width: 56, height: 56 }
        });

        const weightCenter = Math.floor(Math.random() * 10) + 1;
        edges.push({
            id: `e-1-${id}`,
            source: '1',
            target: id,
            label: weightCenter.toString(),
            type: 'default',
            style: { stroke: '#71717a', strokeWidth: 2 }
        });

        if (i > 1) {
            const prevId = `${i}`;
            const weightRim = Math.floor(Math.random() * 5) + 1;
            edges.push({
                id: `e-${prevId}-${id}`,
                source: prevId,
                target: id,
                label: weightRim.toString(),
                type: 'default',
                style: { stroke: '#71717a', strokeWidth: 2 }
            });
        }
    }

    const lastId = `${outerCount + 1}`;
    const firstOuterId = `2`;
    edges.push({
        id: `e-${lastId}-${firstOuterId}`,
        source: lastId,
        target: firstOuterId,
        label: Math.floor(Math.random() * 5 + 1).toString(),
        type: 'default',
        style: { stroke: '#71717a', strokeWidth: 2 }
    });

    return { nodes, edges };
};

const createTextbookGraph = () => {
    const nodes: Node[] = [
        { id: '1', position: { x: 50, y: 250 }, data: { label: '1' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '2', position: { x: 230, y: 100 }, data: { label: '2' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '3', position: { x: 410, y: 100 }, data: { label: '3' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '4', position: { x: 590, y: 100 }, data: { label: '4' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '5', position: { x: 770, y: 250 }, data: { label: '5' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '6', position: { x: 590, y: 400 }, data: { label: '6' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '7', position: { x: 410, y: 400 }, data: { label: '7' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '8', position: { x: 230, y: 400 }, data: { label: '8' }, type: 'default', style: { width: 56, height: 56 } },
        { id: '9', position: { x: 410, y: 250 }, data: { label: '9' }, type: 'default', style: { width: 56, height: 56 } },
    ];

    const edges: Edge[] = [
        { id: 'e-1-2', source: '1', target: '2', label: '4' },
        { id: 'e-1-8', source: '1', target: '8', label: '8' },
        { id: 'e-2-3', source: '2', target: '3', label: '8' },
        { id: 'e-2-8', source: '2', target: '8', label: '11' },
        { id: 'e-3-4', source: '3', target: '4', label: '7' },
        { id: 'e-3-9', source: '3', target: '9', label: '2' },
        { id: 'e-3-6', source: '3', target: '6', label: '4' },
        { id: 'e-4-5', source: '4', target: '5', label: '9' },
        { id: 'e-4-6', source: '4', target: '6', label: '14' },
        { id: 'e-5-6', source: '5', target: '6', label: '10' },
        { id: 'e-6-7', source: '6', target: '7', label: '2' },
        { id: 'e-7-8', source: '7', target: '8', label: '1' },
        { id: 'e-7-9', source: '7', target: '9', label: '6' },
        { id: 'e-8-9', source: '8', target: '9', label: '7' },
    ].map(e => ({ ...e, type: 'default', style: { stroke: '#71717a', strokeWidth: 2 }, animated: false }));

    return { nodes, edges };
};

const treeData = createTree();
const gridData = createGridGraph(3, 4);
const wheelData = createWheelGraph(6, 200);
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
    description: "Grid Network (Dijkstra): โครงสร้างแบบตารางเมือง (City Block)",
    nodes: gridData.nodes,
    edges: gridData.edges
  },
  'MST-Prim': {
    description: "Wheel Network (Prim): โครงสร้างแบบล้อเกวียน",
    nodes: wheelData.nodes,
    edges: wheelData.edges
  },
  'MST-Kruskal': {
    description: "Standard Graph (Kruskal): กราฟมาตรฐานสำหรับทดสอบ Minimum Spanning Tree",
    nodes: textbookData.nodes,
    edges: textbookData.edges
  }
};