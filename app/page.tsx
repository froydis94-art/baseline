import { Dashboard } from "@/components/Dashboard";
import { fetchBodyDashboard } from "@/lib/terra";

export default async function Home() {
  const dashboard = await fetchBodyDashboard();
  return <Dashboard dashboard={dashboard} />;
}
