import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Profile from "@/pages/Profile.vue";
import User from "@/pages/User.vue";
import Teams from "@/pages/Teams.vue";
import Meeting from "@/pages/Meeting.vue";
import Support from "@/pages/Support.vue";
import Team from '../components/Team/Team.vue'
const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "profile",
        name: "My Profile",
        component: Profile,
      },
      {
        path: "users",
        name: "Users",
        component: User
      },
      {
        path: "teams",
        name: "Teams",
        component: Teams,
      },
      {
        path: '/teams/:teamId',
        name: 'Team',
        component: Team
      },
      {
        path: "meetings",
        name: "Meetings",
        component: Meeting,
      },
      {
        path: "support",
        name: "Support",
        component: Support,
      }
    ],
  }
];

export default routes;
