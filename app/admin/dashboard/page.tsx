import AdminTable from "@/components/AdminTable";

export const metadata = {
  title: "एडमिन डैशबोर्ड",
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-surface">
      <AdminTable />
    </div>
  );
}
