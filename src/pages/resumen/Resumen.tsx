import { useMemo, useState } from 'react';
import type { AgrupadoGastoType} from '../../types/GastoType';
import type { CategoriaType } from '../../types/CategoriaType';
import { useGastos } from '../../hooks/UseGastos';
import CategoriaDetail from './components/CategoriaDetail';
import SwitchButton from './components/SwitchButton';
import DiaDetail from './components/DiaDetail';
import PeriodoSelector from './components/PeriodoSelector';
import { useResumen } from '../../hooks/useResumen';

type ResumenProps = {
  categorias: CategoriaType[];
};

export default function Resumen({ categorias }: ResumenProps) {
  const [viewMode, setViewMode] = useState<'categoria' | 'dia'>('dia');
  
  // 1. Consumimos el hook. Toda la lógica de estado y carga de datos está aquí.
  const { state, setPeriodo } = useResumen();
  const { gastos, aniosMeses, loading, error, tipo, anio, mes, quincena, fechaInicio, fechaFin } = state;

  // El hook `useGastos` sigue siendo útil para las funciones de agrupación y cálculo.
  const { agruparPorCategoria, agruparPorDia, calcularTotal } = useGastos();

  // Calculamos valores derivados con useMemo para optimización.
  const gastosAgrupados = useMemo<AgrupadoGastoType>(() => {
    switch (viewMode) {
      case 'dia':
        return agruparPorDia(gastos);
      case 'categoria':
        return agruparPorCategoria(gastos);
      default:
        return {} as AgrupadoGastoType;
    }
  }, [gastos, viewMode, agruparPorCategoria, agruparPorDia]);

  const acumulado = useMemo(() => {
    return calcularTotal(gastos);
  }, [gastos, calcularTotal]);

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Resumen {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
        </h1>
        <div className="px-4 pt-2 pb-4">
          <p className="text-center text-sm text-gray-500 mb-1">Total de gastos del período</p>
          <p className="text-4xl text-center text-blue-900 font-light tracking-wide">${acumulado.toFixed(2)}</p>
        </div>
      </div>

      {/* Botón Switch para cambiar la vista */}
      <SwitchButton onChangeView={setViewMode} viewMode={viewMode} />

      {/* 2. Usamos el componente selector de período */}
      <PeriodoSelector
        tipo={tipo}
        anio={anio}
        setAnio={(a) => setPeriodo({ anio: a })}
        mes={mes}
        setMes={(m) => setPeriodo({ mes: m })}
        aniosMeses={aniosMeses}
        quincena={quincena}
        setQuincena={(q) => setPeriodo({ quincena: q })}
        fechaInicio={fechaInicio}
        setFechaInicio={(d) => setPeriodo({ fechaInicio: d })}
        fechaFin={fechaFin}
        setFechaFin={(d) => setPeriodo({ fechaFin: d })}
      />

      <div className="space-y-3">
        {loading && <p className="text-center text-gray-500">Cargando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && Object.keys(gastosAgrupados).length === 0 && (
          <p className="text-center text-gray-500 pt-8">
            No hay gastos registrados para este período.
          </p>
        )}
        {
          !loading && viewMode === 'categoria' && (Object.entries(gastosAgrupados ?? {}).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([categoria, lista]) => {
            return (
              <CategoriaDetail key={categoria} categoria={categorias.find(c => c.id == categoria)!} gastos={lista} />
            );
          }))
        }

        {
          !loading && viewMode === 'dia' && (Object.entries(gastosAgrupados ?? {}).sort(([diaA], [diaB]) => diaB.localeCompare(diaA)).map(([dia, lista]) => {
            return (
              <DiaDetail key={dia} dia={dia} gastos={lista} categorias={categorias} />
            );
          }))
        }
      </div>
    </>
  );
}
