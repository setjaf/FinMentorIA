import { Plus } from "lucide-react";

type Props = {
  onClick: () => void;
};

export const FloatingButton = ({ onClick }: Props) => (
  <button
    onClick={onClick}
    className="fixed bottom-20 right-6 bg-blue-700 text-white text-2xl w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-800 z-30"
  >
    <Plus />
  </button>
);
