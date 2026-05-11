"use client";

import { Box, Typography, Chip } from "@mui/material";

const NODES = [
  { id: "client", label: "Client", x: 8, y: 45, status: "ok" },
  { id: "lb", label: "Load Balancer", x: 30, y: 45, status: "warn" },
  { id: "api1", label: "API A", x: 55, y: 22, status: "ok" },
  { id: "api2", label: "API B", x: 55, y: 68, status: "ok" },
  { id: "db", label: "Database", x: 82, y: 45, status: "critical" },
];

const EDGES = [
  ["client", "lb"],
  ["lb", "api1"],
  ["lb", "api2"],
  ["api1", "db"],
  ["api2", "db"],
] as const;

const STATUS: Record<string, string> = {
  ok: "#14a88a",
  warn: "#2376ff",
  critical: "#ef5a4c",
};

export default function PressureMap() {
  const getNode = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Typography variant="overline" color="text.secondary">
          System Pressure Map
        </Typography>
        <Chip
          label="Preview"
          size="small"
          sx={{
            height: 18,
            fontSize: "0.58rem",
            bgcolor: "rgba(114,87,255,0.08)",
            color: "#7257ff",
            "& .MuiChip-label": { px: 0.75 },
          }}
        />
      </Box>
      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          backgroundImage: `
            linear-gradient(rgba(35, 118, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(35, 118, 255, 0.045) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundColor: "#eef4fc",
          boxShadow:
            "inset 4px 4px 10px rgba(77,91,124,0.12), inset -4px -4px 10px rgba(255,255,255,0.6)",
          p: 2,
          height: 160,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {EDGES.map(([from, to]) => {
            const f = getNode(from);
            const t = getNode(to);
            return (
              <line
                key={`${from}-${to}`}
                x1={`${f.x}%`} y1={`${f.y}%`}
                x2={`${t.x}%`} y2={`${t.y}%`}
                stroke="rgba(35,118,255,0.25)"
                strokeWidth="0.6"
                strokeDasharray="2.5 1.5"
              />
            );
          })}
          {NODES.map((node) => (
            <g key={node.id}>
              <circle
                cx={`${node.x}%`} cy={`${node.y}%`}
                r="3.5"
                fill={STATUS[node.status]}
                opacity={0.9}
              />
              <circle
                cx={`${node.x}%`} cy={`${node.y}%`}
                r="5.5"
                fill={STATUS[node.status]}
                opacity={0.12}
              />
              <text
                x={`${node.x}%`} y={`${node.y + 9}%`}
                textAnchor="middle"
                fontSize="4"
                fill="#657084"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </Box>
    </Box>
  );
}
