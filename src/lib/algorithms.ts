import { Node, Edge } from '@xyflow/react';

export type AlgoStep = 
  | { type: 'visit-node'; nodeId: string; description: string }
  | { type: 'traverse-edge'; edgeId: string; description: string }
  | { type: 'highlight-path'; nodeId?: string; edgeId?: string; description: string };

const getAdjacencyList = (nodes: Node[], edges: Edge[]) => {
  const adj = new Map<string, { nodeId: string; edgeId: string; weight: number }[]>();
  
  nodes.forEach(node => adj.set(node.id, []));
  
  edges.forEach(edge => {
    const weight = parseFloat(edge.label as string) || 1;
    adj.get(edge.source)?.push({ nodeId: edge.target, edgeId: edge.id, weight });
    adj.get(edge.target)?.push({ nodeId: edge.source, edgeId: edge.id, weight });
  });

  adj.forEach(neighbors => {
     neighbors.sort((a, b) => a.nodeId.localeCompare(b.nodeId));
  });

  return adj;
};

export const bfs = (nodes: Node[], edges: Edge[], startNodeId: string): AlgoStep[] => {
  if (!startNodeId || nodes.length === 0) return [];
  const steps: AlgoStep[] = [];
  const adj = getAdjacencyList(nodes, edges);
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];

  visited.add(startNodeId);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const label = nodes.find(n => n.id === currentId)?.data.label || currentId;
    
    steps.push({ 
        type: 'visit-node', 
        nodeId: currentId,
        description: `Visiting Node ${label}. Checking neighbors...`
    });

    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.nodeId)) {
        visited.add(neighbor.nodeId);
        const neighborLabel = nodes.find(n => n.id === neighbor.nodeId)?.data.label || neighbor.nodeId;
        
        steps.push({ 
            type: 'traverse-edge', 
            edgeId: neighbor.edgeId,
            description: `Found unvisited neighbor ${neighborLabel}. Adding to queue.`
        });
        queue.push(neighbor.nodeId);
      }
    }
  }
  return steps;
};

export const dfs = (nodes: Node[], edges: Edge[], startNodeId: string): AlgoStep[] => {
  if (!startNodeId || nodes.length === 0) return [];
  const steps: AlgoStep[] = [];
  const adj = getAdjacencyList(nodes, edges);
  const visited = new Set<string>();

  const traverse = (currentId: string) => {
      visited.add(currentId);
      const label = nodes.find(n => n.id === currentId)?.data.label || currentId;
      
      steps.push({ 
          type: 'visit-node', 
          nodeId: currentId,
          description: `Visiting Node ${label} (Depth-First).`
      });

      const neighbors = adj.get(currentId) || [];
      for (const neighbor of neighbors) {
          if (!visited.has(neighbor.nodeId)) {
              const neighborLabel = nodes.find(n => n.id === neighbor.nodeId)?.data.label || neighbor.nodeId;
              steps.push({ 
                  type: 'traverse-edge', 
                  edgeId: neighbor.edgeId,
                  description: `Exploring path from ${label} to ${neighborLabel}...`
              });
              traverse(neighbor.nodeId);
              
              steps.push({
                  type: 'visit-node', 
                  nodeId: currentId,
                  description: `Backtracked to Node ${label}.`
              });
          }
      }
  };

  traverse(startNodeId);
  return steps;
};

