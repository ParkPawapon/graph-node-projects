export type AlgoExplanation = {
  title: string;
  concept: string;
  dataStructure: string;
  steps: string[];
  complexity: string;
  application: string;
};

export const EXPLANATIONS: Record<string, AlgoExplanation> = {
  'DFS': {
    title: "Depth-First Search (DFS)",
    concept: "การค้นหาแบบแนวลึก (Depth-First) คือการพยายามเดินทางไปข้างหน้าให้ลึกที่สุดเท่าที่จะทำได้ในเส้นทางหนึ่งๆ จนกว่าจะเจอทางตัน แล้วจึงย้อนกลับ (Backtrack) มายังจุดแยกก่อนหน้าเพื่อไปเส้นทางอื่น เปรียบเสมือนการเดินเขาวงกตที่เดินไปจนสุดทางแล้วค่อยถอยกลับมาหาทางแยกใหม่",
    dataStructure: "Stack (LIFO: Last-In, First-Out) หรือ Recursion (Call Stack)",
    steps: [
      "1. เริ่มต้นที่ Node ราก (Start Node) และกำหนดให้เป็น visited เพื่อไม่ให้กลับมาซ้ำ",
      "2. ตรวจสอบ Node ข้างเคียง (Neighbor) ของ Node ปัจจุบัน",
      "3. ถ้ามี Neighbor ที่ยังไม่ visited: ให้เลือกไป 1 ทางทันที (Push ลง Stack หรือ Recursive Call) และทำซ้ำขั้นตอนที่ 2 กับ Node ใหม่",
      "4. ถ้าทางตัน (ไม่มี Neighbor ที่ยังไม่ visited): ให้ถอยหลังกลับ (Backtrack / Pop จาก Stack) กลับมายัง Node ก่อนหน้า",
      "5. ทำซ้ำจนกว่า Stack จะว่าง หรือค้นหาเจอ Node ปลายทางที่ต้องการ"
    ],
    complexity: "Time: O(V + E) | Space: O(V)",
    application: "ใช้ตรวจสอบ Cycle ในกราฟ, การหาเส้นทางในเขาวงกต (Maze Solving), Topological Sorting"
  },
  'BFS': {
    title: "Breadth-First Search (BFS)",
    concept: "การค้นหาแบบแนวขวาง (Breadth-First) คือการค้นหาแบบกระจายตัวเป็นวงกว้างเหมือนคลื่นน้ำที่กระเพื่อมออกจากจุดศูนย์กลาง โดยจะเยี่ยมชม Node เพื่อนบ้านในระยะที่ 1 (Neighbors) ทั้งหมดก่อน แล้วจึงค่อยขยับไปเยี่ยมชม Node ในระยะถัดไป (Neighbors of Neighbors) ตามลำดับชั้น (Layer)",
    dataStructure: "Queue (FIFO: First-In, First-Out)",
    steps: [
      "1. เริ่มต้นที่ Node ราก (Start Node) ใส่ลงใน Queue และกำหนดให้เป็น visited",
      "2. ดึง Node หน้าสุดออกจาก Queue (Dequeue) มาเป็น Node ปัจจุบันเพื่อประมวลผล",
      "3. นำ Node เพื่อนบ้าน (Neighbors) ทั้งหมดของ Node ปัจจุบันที่ยังไม่ visited ใส่ต่อท้าย Queue (Enqueue) และกำหนดให้ visited ทันที",
      "4. กลับไปทำขั้นตอนที่ 2 และ 3 ซ้ำเรื่อยๆ จนกว่า Queue จะว่าง",
      "5. ผลลัพธ์จะได้ลำดับการเยี่ยมชมที่ไล่ไปทีละชั้น (Layer by Layer) ซึ่งรับประกันว่าจะเจอเส้นทางที่สั้นที่สุดใน Unweighted Graph"
    ],
    complexity: "Time: O(V + E) | Space: O(V)",
    application: "การหา Shortest Path ใน Unweighted Graph, การกระจายสัญญาณเครือข่าย (Broadcasting), GPS ระยะใกล้"
  },
  'Dijkstra': {
    title: "Dijkstra's Algorithm",
    concept: "อัลกอริทึมสำหรับหาเส้นทางที่สั้นที่สุด (Shortest Path) จากจุดเริ่มต้นไปยังจุดอื่นๆ ในกราฟที่มีน้ำหนัก (Weighted Graph) โดยมีหลักการแบบ Greedy คือเลือกเส้นทางที่มีผลรวมน้ำหนักน้อยที่สุดเสมอ ณ ขณะนั้น",
    dataStructure: "Priority Queue (Min-Heap)",
    steps: [
        "1. กำหนดค่าระยะทางเริ่มต้น (Distance) ของ Start Node เป็น 0 และ Node อื่นๆ เป็น Infinity",
        "2. ใส่ Start Node ลงใน Priority Queue",
        "3. ดึง Node ที่มีค่า Distance น้อยที่สุดออกจาก Queue (สมมติชื่อ U)",
        "4. พิจารณาเพื่อนบ้าน (V) ของ U: ถ้า Distance(U) + Weight(U,V) น้อยกว่า Distance(V) เดิม ให้ปรับปรุงค่า Distance(V) ใหม่",
        "5. ทำซ้ำจนกว่าจะเยี่ยมชมครบทุก Node หรือ Queue ว่าง"
    ],
    complexity: "O(E + V log V)",
    application: "Google Maps, ระบบนำทาง GPS, Routing Protocols ในเครือข่าย (OSPF)"
  },
  'MST-Prim': {
    title: "Prim's Algorithm",
    concept: "อัลกอริทึมสำหรับหา Minimum Spanning Tree (MST) โดยเริ่มสร้างต้นไม้จาก Node หนึ่ง แล้วค่อยๆ ขยายกิ่งก้านไปยัง Node ที่ใกล้ที่สุด (น้ำหนักเส้นน้อยที่สุด) ที่เชื่อมต่อกับต้นไม้เดิม",
    dataStructure: "Priority Queue",
    steps: [
        "1. เลือก Node เริ่มต้น 1 จุด ให้เป็นส่วนหนึ่งของ MST",
        "2. ใส่เส้นเชื่อม (Edges) ทั้งหมดที่ต่อจาก Node ใน MST ลงใน Priority Queue",
        "3. ดึงเส้นที่มีน้ำหนักน้อยที่สุดออกมา ถ้าเส้นนั้นเชื่อมไปยัง Node ที่ยังไม่อยู่ใน MST ให้เพิ่ม Node นั้นและเส้นนั้นเข้าสู่ MST",
        "4. ทำซ้ำจนกว่าจะครบทุก Node ในกราฟ"
    ],
    complexity: "O(E log V)",
    application: "การออกแบบเครือข่ายสาย LAN, การวางท่อประปาเพื่อประหยัดงบประมาณ"
  },
  'MST-Kruskal': {
    title: "Kruskal's Algorithm",
    concept: "อัลกอริทึมหา Minimum Spanning Tree (MST) โดยพิจารณาที่เส้นเชื่อม (Edge) เป็นหลัก จะเลือกเส้นที่มีน้ำหนักน้อยที่สุดในกราฟมาเชื่อมต่อกันเรื่อยๆ โดยต้องระวังไม่ให้เกิดวงจร (Cycle)",
    dataStructure: "Union-Find (Disjoint Set)",
    steps: [
        "1. เรียงลำดับเส้นเชื่อม (Edges) ทั้งหมดจากน้ำหนักน้อยไปมาก",
        "2. วนลูปพิจารณาเส้นเชื่อมทีละเส้น (จากน้อยไปมาก)",
        "3. ถ้าเส้นเชื่อมนั้นเชื่อม 2 จุดที่อยู่คนละกลุ่มกัน (ใช้ Union-Find ตรวจสอบ) ให้เลือกเส้นนั้นเป็น MST และรวมกลุ่มกัน",
        "4. ถ้าเชื่อมแล้วเกิด Cycle ให้ข้ามเส้นนั้นไป",
        "5. ทำซ้ำจนกว่าจะได้เส้นเชื่อมครบ V-1 เส้น"
    ],
    complexity: "O(E log E)",
    application: "การเชื่อมต่อโครงข่ายไฟฟ้า, การวิเคราะห์ Cluster Analysis"
  }
};