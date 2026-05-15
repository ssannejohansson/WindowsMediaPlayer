import "./menubar.css";

export const MenuBar = () => {
    const menuItems = ["File", "View", "Play", "Tools", "Help"];

    return (
        <div className="wmp-menubar">
            {menuItems.map((item) => (
                <button key={item} type="button" className="wmp-menu-item">
                    {item}
                </button>
            ))}
        </div>
    )
}
