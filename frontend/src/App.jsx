import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Classes from "./pages/Classes";
import Membership from "./pages/Membership";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AdminDashboard from "./pages/AdminDashboard";
import TrainerDashboard from "./pages/TrainerDashboard";
import TrainerWorkouts from "./pages/TrainerWorkouts";
import MemberDashboard from "./pages/MemberDashboard";
import Profile from "./pages/Profile";
import AdminWorkouts from "./pages/AdminWorkouts";
import TrainerPlans from "./pages/trainer/TrainerPlans";
import MemberPlans from "./pages/member/MemberPlans";
import MemberProgress from "./pages/MemberProgress";
import TrainerProgress from "./pages/TrainerProgress";
import TrainerSchedule from "./pages/TrainerSchedule";
import MemberSchedule from "./pages/MemberSchedule";
import AdminAssignTrainer from "./pages/AdminAssignTrainer";
import Reviews from "./pages/Reviews";
import AdminManageReviews from "./pages/AdminManageReviews";
import AdminPlans from "./pages/AdminPlans";
import AdminMessages from "./pages/admin/messages";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-brand-accent selection:text-brand-dark flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
              {/* public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/admin/messages" element={<AdminMessages />} />

              {/* admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/assign-trainer"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminAssignTrainer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/workouts"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminWorkouts />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/reviews"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminManageReviews />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/plans"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminPlans />
                  </ProtectedRoute>
                }
              />

              {/* trainer */}
              <Route
                path="/trainer"
                element={
                  <ProtectedRoute allowedRoles={["trainer"]}>
                    <TrainerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/trainer/schedule"
                element={
                  <ProtectedRoute allowedRoles={["trainer"]}>
                    <TrainerSchedule />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/trainer/workouts"
                element={
                  <ProtectedRoute allowedRoles={["trainer"]}>
                    <TrainerWorkouts />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/trainer/plans"
                element={
                  <ProtectedRoute allowedRoles={["trainer"]}>
                    <TrainerPlans />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/trainer/progress"
                element={
                  <ProtectedRoute allowedRoles={["trainer"]}>
                    <TrainerProgress />
                  </ProtectedRoute>
                }
              />

              {/* member */}
              <Route
                path="/member"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["admin", "trainer", "member"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/member/schedule"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <MemberSchedule />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/member/progress"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <MemberProgress />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/member/plans"
                element={
                  <ProtectedRoute allowedRoles={["member"]}>
                    <MemberPlans />
                  </ProtectedRoute>
                }
              />

              {/* fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
