type Props = {
    onMenuClick: () => void,
    isMenuOpen:boolean
}

export const BackgroundMenu = ({isMenuOpen, onMenuClick}: Props) => (
    <div id="overlay" className={`fixed inset-0 bg-black/30 z-40 ${isMenuOpen?"":"hidden"}`} onClick={onMenuClick}></div>
); 