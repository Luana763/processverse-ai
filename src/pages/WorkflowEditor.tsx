import { useCallback, useState, useRef, type DragEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Connection,
  type Node,
  type Edge,
  Handle,
  Position,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Save, Play, Brain, GitMerge, UserCheck, Cog, Zap,
  FileSearch, Trash2, Settings, GripVertical, Plus, MousePointerClick,
  X, Workflow, Send, Database, Mail, Clock, ShieldCheck, AlertTriangle,
  Code, Globe
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip, TooltipContent, TooltipTrigger
} from "@/components/ui/tooltip";

// ─── Node config ──────────────────────────────────────────────────
const nodeColors: Record<string, string> = {
  trigger: "hsl(262, 80%, 55%)",
  decision: "hsl(38, 92%, 55%)",
  integration: "hsl(220, 70%, 55%)",
  processing: "hsl(152, 60%, 45%)",
  approval: "hsl(330, 75%, 60%)",
  ai: "hsl(275, 70%, 58%)",
  action: "hsl(200, 70%, 50%)",
  communication: "hsl(10, 75%, 55%)",
  data: "hsl(180, 55%, 45%)",
  timing: "hsl(45, 80%, 50%)",
  security: "hsl(140, 60%, 40%)",
  code: "hsl(260, 30%, 45%)",
};

interface NodeTemplate {
  label: string;
  type: string;
  icon: LucideIcon;
  description: string;
  category: string;
}

const nodeTemplates: NodeTemplate[] = [
  // Triggers
  { label: "Webhook", type: "trigger", icon: Globe, description: "Recebe requisições HTTP", category: "Triggers" },
  { label: "Agendamento", type: "timing", icon: Clock, description: "Executa em horários definidos", category: "Triggers" },
  { label: "Evento", type: "trigger", icon: Zap, description: "Dispara por evento do sistema", category: "Triggers" },
  // Ações
  { label: "HTTP Request", type: "action", icon: Send, description: "Faz chamada HTTP externa", category: "Ações" },
  { label: "Enviar Email", type: "communication", icon: Mail, description: "Envia email via SMTP", category: "Ações" },
  { label: "Banco de Dados", type: "data", icon: Database, description: "Consulta ou grava dados", category: "Ações" },
  { label: "Código", type: "code", icon: Code, description: "Executa código customizado", category: "Ações" },
  // Fluxo
  { label: "Decisão (IF)", type: "decision", icon: GitMerge, description: "Condicional verdadeiro/falso", category: "Fluxo" },
  { label: "Switch", type: "decision", icon: Workflow, description: "Múltiplas condições", category: "Fluxo" },
  // IA & Processamento
  { label: "Análise IA", type: "ai", icon: Brain, description: "Processa com inteligência artificial", category: "IA" },
  { label: "Extração Dados", type: "ai", icon: FileSearch, description: "Extrai dados de documentos", category: "IA" },
  { label: "Classificação", type: "ai", icon: ShieldCheck, description: "Classifica e categoriza", category: "IA" },
  // Humano
  { label: "Aprovação", type: "approval", icon: UserCheck, description: "Aguarda aprovação humana", category: "Humano" },
  // Integração
  { label: "SAP", type: "integration", icon: Cog, description: "Integração com SAP ERP", category: "Integrações" },
  { label: "Salesforce", type: "integration", icon: Globe, description: "Integração com Salesforce", category: "Integrações" },
  { label: "Slack", type: "communication", icon: Send, description: "Envia mensagem no Slack", category: "Integrações" },
];

const categories = [...new Set(nodeTemplates.map(t => t.category))];

