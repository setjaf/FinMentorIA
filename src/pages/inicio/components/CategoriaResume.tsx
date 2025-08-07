type Props = {
    categoria: string,
    total: number
};

export default function ({ categoria, total }:Props) {

    return(
        <div className="border rounded-xl px-4 py-3 flex justify-between items-center">
            <span className="font-medium text-gray-900">{categoria}</span>
            <span className="text-blue-800 font-semibold">${total.toFixed(2)}</span>
        </div>
    );
    
}