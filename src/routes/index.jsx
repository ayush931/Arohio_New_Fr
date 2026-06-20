import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Signup from "../pages/Signup";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import CookiesPolicy from "../pages/Cookies";
import Pricing from "../pages/Pricing";
import Contact from "../pages/Contact";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import Features from "../pages/Features";
import FeatureDetail from "../pages/FeatureDetail";

import DashboardHome from "../pages/dashboard/Home";
import DashboardUploads from "../pages/dashboard/DashboardUploads";
import DashboardProcessPdf from "../pages/dashboard/ProcessPdf";
import DashboardAltText from "../pages/dashboard/DashboardAltText";
import DashboardReviewApproval from "../pages/dashboard/DashboardReviewApproval";
import DashboardExportResults from "../pages/dashboard/DashboardExportResults";
import DashboardProjects from "../pages/dashboard/DashboardProjects";
import ReportsAnalytics from "../pages/dashboard/ReportsAnalytics";
import AutomationScheduling from "../pages/dashboard/AutomationScheduling";
import ProfileSettings from "../pages/dashboard/ProfileSettings";
import Preferences from "../pages/dashboard/Preferences";
import SecuritySettings from "../pages/dashboard/SecuritySettings";
import PrivacySettings from "../pages/dashboard/PrivacySettings";
import BillingSubscription from "../pages/dashboard/BillingSubscription";
import ChatBoard from "../pages/dashboard/Chatbot";
import SupportCenter from "../pages/dashboard/SupportCenter";
import TeamManagement from "../pages/dashboard/Teams/TeamsPage";
import RolePermissions from "../pages/dashboard/Teams/RolePermissions";
import CollaborationWorkflow from "../pages/dashboard/Teams/CollaborationWorkflow";
import TeamCollaboration from "../pages/dashboard/Teams/TeamCollaboration";
import Notifications from "../pages/dashboard/Teams/Notifications";
import AdminDashboard from "../pages/admin/dashboard";
import AdminUserManagement from "../pages/admin/UserManagement";
import AdminCreditManagement from "../pages/admin/AdminCreditManagement";
import AdminSystemReports from "../pages/admin/AdminSystemReports";
import AdminSupportTickets from "../pages/admin/AdminSupportTickets";
import AdminAuditLogs from "../pages/admin/AdminAuditLogs";
import AdminProjects from "../pages/admin/AdminProjects";
import AdminRoles from "../pages/admin/AdminRoles";
import AdminModules from "../pages/admin/AdminModules";
import AdminPermissions from "../pages/admin/AdminPermissions";
import AdminNewsletters from "../pages/admin/AdminNewsletters";
import AdminBlogsManagement from "../pages/admin/AdminBlogsManagement";
import AdminAboutManagement from "../pages/admin/AdminAboutManagement";
import AdminHomeManagement from "../pages/admin/AdminHomeManagement";
import AdminPlansManagement from "../pages/admin/AdminPlansManagement";
import PdfToExcel from "../pages/PdfToExcel";
import FeatureLayout from "../layouts/FeatureLayout";
import ProtectedRoute from "../pages/ProtectedRoute";
import ExcelToAltText from "../pages/ExcelToAltText";
import PdfToAltText from "../pages/PdfToAltText";


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/terms", element: <Terms /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/cookies", element: <CookiesPolicy /> },
      { path: "/pricing", element: <Pricing /> },
      { path: "/contact", element: <Contact /> },
      { path: "/blog", element: <Blog /> },
      { path: "/blog-details/:id", element: <BlogDetails /> },
      { path: "/features", element: <Features /> },
      { path: "/feature-list/:id", element: <FeatureDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/forgot", element: <ForgotPassword /> },
  { path: "/reset", element: <ResetPassword /> },
  { path: "/signup", element: <Signup /> },
  {
    element: (
      <ProtectedRoute>
        <FeatureLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/tools/pdf-to-excel", element: <PdfToExcel /> },
      { path: "/tools/excel-to-alttext", element: <ExcelToAltText /> },
      { path: "/tools/pdf-to-alttext", element: <PdfToAltText /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "uploads", element: <DashboardUploads /> },
      { path: "uploads/:id/process", element: <DashboardProcessPdf /> },
      { path: "uploads/:id/alt-text", element: <DashboardAltText /> },
      { path: "uploads/:id/review", element: <DashboardReviewApproval /> },
      { path: "exports", element: <DashboardExportResults /> },
      { path: "projects", element: <DashboardProjects /> },
      { path: "reports-analytics", element: <ReportsAnalytics /> },
      { path: "automation", element: <AutomationScheduling /> },
      { path: "profile", element: <ProfileSettings /> },
      { path: "preferences", element: <Preferences /> },
      { path: "security", element: <SecuritySettings /> },
      { path: "privacy", element: <PrivacySettings /> },
      { path: "billing", element: <BillingSubscription /> },
      { path: "chatbot", element: <ChatBoard /> },
      { path: "help", element: <SupportCenter /> },
      { path: "teams/management", element: <TeamManagement /> },
      { path: "teams/roles", element: <RolePermissions /> },
      { path: "teams/workflow", element: <CollaborationWorkflow /> },
      { path: "teams/collaboration", element: <TeamCollaboration /> },
      { path: "notifications", element: <Notifications /> },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "plans", element: <AdminPlansManagement /> },
      { path: "users", element: <AdminUserManagement /> },
      { path: "credits", element: <AdminCreditManagement /> },
      { path: "system-reports", element: <AdminSystemReports /> },
      { path: "support-tickets", element: <AdminSupportTickets /> },
      { path: "audit-logs", element: <AdminAuditLogs /> },
      { path: "projects", element: <AdminProjects /> },
      { path: "roles", element: <AdminRoles /> },
      { path: "modules", element: <AdminModules /> },
      { path: "permissions", element: <AdminPermissions /> },
      { path: "newsletters", element: <AdminNewsletters /> },
      { path: "crm/blogs", element: <AdminBlogsManagement /> },
      { path: "about", element: <AdminAboutManagement /> },
      { path: "home", element: <AdminHomeManagement /> },

    ],
  }


]);

export default router;