// ─── Custom Node Component ───────────────────────────────────────
function CustomNode({ data, selected }: { data: Record<string, any>; selected?: boolean }) {
  const Icon = (data.icon as LucideIcon) || Cog;
  const color = nodeColors[data.type as string] || nodeColors.processing;

  return (
    <div
      className={`bg-card rounded-xl shadow-card min-w-[200px] transition-all cursor-grab active:cursor-grabbing overflow-hidden ${
        selected ? "ring-2 ring-ring ring-offset-2 shadow-card-hover" : "hover:shadow-card-hover"
      }`}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-card !-top-1.5"
        style={{ background: color }}
      />

      {/* Header */}
      <div className="px-3 py-2.5 flex items-center gap-2.5">
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-sm font-semibold block truncate">{data.label as string}</span>
          {data.description && (
            <span className="text-[10px] text-muted-foreground block truncate">{data.description as string}</span>
          )}
        </div>
      </div>

      {/* Footer with type badge */}
      <div className="px-3 py-1.5 bg-muted/30 border-t flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground">
          {data.type as string}
        </span>
        {selected && (
          <span className="text-[9px] text-primary font-medium">Selecionado</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !border-card !-bottom-1.5"
        style={{ background: color }}
      />
    </div>
  );
}

const nodeTypesMap = { custom: CustomNode };

// ─── Default edge style ──────────────────────────────────────────
const defaultEdgeOptions = {
  style: { stroke: "hsl(262, 60%, 65%)", strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(262, 60%, 65%)" },
  animated: true,
};

// ─── Mock workflow data ──────────────────────────────────────────
const workflowData: Record<string, { name: string; description: string; status: "active" | "inactive"; nodes: Node[]; edges: Edge[] }> = {
  "wf-001": {
    name: "Aprovação de Reembolso", description: "Workflow de aprovação com múltiplos níveis", status: "active",
    nodes: [
      { id: "1", type: "custom", position: { x: 250, y: 0 }, data: { label: "Solicitação", type: "trigger", icon: Zap, description: "Recebe solicitação" } },
      { id: "2", type: "custom", position: { x: 250, y: 160 }, data: { label: "Validar Política", type: "processing", icon: Cog, description: "Verifica limites" } },
      { id: "3", type: "custom", position: { x: 80, y: 320 }, data: { label: "Valor > R$500?", type: "decision", icon: GitMerge, description: "Condicional" } },
      { id: "4", type: "custom", position: { x: 420, y: 320 }, data: { label: "Aprovação Gerente", type: "approval", icon: UserCheck, description: "Aguarda aprovação" } },
      { id: "5", type: "custom", position: { x: 250, y: 480 }, data: { label: "Processar Pagamento", type: "integration", icon: Cog, description: "Envia para SAP" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-5", source: "3", target: "5" },
      { id: "e4-5", source: "4", target: "5" },
    ],
  },
  "wf-005": {
    name: "Classificação de Documentos", description: "Classificação com IA", status: "active",
    nodes: [
      { id: "1", type: "custom", position: { x: 250, y: 0 }, data: { label: "Upload", type: "trigger", icon: FileSearch, description: "Recebe documento" } },
      { id: "2", type: "custom", position: { x: 250, y: 160 }, data: { label: "Análise IA", type: "ai", icon: Brain, description: "Classifica documento" } },
      { id: "3", type: "custom", position: { x: 250, y: 320 }, data: { label: "Armazenar", type: "data", icon: Database, description: "Salva resultado" } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
    ],
  },
};

const defaultData = {
  name: "Novo Workflow", description: "", status: "inactive" as const,
  nodes: [
    { id: "1", type: "custom", position: { x: 300, y: 50 }, data: { label: "Trigger", type: "trigger", icon: Zap, description: "Início do fluxo" } },
  ] as Node[],
  edges: [] as Edge[],
};

// ─── Inner editor (needs ReactFlowProvider) ──────────────────────
function WorkflowEditorInner() {
  const navigate = useNavigate();
  const { id } = useParams();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const wfData = id && id !== "new" ? workflowData[id] || defaultData : defaultData;

  const [workflowName, setWorkflowName] = useState(wfData.name);
  const [workflowDesc, setWorkflowDesc] = useState(wfData.description);
  const [workflowStatus, setWorkflowStatus] = useState(wfData.status);
  const [nodes, setNodes, onNodesChange] = useNodesState(wfData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(wfData.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPalette, setShowPalette] = useState(true);
  const [paletteSearch, setPaletteSearch] = useState("");

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // ─── Drag & Drop ────────────────────────────────
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      const template: NodeTemplate = JSON.parse(raw);
      // Reconstruct icon from name
      const iconMap: Record<string, LucideIcon> = {
        Globe, Clock, Zap, Send, Mail, Database, Code, GitMerge, Workflow,
        Brain, FileSearch, ShieldCheck, UserCheck, Cog,
      };
      const Icon = iconMap[template.icon as unknown as string] || Cog;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: "custom",
        position,
        data: {
          label: template.label,
          type: template.type,
          icon: Icon,
          description: template.description,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      toast.success(`"${template.label}" adicionado ao canvas`);
    },
    [screenToFlowPosition, setNodes]
  );

  const onDragStart = (event: DragEvent, template: NodeTemplate) => {
    const data = { ...template, icon: template.icon.displayName || template.icon.name || "Cog" };
    event.dataTransfer.setData("application/reactflow", JSON.stringify(data));
    event.dataTransfer.effectAllowed = "move";
  };

  // ─── Node actions ───────────────────────────────
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
    toast.success(`Workflow "${workflowName}" salvo!`);
  };

  const handleExecute = () => {
    if (workflowStatus === "inactive") {
      toast.error("Ative o workflow antes de executar");
      return;
    }
    toast.success(`Execução iniciada: ${workflowName}`);
  };

  const filteredTemplates = nodeTemplates.filter(
    (t) =>
      t.label.toLowerCase().includes(paletteSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(paletteSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(paletteSearch.toLowerCase())
  );

  const groupedTemplates = categories
    .map((cat) => ({
      category: cat,
      items: filteredTemplates.filter((t) => t.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b bg-card/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/workflows")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-5 w-px bg-border" />
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="h-8 text-sm font-semibold border-transparent hover:border-input focus:border-input bg-transparent w-[200px]"
          />
          <Badge
            variant={workflowStatus === "active" ? "default" : "secondary"}
            className={`text-[10px] cursor-pointer ${workflowStatus === "active" ? "gradient-primary text-primary-foreground" : ""}`}
            onClick={() => {
              setWorkflowStatus(workflowStatus === "active" ? "inactive" : "active");
              toast.success(workflowStatus === "active" ? "Workflow desativado" : "Workflow ativado");
            }}
          >
            {workflowStatus === "active" ? "● Ativo" : "○ Inativo"}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-2">
            {nodes.length} nós · {edges.length} conexões
          </span>
          {selectedNode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline" size="sm"
                  onClick={deleteSelectedNode}
                  className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir nó selecionado</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => setShowSettings(true)}>
                <Settings className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Configurações</TooltipContent>
          </Tooltip>
          <Button variant="outline" size="sm" className="h-8" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1" />
            Salvar
          </Button>
          <Button
            size="sm" className="h-8 gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-accent transition-shadow"
            onClick={handleExecute}
          >
            <Play className="h-3.5 w-3.5 mr-1" />
            Executar
          </Button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Collapsible Node Palette */}
        <AnimatePresence>
          {showPalette && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r bg-card/70 backdrop-blur-sm flex flex-col overflow-hidden z-10"
            >
              <div className="p-3 border-b flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Componentes</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowPalette(false)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="p-2">
                <Input
                  placeholder="Buscar nós..."
                  value={paletteSearch}
                  onChange={(e) => setPaletteSearch(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex-1 overflow-auto p-2 space-y-3">
                {groupedTemplates.map((group) => (
                  <div key={group.category}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">
                      {group.category}
                    </p>
                    <div className="space-y-1">
                      {group.items.map((template) => {
                        const Icon = template.icon;
                        const color = nodeColors[template.type] || nodeColors.processing;
                        return (
                          <div
                            key={template.label}
                            draggable
                            onDragStart={(e) => onDragStart(e, template)}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-grab active:cursor-grabbing hover:bg-muted/80 transition-all group border border-transparent hover:border-border active:shadow-md select-none"
                          >
                            <div className="flex items-center gap-1">
                              <GripVertical className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div
                                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                style={{ background: `${color}15` }}
                              >
                                <Icon className="h-4 w-4" style={{ color }} />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-semibold block truncate">{template.label}</span>
                              <span className="text-[10px] text-muted-foreground block truncate">{template.description}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t">
                <p className="text-[10px] text-muted-foreground text-center">
                  <GripVertical className="h-3 w-3 inline mr-1" />
                  Arraste para o canvas
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle palette button */}
        {!showPalette && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute left-3 top-3 z-20"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-9 shadow-card bg-card/90 backdrop-blur-sm"
              onClick={() => setShowPalette(true)}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Nós
            </Button>
          </motion.div>
        )}

        {/* Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypesMap}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            className="bg-muted/20"
            deleteKeyCode="Delete"
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} className="!text-border" />
            <Controls className="!rounded-xl !border !shadow-card !bg-card/90 !backdrop-blur-sm" />
            <MiniMap
              className="!rounded-xl !border !shadow-card"
              maskColor="hsl(230, 25%, 97%, 0.7)"
              nodeColor={(node) => nodeColors[(node.data as any)?.type] || "#888"}
            />
          </ReactFlow>
        </div>

        {/* Selected node panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l bg-card/70 backdrop-blur-sm flex flex-col overflow-hidden"
            >
              <div className="p-3 border-b flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Propriedades</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedNode(null)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="p-3 space-y-4 flex-1 overflow-auto">
                <div className="flex items-center gap-2.5">
                  {(() => {
                    const Icon = (selectedNode.data as any).icon || Cog;
                    const color = nodeColors[(selectedNode.data as any).type] || "#888";
                    return (
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                        <Icon className="h-5 w-5" style={{ color }} />
                      </div>
                    );
                  })()}
                  <div>
                    <p className="text-sm font-semibold">{(selectedNode.data as any).label}</p>
                    <Badge variant="outline" className="text-[9px] mt-0.5">
                      {(selectedNode.data as any).type}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Nome do Nó</Label>
                  <Input
                    value={(selectedNode.data as any).label}
                    onChange={(e) => {
                      setNodes((nds) =>
                        nds.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, data: { ...n.data, label: e.target.value } }
                            : n
                        )
                      );
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: e.target.value } });
                    }}
                    className="h-8 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Descrição</Label>
                  <Textarea
                    value={(selectedNode.data as any).description || ""}
                    onChange={(e) => {
                      setNodes((nds) =>
                        nds.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, data: { ...n.data, description: e.target.value } }
                            : n
                        )
                      );
                      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, description: e.target.value } });
                    }}
                    rows={2}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Posição</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground">X</span>
                      <Input value={Math.round(selectedNode.position.x)} readOnly className="h-7 text-xs" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground">Y</span>
                      <Input value={Math.round(selectedNode.position.y)} readOnly className="h-7 text-xs" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Conexões</Label>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Entradas: {edges.filter(e => e.target === selectedNode.id).length}</p>
                    <p>Saídas: {edges.filter(e => e.source === selectedNode.id).length}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={deleteSelectedNode}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Excluir Nó
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings Sheet */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Configurações do Workflow</SheetTitle>
            <SheetDescription>Edite as propriedades gerais</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={workflowDesc} onChange={(e) => setWorkflowDesc(e.target.value)} rows={3} />
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
              <Label>Estatísticas</Label>
              <p className="text-sm text-muted-foreground">{nodes.length} nós, {edges.length} conexões</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── Wrapper with provider ───────────────────────────────────────
export default function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner />
    </ReactFlowProvider>
  );
}
