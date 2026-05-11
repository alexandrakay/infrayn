"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Stack,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ArchitectureReview, ReviewItem } from "@/lib/types";
import SeverityBadge from "./SeverityBadge";

function ItemSection({ title, items }: { title: string; items: ReviewItem[] }) {
  if (!items.length) return null;
  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List disablePadding>
          {items.map((item, i) => (
            <ListItem key={i} divider={i < items.length - 1} sx={{ gap: 1.5, py: 1.5, px: 2, alignItems: "flex-start" }}>
              <SeverityBadge severity={item.severity} />
              <ListItemText primary={item.description} slotProps={{ primary: { variant: "body2" } }} />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List disablePadding>
          {items.map((item, i) => (
            <ListItem key={i} divider={i < items.length - 1} sx={{ py: 1.5, px: 2 }}>
              <ListItemText primary={item} slotProps={{ primary: { variant: "body2" } }} />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

interface Props {
  review: ArchitectureReview;
  onCopy: () => void;
}

export default function ReviewDisplay({ review, onCopy }: Props) {
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 3, display: "flex", gap: 3, alignItems: "center" }}>
        <Box sx={{ textAlign: "center", minWidth: 64 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {review.overall_score}
          </Typography>
          <Typography variant="caption" color="text.secondary">/ 10</Typography>
        </Box>
        <Divider orientation="vertical" sx={{ alignSelf: "stretch", height: "auto" }} />
        <Typography variant="body2" color="text.secondary">{review.summary}</Typography>
      </Paper>

      <ListSection title="Strengths" items={review.strengths} />
      <ItemSection title="Bottlenecks" items={review.bottlenecks} />
      <ItemSection title="Single Points of Failure" items={review.single_points_of_failure} />
      <ItemSection title="Scaling Concerns" items={review.scaling_concerns} />
      <ItemSection title="Security Gaps" items={review.security_gaps} />
      <ListSection title="Quick Wins" items={review.quick_wins} />

      {review.llm_specific && (
        <>
          <Typography variant="overline" color="text.secondary" sx={{ pt: 1 }}>
            LLM / AI Pipeline
          </Typography>
          <ListSection title="Model Recommendations" items={review.llm_specific.model_recommendations} />
          <ItemSection title="Hallucination Risks" items={review.llm_specific.hallucination_risks} />
          <ListSection title="Prompt Architecture" items={review.llm_specific.prompt_architecture} />
          <ListSection title="Cost Optimization" items={review.llm_specific.cost_optimization} />
          <ListSection title="Fallback Strategy" items={review.llm_specific.fallback_strategy} />
        </>
      )}

      <Button variant="outlined" fullWidth onClick={onCopy}>
        Copy report
      </Button>
    </Stack>
  );
}
