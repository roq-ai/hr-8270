const mapping: Record<string, string> = {
  employees: 'employee',
  'engagement-tools': 'engagement_tool',
  organizations: 'organization',
  'performance-evaluations': 'performance_evaluation',
  'time-trackings': 'time_tracking',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
