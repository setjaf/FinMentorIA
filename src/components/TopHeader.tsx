import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  onMenuClick: () => void
};

export const TopHeader = ({ onMenuClick }: Props) => {
  let location = useLocation();
  const navigate = useNavigate();

  const [isInicio, setIsInicio] = useState(false);

  useEffect(() => {
    setIsInicio(location.pathname === "/")
  }, [location]);

  return (
    <header className="fixed w-svw top-0 flex items-center justify-between px-5 py-3 bg-white z-50">
      <button onClick={onMenuClick} className="text-2xl">
        <Menu />
      </button>
      {!isInicio && (
        <button
          className="text-blue-600 text-sm mx-5"
          onClick={() => navigate("/")}
        >
          ← Inicio
        </button>
      )}
    </header>
  );
};
