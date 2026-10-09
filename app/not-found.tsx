import { ActionLink } from "@/components/ui/ActionLink";

export default function NotFound() {
  return (
    <main id="main-content" className="section">
      <div className="containerNarrow">
        <p className="eyebrow">404 / Page not found</p>
        <h1 className="displayTitle">This road does not lead to a listing.</h1>
        <p className="sectionCopy">The page may have moved, or the vehicle may no longer be available.</p>
        <div style={{ marginTop: "2rem" }}><ActionLink href="/cars">Browse Available Cars</ActionLink></div>
      </div>
    </main>
  );
}
