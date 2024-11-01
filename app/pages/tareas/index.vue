<script lang="ts" setup>
import {ref} from 'vue';
import MiCard from "~/components/personalized/MiCard.vue";

const {AlertCuestion} = useSweetAlert2();

const cliente = useSanctumRequest();

const {notifySuccess, notifyError} = useToastNotifications();

const columnsItems = ref([
  {
    "label": "Nombre",
    "field": "nombre"
  },
  {
    "label": "Fecha Ejecucion",
    "field": "fecha_ejecucion"
  },
  {
    "label": "Hora Ejecucion",
    "field": "hora_ejecucion"
  },
  {
    "label": "Estado",
    "field": "estado.nombre"
  },
  {
    "label": "Prioridad",
    "field": "prioridad.nombre"
  },
  {
    "label": "Tipo",
    "field": "tipo.nombre"
  },
  {
    "label": "Recordatorio",
    "field": "recordatorio.nombre"
  }
]);

columnsItems.value.push({
  label: 'Opciones',
  field: 'opciones',
  filterable: false,
  sortable: false,
  width: '200px'
});

let items = ref([]);

const getItems = async () => {

  try {

    let res = await cliente.get('api/tareas');

    items.value = res.data

  } catch (e) {

    console.log(e.message);

  }

}

getItems();
const deleteItem = async (id: number) => {

  if ((await AlertCuestion('¿Estas seguro de eliminar est@ Tarea?')).isConfirmed) {

    try {

      let res = await cliente.delete('api/tareas/' + id);

      notifySuccess('Tarea Elimiado', res.data.message);

      await getItems();

    } catch (e) {

      notifyError('Error', e.message);

    }

  }

};

const cumplir = async (id: number) => {

  if ((await AlertCuestion('¿Estas seguro de cumplir esta Tarea?')).isConfirmed) {

    try {

      let res = await cliente.get('api/tarea-cumplir/' + id);

      notifySuccess('Tarea Cumplida', res.data.message);

      await getItems();

    } catch (e) {

      notifyError('Error', e.message);

    }

  }

};

const active = useState('activeItem');
active.value = 'Tarea';

</script>

<template>
  <div class="text-right mb-4">
    <UButton
        icon="i-heroicons-pencil-square"
        size="sm"
        color="primary"
        variant="solid"
        label="Nuevo"
        :trailing="false"
        to="tareas/create"
    />
  </div>

  <mi-card borderColor="#e74c3c">
    <vue-good-table
        :columns="columnsItems"
        :rows="items"
        :search-options="{ enabled: true }"
        :pagination-options="{ enabled: true, perPage: 5 }"
    >

      <template #table-row="props">
        <span v-if="props.column.field == 'opciones'">

            <UButton
                icon="i-heroicons-eye"
                size="sm"
                color="blue"
                variant="solid"
                class="mr-1"
                :to=" 'tareas/show/' + props.row.id "
                :disabled="props.row.estado.nombre == 'Cumplida'"
            />
            <UButton
                icon="i-heroicons-pencil-square"
                size="sm"
                color="yellow"
                variant="solid"
                :to=" 'tareas/edit/' + props.row.id "
                class="mr-1"
                :disabled="props.row.estado.nombre == 'Cumplida'"
            />
            <UButton
                icon="i-heroicons-check-circle"
                size="sm"
                color="green"
                @click="cumplir(props.row.id)"
                variant="solid"
                class="mr-1"
                :disabled="props.row.estado.nombre == 'Cumplida'"
            />

            <UButton
                icon="i-heroicons-trash"
                size="sm"
                color="red"
                variant="solid"
                @click="deleteItem(props.row.id)"
                class="mr-1"
                :disabled="props.row.estado.nombre == 'Cumplida'"
            />


          </span>

        <span v-else-if="props.column.label == 'Estado'">


             <UBadge color="green"
                     variant="solid"
                     label="Cumplida"
                     v-if="props.formattedRow[props.column.field] == 'Cumplida'"
             />

              <UBadge color="yellow"
                      variant="solid"
                      label="Pendiente"
                      v-else
              />

        </span>
        <span v-else>
            {{ props.formattedRow[props.column.field] }}
          </span>
      </template>

    </vue-good-table>
  </mi-card>
</template>

<style scoped>
</style>
