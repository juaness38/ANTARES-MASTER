'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface PhylogeneticTreeProps {
  data?: any;
  className?: string;
}

interface TreeNode {
  name: string;
  children?: TreeNode[];
  branchLength?: number;
  confidence?: number;
}

export default function PhylogeneticTree({ 
  data,
  className = ""
}: PhylogeneticTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Datos filogenéticos de ejemplo
  const defaultTreeData: TreeNode = {
    name: "Root",
    children: [
      {
        name: "Clade A",
        confidence: 0.95,
        children: [
          {
            name: "Astroflora candidatus",
            confidence: 0.98,
            branchLength: 0.12
          },
          {
            name: "Mayahuelensis sp.",
            confidence: 0.92,
            branchLength: 0.15
          }
        ]
      },
      {
        name: "Clade B", 
        confidence: 0.88,
        children: [
          {
            name: "Extremophilus antares",
            confidence: 0.94,
            branchLength: 0.18
          },
          {
            name: "Thermospacicus sp.",
            confidence: 0.87,
            branchLength: 0.22
          },
          {
            name: "Cryophilic group",
            confidence: 0.91,
            children: [
              {
                name: "Glacialis extremis",
                confidence: 0.96,
                branchLength: 0.08
              },
              {
                name: "Polaris bacterium",
                confidence: 0.93,
                branchLength: 0.11
              }
            ]
          }
        ]
      }
    ]
  };

  const treeData = data || defaultTreeData;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 150, bottom: 40, left: 40 };

    // Crear jerarquía
    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree<TreeNode>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    treeLayout(root);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Crear gradientes
    const defs = svg.append("defs");
    
    const gradientBranch = defs.append("linearGradient")
      .attr("id", "branchGradient")
      .attr("gradientUnits", "userSpaceOnUse");
    
    gradientBranch.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00D4FF");
    
    gradientBranch.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#A855F7");

    // Dibujar enlaces
    const links = g.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<any, any>()
        .x((d: any) => d.y)
        .y((d: any) => d.x))
      .style("fill", "none")
      .style("stroke", "url(#branchGradient)")
      .style("stroke-width", 3)
      .style("opacity", 0.8);

    // Dibujar nodos
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer")
      .on("click", function(event, d: any) {
        setSelectedNode(d.data.name);
      });

    // Círculos de nodos
    nodes.append("circle")
      .attr("r", (d: any) => d.children ? 8 : 6)
      .style("fill", (d: any) => {
        if (d.children) return "#00D4FF";
        return d.data.confidence && d.data.confidence > 0.9 ? "#10B981" : "#F59E0B";
      })
      .style("stroke", "#FFFFFF")
      .style("stroke-width", 2)
      .style("filter", "drop-shadow(0 0 6px rgba(0,212,255,0.6))");

    // Etiquetas de nodos
    nodes.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => d.children ? -12 : 12)
      .style("text-anchor", (d: any) => d.children ? "end" : "start")
      .style("fill", "#FFFFFF")
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif")
      .style("font-weight", "500")
      .text((d: any) => d.data.name);

    // Valores de confianza
    nodes.filter((d: any) => d.data.confidence)
      .append("text")
      .attr("dy", "-0.8em")
      .attr("x", 0)
      .style("text-anchor", "middle")
      .style("fill", "#10B981")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .text((d: any) => d.data.confidence?.toFixed(2));

    // Escala de longitud de rama
    if (treeData.children?.some(child => child.branchLength)) {
      const scale = g.append("g")
        .attr("transform", `translate(20, ${height - margin.top - margin.bottom - 40})`);
      
      scale.append("line")
        .attr("x1", 0)
        .attr("x2", 50)
        .attr("y1", 0)
        .attr("y2", 0)
        .style("stroke", "#FFFFFF")
        .style("stroke-width", 2);
      
      scale.append("text")
        .attr("x", 25)
        .attr("y", 15)
        .style("text-anchor", "middle")
        .style("fill", "#FFFFFF")
        .style("font-size", "10px")
        .text("0.1 substitutions/site");
    }

  }, [treeData, selectedNode]);

  return (
    <div className={`bg-gradient-to-br from-gray-900/90 via-green-900/20 to-blue-900/30 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 shadow-2xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-green-100">🌳 Árbol Filogenético</h3>
        </div>
        <div className="flex space-x-2">
          <div className="px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-300 border border-green-500/30">
            ML Bootstrap
          </div>
          <div className="px-3 py-1 bg-blue-500/20 rounded-full text-xs text-blue-300 border border-blue-500/30">
            Interactive
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          viewBox="0 0 800 600"
          className="overflow-visible"
        />
      </div>

      {selectedNode && (
        <div className="bg-gray-800/80 rounded-lg p-4 border border-green-500/30">
          <h4 className="text-green-400 font-semibold mb-2">Nodo Seleccionado</h4>
          <p className="text-white text-sm">
            <span className="text-gray-400">Especie:</span> {selectedNode}
          </p>
          <div className="mt-2 flex space-x-4 text-xs">
            <span className="text-gray-400">Método: Maximum Likelihood</span>
            <span className="text-gray-400">Bootstrap: 1000 réplicas</span>
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        <div className="flex space-x-4">
          <span>Especies: <span className="text-green-400">6</span></span>
          <span>Nodos internos: <span className="text-blue-400">4</span></span>
          <span>Longitud del árbol: <span className="text-purple-400">0.86</span></span>
        </div>
        <div className="text-xs bg-gray-800/50 px-2 py-1 rounded">
          PhyML Engine
        </div>
      </div>
    </div>
  );
}
