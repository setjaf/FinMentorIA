import { useReducer, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import type { GastoType } from '../types/GastoType';
import * as GastosDB from '../db/GastosDB';
import { localNow, getLastDayOfMonth } from '../utils/TimeUtil';

// 1. Definimos la forma del estado que manejará el hook
interface ResumenState {
    tipo: 'mensual' | 'quincenal' | 'personalizado';
    anio: string;
    mes: string;
    quincena: 'primera' | 'segunda';
    fechaInicio: string;
    fechaFin: string;
    gastos: GastoType[];
    aniosMeses: { [anio: string]: Set<string> };
    loading: boolean;
    error: string | null;
}

// 2. Definimos las acciones que pueden modificar el estado
type ResumenAction =
    | { type: 'SET_TIPO'; payload: ResumenState['tipo'] }
    | { type: 'SET_PERIODO'; payload: Partial<Pick<ResumenState, 'anio' | 'mes' | 'quincena' | 'fechaInicio' | 'fechaFin'>> }
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: { gastos: GastoType[]; aniosMeses: ResumenState['aniosMeses'], fechaInicio: string, fechaFin: string } }
    | { type: 'FETCH_ERROR'; payload: string };

const mesActual = localNow().toISOString().slice(5, 7);
const anioActual = localNow().getFullYear().toString();
const diaActual = localNow().getDate();


// 3. Estado inicial
const initialState: ResumenState = {
    tipo: 'mensual',
    anio: anioActual,
    mes: mesActual,
    quincena: 'primera',
    fechaInicio: `${anioActual}-${mesActual}-01`,
    fechaFin: `${anioActual}-${mesActual}-${diaActual}`,
    gastos: [],
    aniosMeses: {},
    loading: true,
    error: null,
};

// 4. El "reducer" es una función pura que calcula el nuevo estado basado en la acción
function resumenReducer(state: ResumenState, action: ResumenAction): ResumenState {
    switch (action.type) {
        case 'SET_TIPO':
            return { ...state, tipo: action.payload };
        case 'SET_PERIODO':
            return { ...state, ...action.payload };
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, ...action.payload };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

export function useResumen() {
    const location = useLocation();
    const [state, dispatch] = useReducer(resumenReducer, initialState);

    // 5. Efecto para actualizar el tipo de resumen cuando cambia la URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tipoFromURL = params.get('tipo') as ResumenState['tipo'] | null;
        if (tipoFromURL && tipoFromURL !== state.tipo) {
            dispatch({ type: 'SET_TIPO', payload: tipoFromURL });
        }
    }, [location.search, state.tipo]);

    // 6. Efecto principal para cargar los datos cuando cambia el período
    const cargarDatos = useCallback(async () => {
        dispatch({ type: 'FETCH_START' });

        try {
            let fechaInicio = '';
            let fechaFin = '';

            switch (state.tipo) {
                case 'mensual':
                    fechaInicio = `${state.anio}-${state.mes}-01`;
                    fechaFin = `${state.anio}-${state.mes}-${getLastDayOfMonth(Number(state.anio), Number(state.mes) - 1)}`;
                    break;
                case 'quincenal':
                    if (state.quincena === 'primera') {
                        fechaInicio = `${state.anio}-${state.mes}-01`;
                        fechaFin = `${state.anio}-${state.mes}-15`;
                    } else {
                        fechaInicio = `${state.anio}-${state.mes}-16`;
                        fechaFin = `${state.anio}-${state.mes}-${getLastDayOfMonth(Number(state.anio), Number(state.mes) - 1)}`;
                    }
                    break;
                case 'personalizado':
                    fechaInicio = state.fechaInicio;
                    fechaFin = state.fechaFin;
                    break;
            }

            if (!fechaInicio || !fechaFin) {
                dispatch({ type: 'FETCH_SUCCESS', payload: { gastos: [], aniosMeses: {}, fechaInicio, fechaFin  } });
                return;
            }

            const [gastos, aniosMeses] = await Promise.all([
                GastosDB.getGastosPorRango(fechaInicio, fechaFin),
                GastosDB.getAniosMesesDisponibles(),
            ]);
            console.log({ fechaInicio, fechaFin });
            console.log({ gastos, aniosMeses });


            dispatch({ type: 'FETCH_SUCCESS', payload: { gastos, aniosMeses, fechaInicio, fechaFin  } });

        } catch (err: any) {
            dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Error al cargar datos' });
        }
    }, [state.tipo, state.anio, state.mes, state.quincena, state.fechaInicio, state.fechaFin]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    useEffect(() => {
        const mesesAnio = state.aniosMeses[state.anio];
        if (!mesesAnio){
            dispatch({type: 'SET_PERIODO', payload: {anio: anioActual, mes: mesActual}});
        } else if (!mesesAnio.has(state.mes)){
            dispatch({type: 'SET_PERIODO', payload: {anio: state.anio, mes: mesesAnio.values().next().value}})
        }

    }, [state.anio]);

    // Escucha eventos globales para recargar si hay cambios en la BD
    useEffect(() => {
        window.addEventListener('gastos:cambio', cargarDatos);
        return () => window.removeEventListener('gastos:cambio', cargarDatos);
    }, [cargarDatos]);

    // 7. Exponemos el estado y las funciones para modificarlo
    const setPeriodo = useCallback((payload: Partial<Pick<ResumenState, 'anio' | 'mes' | 'quincena' | 'fechaInicio' | 'fechaFin'>>) => {
        dispatch({ type: 'SET_PERIODO', payload });
    }, []);

    return { state, setPeriodo };
}
