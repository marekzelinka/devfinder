import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/search.tsx", [index("routes/search-result.tsx")]),
] satisfies RouteConfig;
