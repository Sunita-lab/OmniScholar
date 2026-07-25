import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Assignments from './pages/Assignments';
import AssignmentDetail from './pages/AssignmentDetail';
import CreateCourse from './pages/CreateCourse';
import CreateAssignment from './pages/CreateAssignment';
import Profile from './pages/Profile';

function DashboardRouter() {
  const { user } = useAuth();
  return user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardRouter />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Courses />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CourseDetail />
                </DashboardLayout>
              </ProtectedRoute>
              }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Assignments />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AssignmentDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/create"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <DashboardLayout>
                  <CreateCourse />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments/create"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <DashboardLayout>
                  <CreateAssignment />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;