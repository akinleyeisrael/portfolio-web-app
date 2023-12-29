import dynamic from "next/dynamic";
import SidePanel from "./components/SidePanel"
import TopNav from "./components/TopNav";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen">
       {/* <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} /> */}
      <SidePanel />
      <TopNav/>
      {children}
    </main>

  )
}