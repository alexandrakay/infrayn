import { Chip } from "@mui/material";
import { Severity } from "@/lib/types";

const colorMap: Record<Severity, "error" | "warning" | "success"> = {
  high: "error",
  medium: "warning",
  low: "success",
};

export default function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Chip
      label={severity}
      color={colorMap[severity]}
      size="small"
      sx={{ textTransform: "uppercase", fontWeight: 700, fontSize: "0.65rem" }}
    />
  );
}
