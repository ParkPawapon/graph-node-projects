import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
} from '@xyflow/react';
import { PRESETS } from '@/data/presets';
import { bfs, dfs, dijkstra, prim, kruskal, type AlgoStep } from '@/lib/algorithms';
import { GitCommit, Share2, Layers, Hash } from 'lucide-react'; 

interface ResultData {
  type: 'traversal' | 'path' | 'mst';
  summary: string;
  stats: { label: string; value: string | number; icon?: any }[];
  details?: string;
}

interface GraphState {
  nodes: Node[];
  edges: Edge[];
  selectedAlgo: string;
  isRunning: boolean;
  isFinished: boolean;
  startNodeId: string | null;
  endNodeId: string | null;
  executionResult: ResultData | null;
  logs: string[];
  animationSpeed: number;
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  addNode: (position?: { x: number; y: number }) => void;
  resetGraph: () => void;
  clearCanvas: () => void;
  setAlgorithm: (algo: string) => void;
  runAlgorithm: () => Promise<void>;
  deleteSelectedElements: (nodeIds: string[], edgeIds: string[]) => void;
  
  setStartNode: (id: string) => void;
  setEndNode: (id: string) => void;
  updateEdgeLabel: (edgeId: string, newLabel: string) => void;
  setAnimationSpeed: (speed: number) => void;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const generateLabel = (index: number): string => {
  let label = '';
  index++;
  while (index > 0) {
    index--;
    label = String.fromCharCode(65 + (index % 26)) + label;
    index = Math.floor(index / 26);
  }
  return label;
};

const withDimensions = (nodes: Node[]) => {
    return nodes.map(n => ({
        ...n,
        style: { ...n.style, width: 56, height: 56 }, 
    }));
};

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedAlgo: 'DFS',
  isRunning: false,
  isFinished: false,
  startNodeId: null,
  endNodeId: null,
  executionResult: null,
  logs: [],
  animationSpeed: 500,

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection: Connection) => {
    if (connection.source === connection.target) return;
    const exists = get().edges.some(
      e => (e.source === connection.source && e.target === connection.target) ||
           (e.source === connection.target && e.target === connection.source)
    );
    if (exists) return;
    const edge = { 
      ...connection, 
      type: 'default', 
      animated: false, 
      label: '1', 
      style: { stroke: '#71717a', strokeWidth: 2 } 
    };
    set({ edges: addEdge(edge, get().edges) });
  },

  addNode: (position) => {
    const { nodes } = get();
    const id = `${nodes.length + 1}-${Date.now()}`;
    const label = generateLabel(nodes.length);
    const newNode: Node = {
      id,
      type: 'default',
      position: position || { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      data: { label },
      style: { width: 56, height: 56 },
      draggable: true,
      connectable: true,
    };
    set({ nodes: [...nodes, newNode] });
  },

  deleteSelectedElements: (nodeIds, edgeIds) => {
    const { nodes, edges, startNodeId, endNodeId } = get();
    const remainingNodes = nodes.filter(n => !nodeIds.includes(n.id));
    const remainingEdges = edges.filter(e => 
        !edgeIds.includes(e.id) && 
        !nodeIds.includes(e.source) && 
        !nodeIds.includes(e.target)
    );
    let newStart = startNodeId && nodeIds.includes(startNodeId) ? null : startNodeId;
    let newEnd = endNodeId && nodeIds.includes(endNodeId) ? null : endNodeId;
    set({ nodes: remainingNodes, edges: remainingEdges, startNodeId: newStart, endNodeId: newEnd });
  },

  clearCanvas: () => {
    set({ nodes: [], edges: [], isRunning: false, isFinished: false, startNodeId: null, endNodeId: null, executionResult: null, logs: [] });
  },

  resetGraph: () => {
     const currentAlgo = get().selectedAlgo;
     const preset = PRESETS[currentAlgo];
     const newNodes = preset ? withDimensions(JSON.parse(JSON.stringify(preset.nodes))) : [];
     set({ 
         nodes: newNodes, 
         edges: preset ? JSON.parse(JSON.stringify(preset.edges)) : [],
         isRunning: false,
         isFinished: false,
         startNodeId: newNodes.length > 0 ? newNodes[0].id : null,
         endNodeId: null,
         executionResult: null,
         logs: []
     });
  },

  setAlgorithm: (algo: string) => {
    const preset = PRESETS[algo];
    if (preset) {
        const newNodes = withDimensions(JSON.parse(JSON.stringify(preset.nodes)));
        set({ 
            selectedAlgo: algo, 
            nodes: newNodes, 
            edges: JSON.parse(JSON.stringify(preset.edges)),
            isRunning: false,
            isFinished: false,
            startNodeId: newNodes.length > 0 ? newNodes[0].id : null,
            endNodeId: null,
            executionResult: null,
            logs: []
        });
    }
  },

  setStartNode: (id: string) => {
    const { nodes, endNodeId } = get();
    const updatedNodes = nodes.map(n => ({
        ...n,
        className: n.id === id ? 'is-start' : (n.id === endNodeId ? 'is-end' : '')
    }));
    set({ startNodeId: id, nodes: updatedNodes, isFinished: false, executionResult: null, logs: [] });
  },

  setEndNode: (id: string) => {
    const { nodes, startNodeId } = get();
    const updatedNodes = nodes.map(n => ({
        ...n,
        className: n.id === startNodeId ? 'is-start' : (n.id === id ? 'is-end' : '')
    }));
    set({ endNodeId: id, nodes: updatedNodes, isFinished: false, executionResult: null, logs: [] });
  },

  updateEdgeLabel: (edgeId: string, newLabel: string) => {
    const { edges } = get();
    const updatedEdges = edges.map(e => e.id === edgeId ? { ...e, label: newLabel } : e);
    set({ edges: updatedEdges, isFinished: false, executionResult: null, logs: [] });
  },

  setAnimationSpeed: (speed: number) => {
      set({ animationSpeed: speed });
  },

  runAlgorithm: async () => {
    const { nodes, edges, selectedAlgo, isRunning, startNodeId, endNodeId } = get();
    if (isRunning || nodes.length === 0) return;

    set({ isRunning: true, isFinished: false, executionResult: null, logs: [] });

    const currentStartNode = startNodeId ? startNodeId : nodes[0].id;

    set({
        nodes: nodes.map(n => ({ 
            ...n, 
            className: n.id === currentStartNode ? 'is-start' : (n.id === endNodeId ? 'is-end' : ''), 
            style: { ...n.style, width: 56, height: 56 } 
        })),
        edges: edges.map(e => ({ ...e, animated: false, className: '', style: { ...e.style, stroke: '#71717a', strokeWidth: 2 } }))
    });
    
    set(state => ({ logs: [...state.logs, `> Starting ${selectedAlgo}...`] }));
    await sleep(get().animationSpeed);

    let steps: AlgoStep[] = [];

    switch (selectedAlgo) {
        case 'BFS': steps = bfs(nodes, edges, currentStartNode); break;
        case 'DFS': steps = dfs(nodes, edges, currentStartNode); break;
        case 'Dijkstra': steps = dijkstra(nodes, edges, currentStartNode, endNodeId); break;
        case 'MST-Prim': steps = prim(nodes, edges); break;
        case 'MST-Kruskal': steps = kruskal(nodes, edges); break;
        default: steps = dfs(nodes, edges, currentStartNode);
    }

    for (const step of steps) {
        const currentSpeed = get().animationSpeed;

        set(state => ({ logs: [...state.logs, `> ${step.description}`] }));

        if (step.type === 'visit-node') {
            set(state => ({
                nodes: state.nodes.map(n => {
                    if (n.id === step.nodeId) {
                        let baseClass = 'node-visited';
                        if (n.id === currentStartNode) baseClass += ' is-start';
                        if (n.id === endNodeId) baseClass += ' is-end';
                        return { ...n, className: baseClass.trim() };
                    }
                    return n;
                })
            }));
            await sleep(currentSpeed);
        } 
        else if (step.type === 'traverse-edge') {
            set(state => ({
                edges: state.edges.map(e => e.id === step.edgeId ? { 
                    ...e, 
                    animated: true, 
                    style: { stroke: '#f59e0b', strokeWidth: 3 }
                } : e)
            }));
            await sleep(currentSpeed);
        }
        else if (step.type === 'highlight-path') {
            if (step.nodeId) {
                set(state => ({
                    nodes: state.nodes.map(n => n.id === step.nodeId ? { ...n, className: `${n.className} is-path` } : n)
                }));
            }
            if (step.edgeId) {
                set(state => ({
                    edges: state.edges.map(e => e.id === step.edgeId ? { 
                        ...e, 
                        className: 'edge-final',
                        animated: false
                    } : e)
                }));
            }
            await sleep(currentSpeed);
        }
    }

    const uniqueVisited = new Set<string>();
    
    // 1. Process Order (Full History including backtracking)
    const processPath = steps
        .filter(s => s.type === 'visit-node')
        .map(s => {
            const n = nodes.find(node => node.id === s.nodeId);
            return n?.data.label || s.nodeId;
        })
        .join(" -> ");

    // 2. Final Result (Unique Discovery Order)
    const finalAnswerPath = steps
        .filter(s => s.type === 'visit-node')
        .map(s => {
            const n = nodes.find(node => node.id === s.nodeId);
            return n?.data.label || s.nodeId;
        })
        .filter(label => {
            if (uniqueVisited.has(label)) return false;
            uniqueVisited.add(label);
            return true;
        })
        .join(" -> ");

    let consoleSummaryLogs: string[] = [];

    if (selectedAlgo === 'MST-Prim' || selectedAlgo === 'MST-Kruskal') {
        const traversedEdgeIds = steps.filter(s => s.type === 'traverse-edge').map(s => s.edgeId);
        const totalWeight = edges
            .filter(e => traversedEdgeIds.includes(e.id))
            .reduce((sum, e) => sum + Number(e.label || 0), 0);
        
        consoleSummaryLogs = [
            `----------------------------------------`,
            `🌲 MST Algorithm Process:`,
            `   Edges added in sequence shown in animation.`,
            `🏆 Final Answer (Minimum Cost):`,
            `   Total Weight: ${totalWeight}`,
            `----------------------------------------`
        ];
    } 
    else if (selectedAlgo === 'Dijkstra' && endNodeId) {
        const pathSteps = steps.filter(s => s.type === 'highlight-path' && s.nodeId);
        const pathEdges = steps.filter(s => s.type === 'highlight-path' && s.edgeId);
        
        if (pathSteps.length > 0) {
            const pathStr = pathSteps.map(s => {
                const n = nodes.find(node => node.id === s.nodeId);
                return n?.data.label || s.nodeId;
            }).join(" -> ");
            
            const totalWeight = edges
                .filter(e => pathEdges.some(p => p.edgeId === e.id))
                .reduce((sum, e) => sum + Number(e.label || 0), 0);

            consoleSummaryLogs = [
                `----------------------------------------`,
                `🤖 Algorithm Process (Exploration Order):`,
                `   ${processPath}`, // Exploration order
                `🏆 (Shortest Path):`,
                `   Path: ${pathStr}`,
                `   Total Weight: ${totalWeight}`,
                `----------------------------------------`
            ];
        } else {
            consoleSummaryLogs = [`❌ Target Unreachable`];
        }
    } 
    else {
        // BFS & DFS
        consoleSummaryLogs = [
            `----------------------------------------`,
            `🤖 Algorithm Process (How it thinks):`,
            `   ${processPath}`, // Full traversal including backtracking
            `👩‍🏫 (Final Result):`,
            `   ${finalAnswerPath}`, // Unique visited order
            `----------------------------------------`
        ];
    }

    set(state => ({ 
        logs: [
            ...state.logs, 
            ...consoleSummaryLogs,
            `> Algorithm Finished.`
        ] 
    }));

    let resultData: ResultData;
    const visitedCount = uniqueVisited.size > 0 ? uniqueVisited.size : steps.filter(s => s.type === 'visit-node').length;
    const edgeCount = steps.filter(s => s.type === 'traverse-edge').length;

    if (selectedAlgo === 'MST-Prim' || selectedAlgo === 'MST-Kruskal') {
        const traversedEdgeIds = steps.filter(s => s.type === 'traverse-edge').map(s => s.edgeId);
        const totalWeight = edges
            .filter(e => traversedEdgeIds.includes(e.id))
            .reduce((sum, e) => sum + Number(e.label || 0), 0);
        
        resultData = {
            type: 'mst',
            summary: `Total Weight: ${totalWeight}`,
            stats: [
                { label: 'Edges in MST', value: traversedEdgeIds.length, icon: Share2 },
                { label: 'Nodes Connected', value: visitedCount, icon: GitCommit },
                { label: 'Total Cost', value: totalWeight, icon: Hash },
            ],
            details: `Successfully constructed a Minimum Spanning Tree connecting ${visitedCount} nodes using ${traversedEdgeIds.length} edges with optimal weight.`
        };
    } else if (selectedAlgo === 'Dijkstra') {
        const pathEdges = steps.filter(s => s.type === 'highlight-path' && s.edgeId);
        const pathWeight = edges
                .filter(e => pathEdges.some(p => p.edgeId === e.id))
                .reduce((sum, e) => sum + Number(e.label || 0), 0);

        resultData = {
            type: 'path',
            summary: endNodeId ? `Path Found (Cost: ${pathWeight})` : "All Paths Explored",
            stats: [
                 { label: 'Nodes Visited', value: visitedCount, icon: GitCommit },
                 { label: 'Steps Taken', value: steps.length, icon: Layers },
            ],
            details: endNodeId 
                ? `Found shortest path from Start to Target with total weight ${pathWeight}. The path is highlighted in yellow.`
                : `Explored optimal paths from start node to all reachable nodes.`
        };
    } else {
        resultData = {
            type: 'traversal',
            summary: "Traversal Complete",
            stats: [
                { label: 'Nodes Visited', value: visitedCount, icon: GitCommit },
                { label: 'Edges Traversed', value: edgeCount, icon: Share2 },
            ],
            details: `Successfully traversed the graph using ${selectedAlgo}. Visited ${visitedCount} unique nodes. Order: ${finalAnswerPath}`
        };
    }

    set({ 
        isRunning: false, 
        isFinished: true,
        executionResult: resultData
    });
  }
}));