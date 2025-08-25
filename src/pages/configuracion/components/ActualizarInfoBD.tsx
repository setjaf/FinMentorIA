import { getDB } from "../../../db/InitializeDB";


const ActualizarInfoBD = () => {

    const handleActualizar = async () => {
        
        console.log('Haciendo upgrade de version');

        const db = await getDB();
        
        try {
          const gastosAll = await db.getAll('gastos');

          const tx = db.transaction('gastos', 'readwrite');
          const now = new Date().toISOString();

          for (const gasto of gastosAll) {
              if (gasto.fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
                const nuevaFecha = new Date(`${gasto.fecha}T00:00:00`).toISOString();
                gasto.fecha = nuevaFecha;
                const gastoToInsert = {
                    ...gasto,
                    createdAt: gasto.createdAt || now,
                    updatedAt: now, // Siempre establece la fecha de actualización
                };
                await tx.store.put(gastoToInsert as any);
              }              
          }
          await tx.done;
        } catch (error) {
          console.log(error);          
        }
    }


    return(
        <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleActualizar}>Actualizar BD</button>
        </div>
    )

}

export default ActualizarInfoBD;