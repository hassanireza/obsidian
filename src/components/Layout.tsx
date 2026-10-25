import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import GrainOverlay from "./GrainOverlay";
import MobileTabBar from "./MobileTabBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <GrainOverlay />
      <Header />
      <main id="main" className="app-main">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
