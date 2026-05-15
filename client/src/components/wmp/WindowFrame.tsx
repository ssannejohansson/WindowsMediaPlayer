import type { ReactNode } from "react";
import { TitleBar } from "./TitleBar";
import { MenuBar } from "./MenuBar";
import "./chrome.css";

interface WindowFrameProps {
    title: string
    children?: ReactNode
}

export const WindowFrame = ({ title, children }: WindowFrameProps) => {
    return (
        <div className="wmp-window">
            {/* Title Bar */}
            <TitleBar title={title} />

            {/* Menu Bar */}
            <MenuBar />

            {/* Content Area */}
            <div className="wmp-content">
                {children}
            </div>
        </div>
    )
}