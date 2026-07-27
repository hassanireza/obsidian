import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import GrainOverlay from "./GrainOverlay";
import MobileTabBar from "./MobileTabBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <GrainOverlay />
      <Header />
      <main className="app-main">{children}</main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
