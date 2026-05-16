import "./chrome.css";

interface TitleBarProps {
    title: string;
}

export const TitleBar = ({ title }: TitleBarProps) => {
    return (
        <div className="wmp-titlebar">
            <div className="wmp-titlebar-left">
                {/* WMP orange icon */}
                <div className="wmp-icon" />
                <span className="wmp-titlebar-title">{title}</span>
            </div>
            <div className="wmp-titlebar-buttons">
                <button type="button" className="wmp-btn-chrome" title="Minimize">−</button>
                <button type="button" className="wmp-btn-chrome wmp-btn-maximize" title="Maximize">□</button>
                <button type="button" className="wmp-btn-chrome wmp-btn-close" title="Close">×</button>
            </div>
        </div>
    )
}
