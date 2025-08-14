import { useState } from "react";
import { coloresTailwind } from "../types/catalogs/TailwindColors";

type Props = {
    color: string;
    setColor: (color: string) => void;
};

export const ColorDropdown = ({ color, setColor }: Props) => {

    const [showColors, setShowColors] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setShowColors(!showColors)}
                className="w-full border border-gray-300 rounded-lg p-2 flex justify-between items-center"
            >
                <span className="flex items-center gap-2">
                    <span className={`w-4 h-4 bg-${color}-500 rounded`} />
                    {coloresTailwind.find(c => c.value === color)?.name}
                </span>
                <span>▼</span>
            </button>

            {showColors && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full mt-1 max-h-48 overflow-y-auto shadow">
                    {coloresTailwind.map(c => (
                        <li
                            key={c.value}
                            onClick={() => {
                                setColor(c.value);
                                setShowColors(false);
                            }}
                            className="p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                        >
                            <span className={`w-4 h-4 bg-${c.value}-500 rounded`} />
                            {c.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}