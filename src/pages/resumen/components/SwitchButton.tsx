
type SwitchButtonProps = {
    onChangeView: (mode: 'categoria' | 'dia') => void;
    viewMode: 'categoria' | 'dia';
};

const SwitchButton = ({ onChangeView, viewMode }: SwitchButtonProps) => {

    return (
        <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-md shadow-md" role="group">
                <button
                    type="button"
                    onClick={() => onChangeView('categoria')}
                    className={`px-3 py-2 text-xs font-medium transition-colors duration-200 rounded-l-lg ${viewMode === 'categoria'
                            ? 'bg-blue-900 text-white '
                            : 'bg-white text-gray-900 '
                        }`}
                >
                    Por Categoría
                </button>
                <button
                    type="button"
                    onClick={() => onChangeView('dia')}
                    className={`px-3 py-2 text-xs font-medium transition-colors duration-200 -ml-px rounded-r-md ${viewMode === 'dia'
                            ? 'bg-blue-900 text-white '
                            : 'bg-white text-gray-900 '
                        }`}
                >
                    Por Día
                </button>
            </div>
        </div>
    );

};

export default SwitchButton;