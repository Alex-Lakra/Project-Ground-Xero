import React, { useState, useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface NodeMapViewerProps {
  username: string;
  onClose: () => void;
  isLoggedIn: boolean;
  leetcodeUrl?: string;
  codeforcesUrl?: string;
}

interface GraphData {
  nodes: { id: string; group: number; label: string }[];
  links: { source: string; target: string; value: number }[];
}

export default function NodeMapViewer({ username, onClose, isLoggedIn, leetcodeUrl, codeforcesUrl }: NodeMapViewerProps) {
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const initialData: GraphData = {
    nodes: [
      { id: 'account', group: 1, label: username || 'User Account' },
      { id: 'projects', group: 2, label: 'Projects' },
      { id: 'leet', group: 3, label: 'LeetCode' },
      { id: 'codef', group: 4, label: 'Codeforces' },
    ],
    links: [
      { source: 'account', target: 'projects', value: 2 },
      { source: 'account', target: 'leet', value: 1 },
      { source: 'account', target: 'codef', value: 1 },
    ],
  };

  const [graphData, setGraphData] = useState<GraphData>(initialData);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [leetExpanded, setLeetExpanded] = useState(false);
  const [codefExpanded, setCodefExpanded] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle 'q' to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Extract username from profile URL
  const extractUsername = (profileUrl: string): string => {
    const trimmed = profileUrl.trim();
    try {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const urlObj = new URL(trimmed);
        const parts = urlObj.pathname.split("/").filter(Boolean);
        if (parts.length > 0) {
          return parts[parts.length - 1];
        }
      }
    } catch (e) {
      // ignore
    }
    return trimmed.replace(/\/$/, "").split("/").pop() || trimmed;
  };

  const handleNodeClick = useCallback(
    async (node: any) => {
      // Zoom to node
      fgRef.current?.centerAt(node.x, node.y, 1000);
      fgRef.current?.zoom(3, 1000);

      // Expand projects node
      if (node.id === 'projects' && !projectsExpanded) {
        setProjectsExpanded(true);
        setGraphData((prev) => ({
          nodes: [
            ...prev.nodes,
            { id: 'open_projects', group: 2, label: 'Open Projects' },
            { id: 'closed_projects', group: 2, label: 'Closed Projects' },
          ],
          links: [
            ...prev.links,
            { source: 'projects', target: 'open_projects', value: 1 },
            { source: 'projects', target: 'closed_projects', value: 1 },
          ],
        }));
      } else if (node.id === 'projects' && projectsExpanded) {
        setProjectsExpanded(false);
        setGraphData((prev) => ({
          nodes: prev.nodes.filter(n => n.id !== 'open_projects' && n.id !== 'closed_projects'),
          links: prev.links.filter(l => {
            const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
            return targetId !== 'open_projects' && targetId !== 'closed_projects';
          }),
        }));
      }

      // LeetCode Node
      if (node.id === 'leet' && !leetExpanded) {
        setLeetExpanded(true);
        if (!isLoggedIn) {
          setGraphData((prev) => ({
             nodes: [...prev.nodes, { id: 'leet_error', group: 3, label: '[ACCESS DENIED] Login required' }],
             links: [...prev.links, { source: 'leet', target: 'leet_error', value: 1 }]
          }));
        } else if (!leetcodeUrl) {
          setGraphData((prev) => ({
             nodes: [...prev.nodes, { id: 'leet_error', group: 3, label: 'Profile not configured (use /leet)' }],
             links: [...prev.links, { source: 'leet', target: 'leet_error', value: 1 }]
          }));
        } else {
          setGraphData((prev) => ({
             nodes: [...prev.nodes, { id: 'leet_loading', group: 3, label: 'Fetching data...' }],
             links: [...prev.links, { source: 'leet', target: 'leet_loading', value: 1 }]
          }));
          const leetUsername = extractUsername(leetcodeUrl);
          try {
            const response = await fetch('/api/scrape', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: leetUsername })
            });
            const data = await response.json();
            if (data.success) {
               setGraphData((prev) => ({
                 nodes: [
                   ...prev.nodes.filter(n => n.id !== 'leet_loading'),
                   { id: 'leet_easy', group: 3, label: `Easy: ${data.stats.easy}` },
                   { id: 'leet_medium', group: 3, label: `Medium: ${data.stats.medium}` },
                   { id: 'leet_hard', group: 3, label: `Hard: ${data.stats.hard}` }
                 ],
                 links: [
                   ...prev.links.filter(l => {
                     const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                     return targetId !== 'leet_loading';
                   }),
                   { source: 'leet', target: 'leet_easy', value: 1 },
                   { source: 'leet', target: 'leet_medium', value: 1 },
                   { source: 'leet', target: 'leet_hard', value: 1 }
                 ]
               }));
            } else {
               setGraphData((prev) => ({
                 nodes: [...prev.nodes.filter(n => n.id !== 'leet_loading'), { id: 'leet_error', group: 3, label: 'Error fetching stats' }],
                 links: [...prev.links.filter(l => {
                    const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                    return targetId !== 'leet_loading';
                 }), { source: 'leet', target: 'leet_error', value: 1 }]
               }));
            }
          } catch (e) {
             setGraphData((prev) => ({
                 nodes: [...prev.nodes.filter(n => n.id !== 'leet_loading'), { id: 'leet_error', group: 3, label: 'Network Error' }],
                 links: [...prev.links.filter(l => {
                    const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                    return targetId !== 'leet_loading';
                 }), { source: 'leet', target: 'leet_error', value: 1 }]
             }));
          }
        }
      } else if (node.id === 'leet' && leetExpanded) {
         setLeetExpanded(false);
         setGraphData((prev) => ({
            nodes: prev.nodes.filter(n => !n.id.toString().startsWith('leet_')),
            links: prev.links.filter(l => {
              const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
              return !targetId.toString().startsWith('leet_');
            })
         }));
      }

      // Codeforces Node
      if (node.id === 'codef' && !codefExpanded) {
        setCodefExpanded(true);
        if (!isLoggedIn) {
          setGraphData((prev) => ({
             nodes: [...prev.nodes, { id: 'codef_error', group: 4, label: '[ACCESS DENIED] Login required' }],
             links: [...prev.links, { source: 'codef', target: 'codef_error', value: 1 }]
          }));
        } else if (!codeforcesUrl) {
          setGraphData((prev) => ({
             nodes: [...prev.nodes, { id: 'codef_error', group: 4, label: 'Profile not configured (use /codef)' }],
             links: [...prev.links, { source: 'codef', target: 'codef_error', value: 1 }]
          }));
        } else {
          setGraphData((prev) => ({
             nodes: [...prev.nodes, { id: 'codef_loading', group: 4, label: 'Fetching data...' }],
             links: [...prev.links, { source: 'codef', target: 'codef_loading', value: 1 }]
          }));
          const codefUsername = extractUsername(codeforcesUrl);
          try {
            const response = await fetch('/api/scrape-codeforces', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: codefUsername })
            });
            const data = await response.json();
            if (data.success) {
               setGraphData((prev) => ({
                 nodes: [
                   ...prev.nodes.filter(n => n.id !== 'codef_loading'),
                   { id: 'codef_solved', group: 4, label: `Solved: ${data.stats.solved}` }
                 ],
                 links: [
                   ...prev.links.filter(l => {
                     const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                     return targetId !== 'codef_loading';
                   }),
                   { source: 'codef', target: 'codef_solved', value: 1 }
                 ]
               }));
            } else {
               setGraphData((prev) => ({
                 nodes: [...prev.nodes.filter(n => n.id !== 'codef_loading'), { id: 'codef_error', group: 4, label: 'Error fetching stats' }],
                 links: [...prev.links.filter(l => {
                    const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                    return targetId !== 'codef_loading';
                 }), { source: 'codef', target: 'codef_error', value: 1 }]
               }));
            }
          } catch (e) {
             setGraphData((prev) => ({
                 nodes: [...prev.nodes.filter(n => n.id !== 'codef_loading'), { id: 'codef_error', group: 4, label: 'Network Error' }],
                 links: [...prev.links.filter(l => {
                    const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
                    return targetId !== 'codef_loading';
                 }), { source: 'codef', target: 'codef_error', value: 1 }]
             }));
          }
        }
      } else if (node.id === 'codef' && codefExpanded) {
         setCodefExpanded(false);
         setGraphData((prev) => ({
            nodes: prev.nodes.filter(n => !n.id.toString().startsWith('codef_')),
            links: prev.links.filter(l => {
              const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
              return !targetId.toString().startsWith('codef_');
            })
         }));
      }
    },
    [projectsExpanded, leetExpanded, codefExpanded, isLoggedIn, leetcodeUrl, codeforcesUrl]
  );

  return (
    <div className="absolute inset-0 z-50 bg-black/95 flex flex-col font-mono text-[#e2e2e2]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[#5f3e3d] bg-black">
        <div>
          <h3 className="font-anton text-2xl text-white uppercase tracking-wider">
            Operator Node Map
          </h3>
          <p className="text-xs text-[#e9bcb9]">Press 'q' to exit map viewer</p>
        </div>
        {!isLoggedIn && (
           <div className="text-[#ff0033] text-xs md:text-sm animate-pulse border border-[#ff0033] px-3 py-2 bg-[#ff0033]/10 flex items-center">
             [GUEST MODE]: Authentication required for full access.
           </div>
        )}
      </div>
      
      {/* Graph Area */}
      <div className="flex-1 overflow-hidden relative cursor-crosshair">
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height - 80}
          graphData={graphData}
          nodeLabel=""
          backgroundColor="#000000"
          linkColor={() => '#ff0033'}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={d => (d.value as number) * 0.001}
          onNodeClick={handleNodeClick}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.label;
            const fontSize = 14 / globalScale;
            ctx.font = `${fontSize}px monospace`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4); 

            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2, 
              node.y - bckgDimensions[1] / 2, 
              bckgDimensions[0], 
              bckgDimensions[1]
            );

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // Determine node text color based on type
            if (node.id === 'account' || node.id.toString().includes('error')) {
               ctx.fillStyle = '#ff0033'; // Red for main account or errors
            } else {
               ctx.fillStyle = '#e2e2e2'; // Off-white for general
            }
            ctx.fillText(label, node.x, node.y);

            node.__bckgDimensions = bckgDimensions; 
          }}
          nodePointerAreaPaint={(node: any, color, ctx) => {
            ctx.fillStyle = color;
            const bckgDimensions = node.__bckgDimensions;
            bckgDimensions && ctx.fillRect(
              node.x - bckgDimensions[0] / 2, 
              node.y - bckgDimensions[1] / 2, 
              bckgDimensions[0], 
              bckgDimensions[1]
            );
          }}
        />
      </div>
    </div>
  );
}
