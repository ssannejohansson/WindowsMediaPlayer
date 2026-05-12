import type { ReactNode } from "react";
import { TitleBar } from "./TitleBar";
import { MenuBar } from "./MenuBar";

interface WindowFrameProps {
    title: string
    children?: ReactNode
}

export const WindowFrame = ({ title, children }: WindowFrameProps) => {
    return (
        <div className="flex flex-col h-screen bg-wmp-gray border-2 wmp-window">
            {/* Title Bar */}
            <TitleBar title={title} />

            {/* Menu Bar */}
            <MenuBar />

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-wmp-gray p-2">
                {children}
            </div>
        </div>
    )
}