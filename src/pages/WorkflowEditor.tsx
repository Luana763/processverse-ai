import { useCallback, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Save, Play, Brain, GitMerge, UserCheck, Cog, Zap,
  FileSearch, Trash2, Settings, X, ChevronRight
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const nodeColors: Record<string, string> = {
  start: "hsl(262, 80%, 55%)",
  decision: "hsl(38, 92%, 55%)",
  integration: "hsl(220, 70%, 55%)",
  processing: "hsl(152, 60%, 45%)",
  approval: "hsl(330, 75%, 60%)",
  ai: "hsl(262, 80%, 55%)",
  end: "hsl(0, 72%, 55%)",
};

const nodeTypeLabels: Record<string, string> = {
  start: "Início",
  decision: "Decisão",
  integration: "Integração",
  processing: "Processamento",
  approval: "Aprovação",
  ai: "IA",
  end: "Fim",
};

function CustomNode({ data, selected }: { data: { label: string; type: string; icon?: LucideIcon; description?: string }; selected?: boolean }) {
  const Icon = data.icon || Cog;
  const color = nodeColors[data.type] || nodeColors.processing;

  return (
    <div
      className={`bg-card rounded-xl border-2 shadow-card px-4 py-3 min-w-[180px] transition-all ${selected ? "ring-2 ring-ring ring-offset-2" : ""}`}
      style={{ borderColor: color }}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !border-2" style={{ background: color }} />
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <div>
          <span className="text-sm font-medium block">{data.label}</span>
          <span className="text-[10px] text-muted-foreground">{nodeTypeLabels[data.type] || data.type}</span>
        </div>
      </div>
      {data.description && (
        <p className="text-[10px] text-muted-foreground mt-1.5 line-clamp-2">{data.description}</p>
      )}
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !border-2" style={{ background: color }} />
    </div>
  );
}

const nodeTypes = { custom: CustomNode };

// Mock data per workflow
const workflowData: Record<string, { name: string; description: string; status: "active" | "inactive"; nodes: Node[]; edges: Edge[] }> = {
  "wf-001": {
    name: "Aprovação de Reembolso",
    description: "Workflow de aprovação com múltiplos níveis para reembolsos corporativos",
    status: "active",
    nodes: [
      { id: "1", type: "custom", position: { x: 250, y: 0 }, data: { label: "Solicitação", type: "start", icon: Zap, description: "Recebe solicitação de reembolso" } },
      { id: "2", type: "custom", position: { x: 250, y: 140 }, data: { label: "Validar Política", type: "processing", icon: Cog, description: "Verifica limites e regras" } },
      { id: "3", type: "custom", position: { x: 100, y: 280 }, data: { label: "Valor > R$ 500?", type: "decision", icon: GitMerge } },
      { id: "4", type: "custom", position: { x: 400, y: 280 }, data: { label: "Aprovação Gerente", type: "approval", icon: UserCheck } },
      { id: "5", type: "custom", position: { x: 250, y: 420 }, data: { label: "Processar Pagamento", type: "integration", icon: Zap, description: "Envia para SAP" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-5", source: "3", target: "5" },
      { id: "e4-5", source: "4", target: "5", animated: true },
    ],
  },
  "wf-005": {
    name: "Classificação de Documentos",
    description: "Classificação com IA de documentos recebidos",
    status: "active",
    nodes: [
      { id: "1", type: "custom", position: { x: 250, y: 0 }, data: { label: "Upload Documento", type: "start", icon: FileSearch } },
      { id: "2", type: "custom", position: { x: 250, y: 140 }, data: { label: "Análise IA", type: "ai", icon: Brain, description: "Classifica tipo de documento" } },
      { id: "3", type: "custom", position: { x: 250, y: 280 }, data: { label: "Armazenar Resultado", type: "processing", icon: Cog } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
    ],
  },
};

const defaultData = {
  name: "Novo Workflow",
  description: "",
  status: "inactive" as const,
  nodes: [
    { id: "1", type: "custom", position: { x: 250, y: 0 }, data: { label: "Início", type: "start", icon: Zap } },
    { id: "2", type: "custom", position: { x: 250, y: 140 }, data: { label: "Processamento", type: "processing", icon: Cog } },
  ] as Node[],
  edges: [
    { id: "e1-2", source: "1", target: "2", animated: true },
  ] as Edge[],
};

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
  const { id } = useParams();

  const wfData = id && id !== "new" ? workflowData[id] || defaultData : defaultData;

  const [workflowName, setWorkflowName] = useState(wfData.name);
  const [workflowDesc, setWorkflowDesc] = useState(wfData.description);
  const [workflowStatus, setWorkflowStatus] = useState(wfData.status);
  const [nodes, setNodes, onNodesChange] = useNodesState(wfData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(wfData.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNode = (template: typeof nodeTemplates[0]) => {
    const nodeId = `node-${Date.now()}`;
    const newNode: Node = {
      id: nodeId,
      type: "custom",
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 200 },
      data: { label: template.label, type: template.type, icon: template.icon },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`Nó "${template.label}" adicionado`);
  };

  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
    toast.success("Nó removido");
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleSave = () => {
    toast.success(`Workflow "${workflowName}" salvo com sucesso!`);
  };

  const handleExecute = () => {
    if (workflowStatus === "inactive") {
      toast.error("Ative o workflow antes de executar");
      return;
    }
    toast.success(`Execução iniciada: ${workflowName}`);
  };

  const isNew = id === "new";

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/workflows")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="h-8 text-sm font-semibold border-transparent hover:border-input focus:border-input bg-transparent w-[220px]"
            />
            <Badge variant={workflowStatus === "active" ? "default" : "secondary"} className="text-[10px]">
              {workflowStatus === "active" ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedNode && (
            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelectedNode}
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Excluir Nó
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1" />
            Salvar
          </Button>
          <Button
            size="sm"
            className="gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow"
            onClick={handleExecute}
          >
            <Play className="h-3.5 w-3.5 mr-1" />
            Executar
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Node palette */}
        <div className="w-52 border-r bg-card/50 p-3 space-y-1.5 overflow-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Adicionar Nós</p>
          {nodeTemplates.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.label}
                onClick={() => addNode(t)}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left group"
              >
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `${nodeColors[t.type]}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color: nodeColors[t.type] }} />
                </div>
                <div>
                  <span className="font-medium block text-xs">{t.label}</span>
                  <span className="text-[10px] text-muted-foreground">{nodeTypeLabels[t.type]}</span>
                </div>
              </button>
            );
          })}

          {/* Selected node info */}
          {selectedNode && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Nó Selecionado</p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium">{(selectedNode.data as any).label}</p>
                <Badge variant="outline" className="text-[10px]">
                  {nodeTypeLabels[(selectedNode.data as any).type] || (selectedNode.data as any).type}
                </Badge>
                <p className="text-[10px] text-muted-foreground">ID: {selectedNode.id}</p>
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-muted/30"
            deleteKeyCode="Delete"
          >
            <Background gap={20} size={1} />
            <Controls className="!rounded-lg !border !shadow-card" />
            <MiniMap className="!rounded-lg !border !shadow-card" />
          </ReactFlow>
        </div>
      </div>

      {/* Settings Sheet */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Configurações do Workflow</SheetTitle>
            <SheetDescription>Edite as propriedades gerais do workflow</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={workflowDesc}
                onChange={(e) => setWorkflowDesc(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {workflowStatus === "active" ? "Ativo" : "Inativo"}
                </span>
                <Switch
                  checked={workflowStatus === "active"}
                  onCheckedChange={(c) => setWorkflowStatus(c ? "active" : "inactive")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nós no fluxo</Label>
              <p className="text-sm text-muted-foreground">{nodes.length} nós, {edges.length} conexões</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
