import type { ReactElement } from "react";
import "./skeleton.css";

const SkeletonTrackRow = (): ReactElement => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 4px", borderBottom: "1px solid #f0eeea" }}>
        <div className="skeleton-block" style={{ flexShrink: 0, width: 36, height: 36 }} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <div className="skeleton-block" style={{ height: 10, width: "60%" }} />
            <div className="skeleton-block" style={{ height: 9, width: "40%" }} />
        </div>
        <div className="skeleton-block" style={{ flexShrink: 0, width: 120, height: 9 }} />
        <div className="skeleton-block" style={{ flexShrink: 0, width: 32, height: 9 }} />
    </div>
);

const SkeletonPlaylistCard = (): ReactElement => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: 6, background: "#f0eeea", border: "2px outset #d4d0c8" }}>
        <div className="skeleton-block" style={{ width: 80, height: 80 }} />
        <div className="skeleton-block" style={{ width: "80%", height: 9 }} />
        <div className="skeleton-block" style={{ width: "50%", height: 8 }} />
    </div>
);

const SectionHeading = ({ width = "30%" }: { width?: string }): ReactElement => (
    <div style={{ padding: "2px 4px", background: "linear-gradient(to right, #3a6ea5, #7ba7d4)", marginBottom: 4 }}>
        <div className="skeleton-block" style={{ height: 10, width, opacity: 0.4 }} />
    </div>
);

export const LibrarySkeleton = (): ReactElement => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", padding: 8, background: "#ece9d8", minHeight: "100%", fontFamily: "Tahoma, sans-serif" }}>
        <div>
            <SectionHeading width="25%" />
            <div style={{ border: "2px inset #d4d0c8", background: "#fff" }}>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonTrackRow key={i} />)}
            </div>
        </div>

        <div>
            <SectionHeading width="20%" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8 }}>
                {Array.from({ length: 6 }).map((_, i) => <SkeletonPlaylistCard key={i} />)}
            </div>
        </div>
    </div>
);