export const dijkstra = (nodes: Node[], edges: Edge[], startNodeId: string, endNodeId?: string | null): AlgoStep[] => {
  if (!startNodeId || nodes.length === 0) return [];
  const steps: AlgoStep[] = [];
  const adj = getAdjacencyList(nodes, edges);
  
  const dist = new Map<string, number>();
  const prevEdge = new Map<string, string>();
  const prevNode = new Map<string, string>();
  const visited = new Set<string>();
  
  nodes.forEach(n => dist.set(n.id, Infinity));
  dist.set(startNodeId, 0);

  const pq: { id: string; dist: number }[] = [{ id: startNodeId, dist: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u } = pq.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    const uLabel = nodes.find(n => n.id === u)?.data.label || u;

    if (u !== startNodeId && prevEdge.has(u)) {
        steps.push({ 
            type: 'traverse-edge', 
            edgeId: prevEdge.get(u)!,
            description: `Traversing shortest path to ${uLabel}.`
        });
    }
    steps.push({ 
        type: 'visit-node', 
        nodeId: u,
        description: `Processing Node ${uLabel}. Min Distance: ${dist.get(u)}.`
    });

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
        if (visited.has(v.nodeId)) continue;
        
        const alt = dist.get(u)! + v.weight;
        if (alt < dist.get(v.nodeId)!) {
            dist.set(v.nodeId, alt);
            prevEdge.set(v.nodeId, v.edgeId);
            prevNode.set(v.nodeId, u);
            pq.push({ id: v.nodeId, dist: alt });
        }
    }
  }

  // Highlight Path Logic
  if (endNodeId && dist.get(endNodeId) !== Infinity) {
      let curr = endNodeId;
      const pathStack = [];
      
      while (curr !== startNodeId) {
          const edgeId = prevEdge.get(curr);
          const pNode = prevNode.get(curr);
          if (edgeId && pNode) {
              pathStack.push({ nodeId: curr, edgeId });
              curr = pNode;
          } else {
              break;
          }
      }
      pathStack.push({ nodeId: startNodeId }); 

      while (pathStack.length > 0) {
          const item = pathStack.pop();
          if (item) {
              steps.push({
                  type: 'highlight-path',
                  nodeId: item.nodeId,
                  edgeId: item.edgeId,
                  description: `Highlighting Shortest Path Part.`
              });
          }
      }
  }

  return steps;
};

// ✅ แก้ไข: เพิ่ม Parameter startNodeId
export const prim = (nodes: Node[], edges: Edge[], startNodeId: string): AlgoStep[] => {
  if (!startNodeId || nodes.length === 0) return [];
  
  const steps: AlgoStep[] = [];
  const adj = getAdjacencyList(nodes, edges);
  const visited = new Set<string>();
  
  // ✅ ใช้ startNodeId ที่รับมา แทนการ Hardcode nodes[0]
  const pq: { nodeId: string; weight: number; edgeId?: string; fromNodeId?: string }[] = [{ nodeId: startNodeId, weight: 0 }];
  
  while (pq.length > 0) {
    pq.sort((a, b) => a.weight - b.weight);
    const { nodeId, edgeId, weight } = pq.shift()!;
    
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const nodeLabel = nodes.find(n => n.id === nodeId)?.data.label || nodeId;

    if (edgeId) {
        steps.push({ 
            type: 'traverse-edge', 
            edgeId,
            description: `Selected cheapest edge (Weight: ${weight}) to ${nodeLabel}.`
        });
    }
    steps.push({ 
        type: 'visit-node', 
        nodeId,
        description: `Added Node ${nodeLabel} to MST.`
    });

    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor.nodeId)) {
            pq.push({ 
                nodeId: neighbor.nodeId, 
                weight: neighbor.weight, 
                edgeId: neighbor.edgeId,
                fromNodeId: nodeId
            });
        }
    }
  }
  
  return steps;
};

export const kruskal = (nodes: Node[], edges: Edge[]): AlgoStep[] => {
  const steps: AlgoStep[] = [];
  
  const sortedEdges = [...edges].sort((a, b) => {
      const wA = parseFloat(a.label as string) || 1;
      const wB = parseFloat(b.label as string) || 1;
      return wA - wB;
  });
  
  const parent = new Map<string, string>();
  nodes.forEach(n => parent.set(n.id, n.id));

  const find = (i: string): string => {
      if (parent.get(i) === i) return i;
      const root = find(parent.get(i)!);
      parent.set(i, root);
      return root;
  };

  const union = (i: string, j: string) => {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
          parent.set(rootI, rootJ);
          return true;
      }
      return false;
  };

  for (const edge of sortedEdges) {
      const rootSource = find(edge.source);
      const rootTarget = find(edge.target);
      
      if (rootSource !== rootTarget) {
          union(rootSource, rootTarget);
          const w = edge.label || 1;
          
          steps.push({ 
              type: 'traverse-edge', 
              edgeId: edge.id,
              description: `Selected edge with weight ${w}. Connecting components.`
          });
          
          steps.push({ 
              type: 'visit-node', 
              nodeId: edge.source, 
              description: `Merged Node ${nodes.find(n=>n.id===edge.source)?.data.label} into set.` 
          });
          steps.push({ 
              type: 'visit-node', 
              nodeId: edge.target,
              description: `Merged Node ${nodes.find(n=>n.id===edge.target)?.data.label} into set.` 
          });
      }
  }

  return steps;
};