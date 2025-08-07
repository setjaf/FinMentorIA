import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  onMenuClick: () => void
};

export const TopHeader = ({ onMenuClick}: Props) => {
  let location = useLocation();

  const [isInicio, setIsInicio] = useState(false);

  useEffect(() => {
    setIsInicio(location.pathname=="/")
  }, [location]);

  return (
  <header className="flex items-center justify-between px-4 py-3 bg-white relative z-50">
    <button onClick={onMenuClick} className="text-2xl">
      <Menu />
    </button>
    <a href="/" className={`text-blue-600 text-sm ${isInicio?"hidden":""}`} >← Inicio</a>
  </header>
)};
