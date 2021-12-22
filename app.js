const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmDelete, listadoTareasChecklist } = require("./helpers/inquirer");
const Tareas = require("./models/tareas");
require("colors");

const main = async () => {
  let opt = "";
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if(tareasDB) {
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        const desc = await leerInput('Descripción: ');
        tareas.crearTareas(desc);
        break;
      case "2":
        tareas.mostrarListado();
        break;
      case "3":
        tareas.listarTareasPendientesCompletadas(true);
        break;
      case "4":
        tareas.listarTareasPendientesCompletadas(false);
        break;
      case "5":
        const ids = await listadoTareasChecklist(tareas.listadoArr);
        tareas.toggleTaskStatus(ids);
        break;
      case "6":
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== '0'){
          const deleteTask = await confirmDelete('¿Está seguro?');
          if(deleteTask) {
            tareas.borrarTarea(id);
            console.log('Tarea borrada con éxito!')
          }
        }
        break;
    }
    guardarDB(tareas.listadoArr);
    await pausa();
  } while (opt !== "0");
};

main();
