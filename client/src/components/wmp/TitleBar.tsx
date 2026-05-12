interface TitleBarProps {
    title: string;
}

export const TitleBar = ({ title }: TitleBarProps) => {
    return (
        <div className="flex items-center justify-between h-6 px-2 bg-wmp-blue text-white text-xs font-tahoma">
            <span>{title}</span>
            <div className="flex gap-1">
                <button className="w-5 h-5 flex items-center justify-center hover::bg-wmp-blueLight active::bg-wmp-blue transition-colors" title ="Minimize"> - </button>
                <button className="w-5 h-5 flex items-center justify-center hover::bg-wmp-blueLight active::bg-wmp-blue transition-colors" title ="Minimize"> □ </button>
                <button className="w-5 h-5 flex items-center justify-center hover::bg-wmp-blueLight active::bg-wmp-blue transition-colors" title ="Minimize"> × </button>
            </div>
        </div>
    )
}
