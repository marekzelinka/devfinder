import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/search.tsx", [index("routes/results.tsx")]),
] satisfies RouteConfig;
