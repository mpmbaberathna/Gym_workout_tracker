import ProfileSection from "../components/ProfileSection";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "trainer", "member"]}>
      <div className="relative min-h-screen w-full bg-brand-light text-brand-dark px-8 md:px-16 pt-28 pb-20">
        <div className="relative z-10 mx-auto max-w-6xl space-y-12">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark sm:text-5xl">Profile</h1>
            <p className="mt-4 text-base text-brand-gray leading-relaxed">Manage your account details and settings.</p>
          </div>

          <div>
            <ProfileSection />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
