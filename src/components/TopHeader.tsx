import { Menu, ArrowLeft } from "lucide-react";
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
          className="inline-flex items-center text-blue-900 text-sm px-2 py-1 rounded-md hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} className="mr-1" />
          Regresar
        </button>
      )}
    </header>
  );
};
