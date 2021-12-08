import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Profile from "@/pages/Profile.vue";
import Users from "@/pages/Users.vue";
import Teams from "@/pages/Teams.vue";
import Meetings from "@/pages/Meetings.vue";
import Feedbacks from '@/pages/Feedbacks.vue';
import Notifications from "@/pages/Notifications.vue";
import Messages from "@/pages/Messages.vue"
import Support from "@/pages/Support.vue";
import Team from '../components/Team/Team.vue'
import TeamMessages from '../components/Team/TeamMessages.vue'
import TeamFiles from '../components/Team/TeamFiles.vue'
import TeamImages from '../components/Team/TeamImages.vue'
import Meeting from '../components/Meeting/Meeting.vue'

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
        component: Users
      },
      {
        path: "teams",
        name: "Teams",
        component: Teams,
      },
      {
        path: '/teams/:teamId/messages',
        name: 'TeamMessages',
        component: TeamMessages
      },
      {
        path: '/teams/:teamId/images',
        name: 'TeamImages',
        component: TeamImages
      },
      {
        path: '/teams/:teamId/files',
        name: 'TeamFiless',
        component: TeamFiles
      },
      {
        path: '/teams/:teamId',
        name: 'Team',
        component: Team
      },
      {
        path: "meetings/:meetingId",
        name: "Meeting",
        component: Meeting,
      },
      {
        path: "meetings",
        name: "Meetings",
        component: Meetings,
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'messages',
        name: 'Messages',
        component: Messages
      },
      {
        path: 'feedbacks',
        name: 'Feedbacks',
        component: Feedbacks
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
