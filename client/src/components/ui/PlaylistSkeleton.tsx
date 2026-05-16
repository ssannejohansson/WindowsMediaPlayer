import type { ReactElement } from "react";
import "./skeleton.css";

const SkeletonTrackRow = (): ReactElement => (
    <div style={{ display: "grid", gridTemplateColumns: "36px 2fr 1fr 64px", gap: 4, padding: "2px 6px", alignItems: "center", borderBottom: "1px solid #f0eeea" }}>
        <div className="skeleton-block" style={{ height: 9, width: 20 }} />
        <div className="skeleton-block" style={{ height: 10 }} />
        <div className="skeleton-block" style={{ height: 9 }} />
        <div className="skeleton-block" style={{ height: 9, width: 36, justifySelf: "end" }} />
    </div>
);

export const PlaylistSkeleton = (): ReactElement => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8, background: "#ece9d8", minHeight: "100%", fontFamily: "Tahoma, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", background: "#d4d0c8", border: "2px outset #d4d0c8" }}>
            <div className="skeleton-block" style={{ flexShrink: 0, width: 48, height: 48 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                <div className="skeleton-block" style={{ height: 8, width: "15%" }} />
                <div className="skeleton-block" style={{ height: 12, width: "40%" }} />
                <div className="skeleton-block" style={{ height: 9, width: "25%" }} />
            </div>
        </div>

        <div style={{ border: "2px inset #d4d0c8", background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "36px 2fr 1fr 64px", gap: 4, padding: "2px 6px", background: "#d4d0c8", borderBottom: "1px solid #a8a4a0" }}>
                <div className="skeleton-block" style={{ height: 9, width: 12, opacity: 0.4 }} />
                <div className="skeleton-block" style={{ height: 9, width: "30%", opacity: 0.4 }} />
                <div className="skeleton-block" style={{ height: 9, width: "40%", opacity: 0.4 }} />
                <div className="skeleton-block" style={{ height: 9, width: 36, opacity: 0.4, justifySelf: "end" }} />
            </div>
            {Array.from({ length: 12 }).map((_, i) => <SkeletonTrackRow key={i} />)}
        </div>
    </div>
);
