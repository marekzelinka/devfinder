import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/search.tsx", [index("routes/search-result.tsx")]),
  ...prefix("resources", [route("users", "resources/users.tsx")]),
] satisfies RouteConfig;
