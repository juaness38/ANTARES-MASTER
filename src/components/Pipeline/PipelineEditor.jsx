import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Position,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import { nanoid } from "nanoid";
import { X, ChevronDown, GripVertical } from "lucide-react";
import clsx from "clsx";

const categories = [
  {
    name: "Bioinformática",
    color: "#34d399", // emerald-400 suave
    bgColor: "rgba(52, 211, 153, 0.15)",
    nodes: [
      { label: "Análisis BLAST", type: "bio_blast" },
      { label: "Predicción de estructura", type: "bio_structure" },
      { label: "Anotación proteica", type: "bio_annotation" },
    ],
  },
  {
    name: "Preparación",
    color: "#60a5fa", // blue-400 suave
    bgColor: "rgba(96, 165, 250, 0.15)",
    nodes: [
      { label: "Preparación y muestra", type: "prep_sample" },
      { label: "Mezcla de buffer", type: "prep_buffer" },
      { label: "Dilución", type: "prep_dilution" },
    ],
  },
  {
    name: "Microambiente",
    color: "#2dd4bf", // teal-400 suave
    bgColor: "rgba(45, 212, 191, 0.15)",
    nodes: [
      { label: "Control de temperatura", type: "env_temp" },
      { label: "Control de pH", type: "env_ph" },
      { label: "Control de gases", type: "env_gas" },
    ],
  },
  {
    name: "Análisis",
    color: "#f87171", // red-400 suave
    bgColor: "rgba(248, 113, 113, 0.15)",
    nodes: [
      { label: "Espectroscopía", type: "ana_spectro" },
      { label: "Cromatografía", type: "ana_chroma" },
      { label: "PCR", type: "ana_pcr" },
    ],
  },
  {
    name: "Decisión",
    color: "#eab308", // yellow-400 suave
    bgColor: "rgba(234, 179, 8, 0.15)",
    nodes: [
      { label: "Condición", type: "dec_condition" },
      { label: "Bucle", type: "dec_loop" },
      { label: "Paralelo", type: "dec_parallel" },
    ],
  },
  {
    name: "IA Orquestación",
    color: "#a78bfa", // purple-400 suave
    bgColor: "rgba(167, 139, 250, 0.15)",
    nodes: [
      { label: "Decisión IA", type: "ia_decision" },
      { label: "Optimización", type: "ia_optimize" },
      { label: "Predicción", type: "ia_predict" },
    ],
  },
];

const CustomNode = ({ data, id }) => {
  return (
    <div
      style={{
        backgroundColor: data.bgColor,
        border: `2px solid ${data.color}`,
        color: "#222",
      }}
      className="rounded-md px-3 py-1.5 shadow-sm relative select-none font-semibold text-sm group"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-gray-400"
      />
      <div className="flex items-center">
        <div className="flex-1">{data.label}</div>
        {/* Botón eliminar sólo visible al hacer hover */}
        <button
          onClick={() => data.onDelete(id)}
          aria-label="Eliminar nodo"
          title="Eliminar nodo"
          className="ml-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-500"
        >
          <X size={14} />
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-gray-400"
      />
    </div>
  );
};

const nodeTypesMap = {
  default: CustomNode,
};

export default function PipelineEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [openCategory, setOpenCategory] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDragStart = (event, nodeData, cat) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ ...nodeData, color: cat.color, bgColor: cat.bgColor })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = JSON.parse(
        event.dataTransfer.getData("application/reactflow")
      );

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: nanoid(),
        type: "default",
        position,
        data: {
          label: data.label,
          color: data.color,
          bgColor: data.bgColor,
          onDelete: handleDeleteNode,
        },
        style: {
          backgroundColor: data.bgColor,
          border: `2px solid ${data.color}`,
          color: "#222",
          fontWeight: "600",
          borderRadius: 10,
          padding: 10,
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.08), inset 0 0 4px rgba(255,255,255,0.15)",
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDeleteNode = (id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <aside className="w-74 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto max-h-screen border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-gray-100 tracking-tight select-none">
          Componentes
        </h2>

        <div className="space-y-5">
          {categories.map((cat, idx) => {
            const isOpen = openCategory === idx;
            return (
              <div
                key={cat.name}
                className={clsx(
                  "rounded-md border border-gray-300 dark:border-gray-700",
                  "bg-white dark:bg-gray-900",
                  "shadow-sm"
                )}
              >
                <button
                  onClick={() => setOpenCategory(isOpen ? null : idx)}
                  className={clsx(
                    "flex justify-between items-center w-full px-5 py-3 text-base font-medium rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white focus:ring-emerald-400 dark:focus:ring-offset-gray-900 dark:focus:ring-emerald-600",
                    isOpen
                      ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 shadow-inner"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  )}
                >
                  <span className="flex items-center gap-3 select-none">
                    <span
                      className="w-3 h-6 rounded-sm"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </span>
                  <ChevronDown
                    size={18}
                    className={clsx(
                      "transition-transform duration-300 text-gray-600 dark:text-gray-400",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 320 : 0,
                    transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  className="overflow-hidden"
                >
                  <ul className="px-6 py-3 flex flex-col gap-2">
                    {cat.nodes.map((node) => (
                      <li
                        key={node.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node, cat)}
                        className={clsx(
                          "relative flex items-center gap-2 cursor-grab select-none rounded-md px-4 py-1.5",
                          "text-gray-900 dark:text-gray-100 font-medium text-sm",
                          "hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        )}
                      >
                        <GripVertical
                          className="text-gray-400 dark:text-gray-500"
                          size={16}
                        />
                        {node.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypesMap}
          fitView
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{ width: "100%", height: "100%" }}
        >
          <MiniMap
            nodeStrokeColor={(n) => n.data.color || "#999"}
            nodeColor={(n) => n.data.bgColor || "rgba(136,136,136,0.15)"}
            nodeBorderRadius={10}
          />
          <Controls />
          <Background gap={16} />
        </ReactFlow>
      </main>
    </div>
  );
}
