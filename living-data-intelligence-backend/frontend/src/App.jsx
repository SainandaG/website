// Cleaned up App.jsx
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WindowManagerProvider, useWindowManager } from './context/WindowManagerContext';
import Window from './components/WindowManager/Window';
import Taskbar from './components/WindowManager/Taskbar';
import ConnectionModal from './components/WindowManager/ConnectionModal';
import Settings from './components/Apps/Settings'; // Still used in openWindow('settings')

// New Dashboard Imports
import ThreeGraph from './components/Dashboard/ThreeGraph';
import Record3DGraph from './components/Dashboard/Record3DGraph';
import DrillDownView from './components/Dashboard/DrillDownView';
import DataFlowView from './components/Dashboard/DataFlowView';
import AnalyticsView from './components/Dashboard/AnalyticsView';
import SchemaView from './components/Dashboard/SchemaView';
import ChatInterface from './components/Dashboard/ChatInterface'; // New Chat
import NavigationBar from './components/Layout/NavigationBar';
import DashboardLayout from './components/Layout/DashboardLayout';
import { Legend, CirclePackOverlay, StatsDashboard } from './components/Dashboard/UIOverlay';
import VoiceControl from './components/Voice/VoiceControl';
import AgentStatusPanel from './components/Voice/AgentStatusPanel';
import { agentService } from './services/agentService';
import TimelinePlayer from './components/Evolution/TimelinePlayer';
import EvolutionOverlay from './components/Evolution/EvolutionOverlay';
import EvolutionMathOverlay from './components/Evolution/EvolutionMathOverlay';

const App = () => {
  return (
    <WindowManagerProvider>
      <MainDashboard />
    </WindowManagerProvider>
  );
};

