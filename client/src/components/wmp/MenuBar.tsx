export const MenuBar = () => {
    const menuItems = ["File", "Edit", "View", "Help"];

    return (
        <div className="flex items-center h-6 px-2 bg-wmp-grayDark border-b border-wmp-grayDark">
            {menuItems.map((item) => (
                <button key={item} className="px-3 text-xs text-wmp-text hover:bg-wmp-gray transition-colors">
                    {item}
                </button>
            ))}
        </div>
    )
}
