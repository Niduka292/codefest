import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12">
      <div className="radar-disc absolute h-[34rem] w-[34rem] opacity-25" />
      <AdminLoginForm />
    </div>
  );
}
