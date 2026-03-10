import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
  Handle,
  Position,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Play, Plus, Brain, GitMerge, UserCheck, Cog, Zap, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";

const nodeColors: Record<string, string> = {
  start: "hsl(262, 80%, 55%)",
  decision: "hsl(38, 92%, 55%)",
  integration: "hsl(220, 70%, 55%)",
  processing: "hsl(152, 60%, 45%)",
  approval: "hsl(330, 75%, 60%)",
  ai: "hsl(262, 80%, 55%)",
  end: "hsl(0, 72%, 55%)",
};

function CustomNode({ data }: { data: { label: string; type: string; icon?: LucideIcon } }) {
  const Icon = data.icon || Cog;
  const color = nodeColors[data.type] || nodeColors.processing;

  return (
    <div className="bg-card rounded-xl border-2 shadow-card px-4 py-3 min-w-[160px]" style={{ borderColor: color }}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !border-2" style={{ background: color }} />
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
        <span className="text-sm font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !border-2" style={{ background: color }} />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

const initialNodes: Node[] = [
  { id: "1", type: "custom", position: { x: 250, y: 0 }, data: { label: "Início", type: "start", icon: Zap } },
  { id: "2", type: "custom", position: { x: 250, y: 120 }, data: { label: "Receber Documento", type: "integration", icon: FileSearch } },
  { id: "3", type: "custom", position: { x: 250, y: 240 }, data: { label: "Análise IA", type: "ai", icon: Brain } },
  { id: "4", type: "custom", position: { x: 100, y: 360 }, data: { label: "Aprovação?", type: "decision", icon: GitMerge } },
  { id: "5", type: "custom", position: { x: 400, y: 360 }, data: { label: "Aprovação Manual", type: "approval", icon: UserCheck } },
  { id: "6", type: "custom", position: { x: 250, y: 480 }, data: { label: "Processamento", type: "processing", icon: Cog } },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e3-5", source: "3", target: "5" },
  { id: "e4-6", source: "4", target: "6" },
  { id: "e5-6", source: "5", target: "6" },
];

const nodeTemplates = [
  { label: "Decisão", type: "decision", icon: GitMerge },
  { label: "Integração", type: "integration", icon: Zap },
  { label: "Processamento", type: "processing", icon: Cog },
  { label: "Aprovação", type: "approval", icon: UserCheck },
  { label: "Análise IA", type: "ai", icon: Brain },
  { label: "Extração", type: "integration", icon: FileSearch },
];

export default function WorkflowEditor() {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (template: typeof nodeTemplates[0]) => {
    const id = `node-${Date.now()}`;
    const newNode: Node = {
      id,
      type: "custom",
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 200 },
      data: { label: template.label, type: template.type, icon: template.icon },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`Nó "${template.label}" adicionado`);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/workflows")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="font-semibold text-sm">Aprovação de Reembolso</h2>
            <p className="text-xs text-muted-foreground">Editor Visual</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Workflow salvo!")}>
            <Save className="h-3.5 w-3.5 mr-1" />
            Salvar
          </Button>
          <Button size="sm" className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow">
            <Play className="h-3.5 w-3.5 mr-1" />
            Executar
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Node palette */}
        <div className="w-48 border-r bg-card/50 p-3 space-y-2 overflow-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Nós</p>
          {nodeTemplates.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.label}
                onClick={() => addNode(t)}
                className="w-full flex items-center gap-2 p-2 rounded-lg text-sm hover:bg-muted transition-colors text-left"
              >
                <div className="h-7 w-7 rounded-md flex items-center justify-center" style={{ background: `${nodeColors[t.type]}20` }}>
                  <Icon className="h-3.5 w-3.5" style={{ color: nodeColors[t.type] }} />
                </div>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-muted/30"
          >
            <Background gap={20} size={1} />
            <Controls className="!rounded-lg !border !shadow-card" />
            <MiniMap className="!rounded-lg !border !shadow-card" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
