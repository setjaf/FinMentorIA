import { meses } from "../../../types/catalogs/MesesCatalog";

type PeriodoSelectorProps = {
  tipo: 'mensual' | 'quincenal' | 'personalizado';
  // Props para mensual y quincenal
  anio: string;
  setAnio: (a: string) => void;
  mes: string;
  setMes: (m: string) => void;
  aniosMeses: { [anio: string]: Set<string> };
  // Props para quincenal
  quincena?: 'primera' | 'segunda';
  setQuincena?: (q: 'primera' | 'segunda') => void;
  // Props para personalizado
  fechaInicio?: string;
  setFechaInicio?: (d: string) => void;
  fechaFin?: string;
  setFechaFin?: (d: string) => void;
};

export default function PeriodoSelector({
  tipo,
  anio,
  setAnio,
  mes,
  setMes,
  aniosMeses,
  quincena,
  setQuincena,
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
}: PeriodoSelectorProps) {

  const renderMensual = () => (
    <div className="flex gap-2">
      <select
        className="border-1 border-gray-100 rounded-lg p-2 w-1/2 shadow-md"
        value={anio}
        onChange={(e) => setAnio(e.target.value)}
      >
        {Object.keys(aniosMeses).sort((a, b) => b.localeCompare(a)).map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <select
        className="border-1 border-gray-100 rounded-lg p-2 w-1/2 shadow-md"
        value={mes}
        onChange={(e) => setMes(e.target.value)}
      >
        {Array.from(aniosMeses[anio] || []).sort((a, b) => a.localeCompare(b)).map((m) => {
          const mesObj = meses.find(me => me.value === m);
          return (
            <option key={m} value={m}>
              {mesObj ? mesObj.label : m}
            </option>
          )
        })}
      </select>
    </div>
  );

  const renderQuincenal = () => (
    <div className="grid grid-cols-2 gap-2">
      <div className="col-span-2">
        {renderMensual()}
      </div>
      <select
        className="col-span-2 border-1 border-gray-100 rounded-lg p-2 w-full shadow-md"
        value={quincena}
        onChange={(e) => setQuincena?.(e.target.value as 'primera' | 'segunda')}
      >
        <option value="primera">Primera quincena (1-15)</option>
        <option value="segunda">Segunda quincena (16-fin)</option>
      </select>
    </div>
  );

  const renderPersonalizado = () => (
    <div className="flex gap-2 items-center justify-center">
      <div className="w-1/2">
        <label htmlFor="fecha-inicio" className="block text-xs text-gray-600 mb-1 text-left">Desde</label>
        <input id="fecha-inicio" type="date" value={fechaInicio} onChange={(e) => setFechaInicio?.(e.target.value)} className="w-full border-1 border-gray-100 rounded-lg p-2 shadow-md" />
      </div>
      <div className="w-1/2">
        <label htmlFor="fecha-fin" className="block text-xs text-gray-600 mb-1 text-left">Hasta</label>
        <input id="fecha-fin" type="date" value={fechaFin} onChange={(e) => setFechaFin?.(e.target.value)} className="w-full border-1 border-gray-100 rounded-lg p-2 shadow-md" />
      </div>
    </div>
  );

  switch (tipo) {
    case 'mensual':
      return renderMensual();
    case 'quincenal':
      return renderQuincenal();
    case 'personalizado':
      return renderPersonalizado();
    default:
      return null;
  }
}