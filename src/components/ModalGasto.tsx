import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FormGasto } from "./FormGasto";
import { BackgroundMenu } from "./BackgroundMenu";



type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ModalGasto = ({ isOpen, onClose}: Props) => {
  // Controla la visibilidad del modal
  // y permite cerrar con la tecla Escape
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isOpen) return null;

  return (

    // <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div id="modal" className="fixed flex inset-0 z-50 items-center justify-center">
        <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-lg p-6 relative z-55">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Registrar nuevo gasto</h2>
            <button id="closeModal" className="text-gray-600 hover:text-red-600 text-xl" onClick={onClose}>
              <X />
            </button>
          </div>
          <FormGasto onClose={onClose}/>
        </div>
        <BackgroundMenu isMenuOpen={true} onMenuClick={onClose} />
      </div>
    // </div>

    
    )
};
