import { queryResult } from "@/lib/react-query-helpers";
import { dashboardService } from "@/services/dashboard";

export const dashboardQueries = {
  getAdminData: () =>
    queryResult(["dashboard-admin-data"], () => dashboardService.getAdminData()),

  getStudentsChart: () =>
    queryResult(["dashboard-students-chart"], () => dashboardService.getStudentsChart()),

  getAttendanceChart: () =>
    queryResult(["dashboard-attendance-chart"], () => dashboardService.getAttendanceChart()),

  getUserRolesChart: () =>
    queryResult(["dashboard-user-roles-chart"], () => dashboardService.getUserRolesChart()),

  withCookies: (cookies: string) => ({
    getAdminData: () =>
      queryResult(["dashboard-admin-data"], () =>
        dashboardService.getAdminData(cookies)
      ),

    getStudentsChart: () =>
      queryResult(["dashboard-students-chart"], () =>
        dashboardService.getStudentsChart(cookies)
      ),

    getAttendanceChart: () =>
      queryResult(["dashboard-attendance-chart"], () =>
        dashboardService.getAttendanceChart(cookies)
      ),

    getUserRolesChart: () =>
      queryResult(["dashboard-user-roles-chart"], () =>
        dashboardService.getUserRolesChart(cookies)
      ),
  }),
};