const MainDashboard = () => {
  const graphRef = React.useRef(null);
  const { openWindow, windows, connectionId } = useWindowManager();
  const [selectedNode, setSelectedNode] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [showRecordGravity, setShowRecordGravity] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [graphData, setGraphData] = React.useState({ nodes: [], edges: [] });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [rlActive, setRlActive] = useState(false);
  const [clusteringMethod, setClusteringMethod] = useState('heuristic'); // 'heuristic' or 'networkx'
  const [mlInsights, setMlInsights] = useState(null);
  const [gravitySuggestions, setGravitySuggestions] = React.useState([]);

  // Navigation state
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'drilldown' | 'dataflow' | 'analytics' | 'schema'
  const [drillDownTable, setDrillDownTable] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const [liveStats, setLiveStats] = useState({
    totalTransactions: 0,
    fraudAlerts: 0,
    avgAmount: 0,
    failedTx: 0,
    tps: 0,
    activeNodes: 0,
    health: { state: 'healthy', score: 100, color: '#00ff88', issues: [] },
    anomalies: []
  });

  // Evolution Playback State
  const [evolutionMode, setEvolutionMode] = useState(false);
  const [currentSnapshot, setCurrentSnapshot] = useState(null);

  // WebSocket Connection for Real-time Monitoring
  useEffect(() => {
    if (!connectionId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${protocol}://localhost:8001/ws/${connectionId}`;

    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'metrics_update') {
        const metrics = data.data;
        const aiStats = data.ai_stats || {};

        // Update Live Dashboard Stats
        setLiveStats(prev => ({
          ...prev,
          totalTransactions: metrics.total_transactions,
          fraudAlerts: metrics.fraud_alerts,
          avgAmount: metrics.average_amount,
          failedTx: metrics.failed_transactions,
          tps: metrics.transaction_rate,
          activeNodes: aiStats.total_nodes || prev.activeNodes,
          health: data.health || prev.health,
          anomalies: data.anomalies || prev.anomalies
        }));

        // Update Neural Core Status Text
        if (aiStats.status) {
          setAiStatus(`Neural Core: ${aiStats.status} | Scanned: ${aiStats.scanned_nodes || 0}/${aiStats.total_nodes || 0}`);
        }

        // Update ML Insights Panel (Real-time) - preserve clusters
        setMlInsights(prev => ({
          ...prev,
          anomalyScore: (100 - (data.health?.score || 100)).toFixed(0),
          gravity: aiStats.avg_gravity ? `${aiStats.avg_gravity.toFixed(2)}x` : '1.0x',
          optimization: 'Active'
        }));

        // Update Hub Metrics Live
        if (selectedNode?.id === 'hub' && aiStats.patterns !== undefined) {
          setSelectedNode(prev => ({
            ...prev,
            customMetrics: {
              'Patterns Learned': aiStats.patterns,
              'Core Growth': `${aiStats.growth}x`,
              'Signal Load': aiStats.signal_load
            }
          }));
        }
      }
    };

    socket.onerror = (err) => console.error("WebSocket Error:", err);
    socket.onclose = () => console.warn("WebSocket Disconnected");

    return () => socket.close();
  }, [connectionId]);

  // Initial load check
  useEffect(() => {
    console.log('[App] Initial load check - connectionId:', connectionId);
    if (!connectionId) {
      // Show modal after a brief delay to let UI render
      setTimeout(() => {
        console.log('[App] Showing connection modal');
        setShowConnectModal(true);
      }, 500);
    } else {
      console.log('[App] ConnectionId exists, fetching graph data');
      fetchRealGraphData(connectionId);
    }
  }, [connectionId]);

  // Navigation handlers (Moved up to fix hoisting issues)
  const handleNavigate = React.useCallback((view) => {
    setViewMode(view);
    if (view === 'overview') {
      setBreadcrumbs([]);
      setDrillDownTable(null);
    }
  }, []);

  const handleNodeDrillDown = React.useCallback((nodeId) => {
    setViewMode('drilldown');
    setDrillDownTable(nodeId);
    setBreadcrumbs([
      { label: 'Overview', onClick: () => handleNavigate('overview') },
      { label: `Table: ${nodeId}` }
    ]);
  }, [handleNavigate]);

  const handleBackToOverview = React.useCallback(() => {
    setViewMode('overview');
    setDrillDownTable(null);
    setBreadcrumbs([]);
  }, []);

  const fetchGravitySuggestions = React.useCallback(async (connId) => {
    try {
      const resp = await fetch(`/api/ai/gravity-suggestions/${connId}`);
      if (!resp.ok) throw new Error('Failed to fetch suggestions');
      const data = await resp.json();
      setGravitySuggestions(data.suggestions || []);
      console.log('[App] AI Gravity Suggestions:', data.suggestions);
    } catch (e) {
      console.error('[App] Failed to fetch gravity suggestions:', e);
    }
  }, []);

  const fetchRealGraphData = React.useCallback(async (id) => {
    console.log('[App] fetchRealGraphData called with id:', id);
    setLoading(true);
    fetchGravitySuggestions(id);
    try {
      // Fetch from backend
      const url = `/api/graph/${id}`;
      console.log('[App] Fetching from:', url);
      const response = await fetch(url);
      console.log('[App] Response status:', response.status, response.ok);
      if (!response.ok) throw new Error('Failed to fetch graph');

      const rawData = await response.json();
      console.log('[App] Raw data received:', rawData);
      console.log('[App] Nodes count:', rawData.nodes?.length || 0);

      // --- Neural Core Integration logic ---
      if (rawData.neural_core) {
        const core = rawData.neural_core;
        const metrics = core.metrics || {};
        const aiStats = core.ai_stats || {};

        setAiStatus(`Neural Core: ${aiStats.status || 'ACTIVE'} | Scanned: ${aiStats.scanned_nodes || 0}/${aiStats.total_nodes || 0}`);

        setLiveStats(prev => ({
          ...prev,
          tps: metrics.transaction_rate || 0,
          fraudAlerts: metrics.fraud_alerts || 0,
          failedTx: metrics.failed_transactions || 0,
          avgAmount: metrics.average_amount || 0,
          activeNodes: aiStats.total_nodes || rawData.nodes.length,
          health: core.health || prev.health
        }));

        // Extract active clusters with table details
        const clusterMap = {};  // {cluster_name: [table1, table2, ...]}
        rawData.nodes.forEach(node => {
          if (node.cluster && node.name !== 'Neural Core') {
            if (!clusterMap[node.cluster]) {
              clusterMap[node.cluster] = [];
            }
            clusterMap[node.cluster].push(node.name);
          }
        });

        // Convert to array format for display
        const clusterDetails = Object.keys(clusterMap).map(clusterName => ({
          name: clusterName,
          tables: clusterMap[clusterName],
          count: clusterMap[clusterName].length
        }));

        // Populate ML Insights from Initial Data
        setMlInsights({
          anomalyScore: (100 - (core.health?.score || 100)).toFixed(0),
          gravity: aiStats.avg_gravity ? `${aiStats.avg_gravity.toFixed(2)}x` : '1.0x',
          optimization: 'Active',
          clusters: clusterDetails.length > 0 ? clusterDetails : null
        });

        // Update selected node to show global stats if Hub
        if (selectedNode?.id === 'hub') {
          setSelectedNode(prev => ({
            ...prev,
            customMetrics: {
              'Patterns Learned': aiStats.patterns || 0,
              'Core Growth': aiStats.growth ? `${aiStats.growth}x` : '1.0x',
              'Signal Load': aiStats.signal_load || 0
            }
          }));
        }

      } else {
        setAiStatus("Neural Core: Global Analysis Complete");
      }

      const nodesTransformed = (rawData.nodes || []).map((node, i) => {
        const x = typeof node.x === 'number' ? node.x : (Math.cos(i * 0.5) * (150 + i * 10));
        const y = typeof node.y === 'number' ? node.y : ((Math.random() - 0.5) * 200);
        const z = typeof node.z === 'number' ? node.z : (Math.sin(i * 0.5) * (150 + i * 10));

        // Derived for UIOverlay structure
        const columns = node.columns || [];
        const primary_keys = columns.filter(c => c.is_pk).map(c => c.name);
        const foreign_keys = columns.filter(c => c.is_fk).map(c => ({
          column: c.name,
          referenced_table: c.references || 'Unknown' // simplified
        }));

        const structure = {
          name: node.name,
          children: columns.map(col => ({
            name: col.name,
            type: col.is_pk ? 'PK' : (col.is_fk ? 'FK' : 'data'),
            value: 100
          }))
        };

        return {
          id: node.id,
          name: node.name,
          color: node.color ? parseInt(node.color.replace('#', '0x'), 16) : (node.group === 1 ? 0xfbbf24 : 0x22d3ee),
          size: node.size || (node.group === 1 ? 40 : 25),
          pos: [x, y, z],
          x: x,
          y: y,
          z: z,
          entity: node.entity || 'TABLE',
          rows: node.row_count ? node.row_count.toLocaleString() + ' Records' : 'Empty',
          metrics: node.metrics || [],
          columns: columns,
          primary_keys: primary_keys,
          foreign_keys: foreign_keys,
          structure: structure,

          // Neural Core Data
          vitality: node.vitality || 50,
          pulse_rate: node.pulse_rate || 1.0,
          glow_intensity: node.glow_intensity || 0.5,

          customMetrics: node.customMetrics || { // Add fallback if missing
            'Data Quality': `${Math.floor(Math.random() * 20 + 80)}%`,
            'Last Update': '2m ago'
          }
        };
      });

      const edgesTransformed = (rawData.edges || []).map(edge => ({
        source: edge.source,
        target: edge.target,
        type: edge.type,
        confidence: edge.confidence,
        trafficIntensity: edge.traffic_intensity || 0.3
      }));

      setGraphData({ nodes: nodesTransformed, edges: edgesTransformed });
      console.log('[App] Transformed data set, nodes:', nodesTransformed.length, 'edges:', edgesTransformed.length);
      setLiveStats(prev => ({ ...prev, activeNodes: nodesTransformed.length }));

      // Clear status after 5s
      setTimeout(() => setAiStatus(null), 5000);

    } catch (e) {
      console.error('[App] Error fetching graph data:', e);
      setAiStatus("Neural Core: Analysis Failed");
    } finally {
      setLoading(false);
    }
  }, [fetchGravitySuggestions]);

  const handleNodeClick = React.useCallback((node) => {
    console.log("Node clicked in App:", node);
    setSelectedNode(node);

    // Switch to DrillDownView to utilize real backend endpoints (data-flow, records)
    if (node.id !== 'hub') {
      console.log("Opening Backend-Connected DrillDown for node:", node.name);
      handleNodeDrillDown(node.id);
    } else {
      console.log("Hub clicked, closing overlay");
      setShowDrillDown(false);
    }

    // Real ML Insights derived from node properties - preserve clusters
    setMlInsights(prev => ({
      ...prev,
      // CRITICAL FIX: Removed random failover. If no vitality, assume healthy (0 anomaly).
      anomalyScore: node.vitality ? (100 - node.vitality) : 0,
      gravity: (node.importance_score || 0) > 0.8 ? 'High' : 'Normal'
    }));
  }, [handleNodeDrillDown]);

  const handleDrillDown = React.useCallback((node) => {
    setShowDrillDown(true);
  }, []);

  const handleColumnClick = React.useCallback((columnName) => {
    setSelectedColumn(columnName);
    setShowRecordGravity(true);
  }, []);

  const handleToggleRL = async () => {
    setRlActive(!rlActive);
    // Call backend to toggle optimization with clustering method
    try {
      await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active: !rlActive,
          connection_id: connectionId,
          method: clusteringMethod // Pass the current clustering method
        })
      });
      // Always refresh graph to update clusters display
      if (connectionId) {
        await fetchRealGraphData(connectionId);
      }
    } catch (e) { console.error("RL Toggle Failed", e); }
  };

  const toggleClusteringMethod = async () => {
    const newMethod = clusteringMethod === 'heuristic' ? 'networkx' : 'heuristic';
    setClusteringMethod(newMethod);
    console.log(`Switched clustering method to: ${newMethod}`);

    // If RL is active, apply the new method immediately
    if (rlActive) {
      try {
        await fetch('/api/ai/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            active: true,
            connection_id: connectionId,
            method: newMethod
          })
        });
        // Refresh graph to see results
        if (connectionId) await fetchRealGraphData(connectionId);
        console.log("Updated clustering method in backend");
      } catch (e) {
        console.error("Failed to update clustering method:", e);
      }
    }
  };

  const handleRecalculateGravity = () => {
    if (connectionId) {
      setAiStatus("Recalculating Intelligence Weights...");
      fetchGravitySuggestions(connectionId);
      // Clear status after 3s
      setTimeout(() => setAiStatus(null), 3000);
    }
  };

  // Navigation handlers moved to top

  // Calculate Flows for Sidebar
  const flows = React.useMemo(() => {
    if (!graphData.edges) return [];

    let relevantEdges = [];
    if (selectedNode && selectedNode.id !== 'hub') {
      // Filter for edges connected to selected node
      relevantEdges = graphData.edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id);
    } else {
      // Global high-traffic edges
      relevantEdges = [...graphData.edges].sort((a, b) => (b.trafficIntensity || 0) - (a.trafficIntensity || 0)).slice(0, 5);
    }

    return relevantEdges.map(e => ({
      description: `${e.source} ➔ ${e.target} (${(e.confidence * 100).toFixed(0)}% Match)`,
      intensity: e.trafficIntensity
    }));
  }, [graphData.edges, selectedNode]);

  // Prepare sidebar props
  const sidebarProps = {
    actions: {
      loadSystem: () => { if (connectionId) fetchRealGraphData(connectionId); else setShowConnectModal(true); },
      toggleRL: handleToggleRL,
      rlActive: rlActive,
      clusteringMethod: clusteringMethod,
      toggleClusteringMethod: toggleClusteringMethod,
      recalculateGravity: handleRecalculateGravity
    },
    clusters: [ // Simulated clusters for now, will map to backend later
      { name: 'Accounts Cluster', nodeCount: 15, active: true },
      { name: 'Transaction Cluster', nodeCount: 42, active: false }
    ],
    onClusterClick: (cluster) => console.log("Clicked cluster", cluster),
    selectedNode: selectedNode,
    mlInsights: mlInsights,
    liveStats: liveStats,
    flows: flows // Connected!
  };
  const handleAgentAction = React.useCallback((executionResult) => {
    if (!executionResult.success || !executionResult.result) return;

    const { instruction, target, action_type } = executionResult.result;

    console.log(`[App] Handling Agent Action: ${instruction} on ${target}`);

    if (action_type === 'graph_highlight' && instruction === 'highlight_node') {
      graphRef.current?.highlightNode(target);
    } else if (action_type === 'graph_zoom' && instruction === 'zoom_to_cluster') {
      graphRef.current?.zoomToCluster(target);
    } else if (action_type === 'graph_flow') {
      if (instruction === 'start_flow') graphRef.current?.startFlow();
      if (instruction === 'stop_flow') graphRef.current?.stopFlow();
    } else if (action_type === 'graph_camera' && instruction === 'reset_view') {
      graphRef.current?.resetView();
    } else if (action_type === 'ui_navigation' && instruction === 'show_schema') {
      setViewMode('schema');
    } else if (action_type === 'analytics' && instruction === 'run_anomaly_detection') {
      setViewMode('analytics');
    } else if (action_type === 'analytics' && instruction === 'apply_clustering') {
      handleToggleRL(); // Use existing logic
    } else if (action_type === 'graph_evolution') {
      if (instruction === 'start_evolution') {
        setEvolutionMode(true);
      } else if (instruction === 'stop_evolution') {
        setEvolutionMode(false);
      }
    }
  }, [handleToggleRL]);

  return (
    <DashboardLayout sidebarProps={sidebarProps}>
      {/* Navigation Bar */}
      <NavigationBar
        currentView={viewMode}
        onNavigate={handleNavigate}
        breadcrumbs={breadcrumbs}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* 1. Underlying 3D Graph (Background Layer) */}
      <ThreeGraph
        ref={graphRef}
        className="absolute inset-0 z-0"
        data={graphData}
        onNodeClick={handleNodeClick}
      />

      {/* 2. Agent Interface Components */}
      <AgentStatusPanel />
      <VoiceControl onActionTriggered={handleAgentAction} />

      {/* 2. UI Overlay Layer (Interactive) */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
        <div className="w-full h-full">
          {/* Conditional View Rendering */}
          {viewMode === 'overview' && (
            <>
              {/* Deep Dive Overlays */}
              <CirclePackOverlay
                node={selectedNode}
                visible={showDrillDown}
                onClose={() => setShowDrillDown(false)}
                onColumnClick={handleColumnClick}
              />

              {showRecordGravity && (
                <Record3DGraph
                  table={selectedNode?.name}
                  column={selectedColumn}
                  onClose={() => setShowRecordGravity(false)}
                />
              )}
            </>
          )}

          {viewMode === 'drilldown' && drillDownTable && (
            <DrillDownView
              connectionId={connectionId}
              tableName={drillDownTable}
              onBack={handleBackToOverview}
            />
          )}

          {viewMode === 'dataflow' && (
            <DataFlowView connectionId={connectionId} />
          )}

          {viewMode === 'analytics' && (
            <AnalyticsView
              connectionId={connectionId}
              mlInsights={mlInsights}
              gravitySuggestions={gravitySuggestions}
            />
          )}

          {viewMode === 'schema' && (
            <SchemaView connectionId={connectionId} />
          )}
        </div>
      </div>

      {/* 4. Window Manager Layer (Settings, Terminal) */}
      <div className="relative z-[3000]">
        <AnimatePresence>
          {windows.map((w) => (
            <Window key={w.id} {...w} />
          ))}
        </AnimatePresence>
        {windows.length > 0 && <Taskbar />}
      </div>

      {/* AI Status Notification */}
      <AnimatePresence>
        {aiStatus && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[4001] px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--primary-cyan)]/30 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.2)] flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--primary-cyan)] animate-ping" />
            <span className="text-xs font-bold tracking-wider text-white uppercase font-mono">{aiStatus}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evolution Playback Interface */}
      <AnimatePresence>
        {evolutionMode && (
          <>
            <TimelinePlayer
              connectionId={connectionId}
              onSnapshotUpdate={(snapshot) => {
                setCurrentSnapshot(snapshot);
                graphRef.current?.setEvolutionSnapshot(snapshot);
              }}
              onClose={() => setEvolutionMode(false)}
            />
            <EvolutionOverlay snapshot={currentSnapshot} />
            <EvolutionMathOverlay snapshot={currentSnapshot} />

            {/* Close Button for Evolution Mode */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEvolutionMode(false)}
              className="fixed top-24 left-6 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold uppercase tracking-widest z-50 backdrop-blur-md"
            >
              Exit Evolution Mode
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* 5. AI Chat Interface */}
      <ChatInterface
        connectionId={connectionId}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* 6. Modals */}
      {showConnectModal && (
        <ConnectionModal
          onClose={() => setShowConnectModal(false)}
        />
      )}
    </DashboardLayout>
  );
};

const ConnectionManagerWrapper = ({ onClose }) => {
  return <ConnectionModal onClose={onClose} />;
};

export default App;
