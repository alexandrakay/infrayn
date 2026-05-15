"use client";

import { Box, Card, CardActionArea, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { SavedReview } from "@/lib/types";

interface Props {
  reviews: SavedReview[];
  onOpen: (r: SavedReview) => void;
  onDelete?: (id: string) => void;
}

interface Group {
  name: string;
  reviews: SavedReview[];
}

function scoreColor(score: number) {
  return score >= 7 ? "#14a88a" : score >= 4 ? "#2376ff" : "#ef5a4c";
}

function ScoreTrend({ reviews }: { reviews: SavedReview[] }) {
  const sorted = [...reviews].sort((a, b) => a.createdAt - b.createdAt);
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
      {sorted.map((r, i) => (
        <Stack key={r.id} direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          {i > 0 && (
            <Typography sx={{ color: "text.disabled", fontSize: "0.7rem" }}>→</Typography>
          )}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.85rem",
              color: scoreColor(r.output.overall_score),
            }}
          >
            {r.output.overall_score}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function SystemHistory({ reviews, onOpen, onDelete }: Props) {
  const groups: Group[] = [];
  const seen = new Map<string, Group>();

  for (const r of reviews) {
    const key = r.systemName?.trim() || "";
    const label = key || "__unnamed__";
    if (!seen.has(label)) {
      const g = { name: key, reviews: [] };
      seen.set(label, g);
      groups.push(g);
    }
    seen.get(label)!.reviews.push(r);
  }

  return (
    <Stack spacing={4}>
      {groups.map((group) => (
        <Box key={group.name || "__unnamed__"}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary">
              {group.name || "Unnamed"}
            </Typography>
            {group.reviews.length > 1 && <ScoreTrend reviews={group.reviews} />}
          </Stack>

          <Stack spacing={1.5}>
            {[...group.reviews]
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((r) => (
                <Card key={r.id}>
                  <Box sx={{ display: "flex", alignItems: "stretch" }}>
                    <CardActionArea onClick={() => onOpen(r)} sx={{ flex: 1 }}>
                      <CardContent>
                        <Stack
                          direction="row"
                          sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.75 }}
                        >
                          <Chip
                            label={r.mode}
                            size="small"
                            sx={{ textTransform: "capitalize", fontSize: "0.65rem" }}
                          />
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.9rem",
                              color: scoreColor(r.output.overall_score),
                            }}
                          >
                            {r.output.overall_score}/10
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            color: "text.secondary",
                          }}
                        >
                          {r.input}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
                          {new Date(r.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    {onDelete && (
                      <Box sx={{ display: "flex", alignItems: "center", pr: 1 }}>
                        <IconButton
                          size="small"
                          aria-label="Delete review"
                          onClick={() => onDelete(r.id)}
                          sx={{ color: "text.disabled", "&:hover": { color: "#ef5a4c" } }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Card>
              ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
