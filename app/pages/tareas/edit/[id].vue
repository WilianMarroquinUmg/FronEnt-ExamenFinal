<script setup lang="ts">
import MiCard from '~/components/personalized/MiCard.vue';
import {object, string, InferType} from 'yup';
import {ref, reactive, onMounted} from 'vue';
import type {FormSubmitEvent} from '#ui/types';
import InputDate from "~/components/personalized/InputDate.vue";
import multiselect from 'vue-multiselect';

const {notifySuccess, notifyError} = useToastNotifications();

const route = useRoute();
const id = route.params.id;

const schema = object({
  nombre: string().required("Este campo es requerido"),
  descripcion: string().required("Este campo es requerido"),
  fecha_ejecucion: string().required("Este campo es requerido"),
  hora_ejecucion: string().required("Este campo es requerido"),
  prioridad_id: object().required("Este campo es requerido"),
  tipo_id: object().required("Este campo es requerido"),
  recordatorio_id: object().required("Este campo es requerido")
})

const state = reactive({
  nombre: undefined,
  descripcion: undefined,
  fecha_ejecucion: undefined,
  hora_ejecucion: undefined,
  prioridad_id: undefined,
  tipo_id: undefined,
  recordatorio_id: undefined
});

const formRef = ref();

let cliente = useSanctumRequest();

const getItem = async () => {

  try {

    let res = await cliente.get(`api/tareas/${id}`);

    let objetKeys = Object.keys(state);

    objetKeys.forEach(key => {

      if (key && !isNaN(Date.parse(key))) {
        const date = new Date(key);

        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        state[key] = formattedDate;

      } else {

        if(key == "prioridad_id"){

          state[key] = res.data.prioridad;

        } else if(key == "tipo_id"){

          state[key] = res.data.tipo;

        } else if(key == "recordatorio_id"){

          state[key] = res.data.recordatorio;

        } else {

          state[key] = res.data[key];

        }


      }

    });


  } catch (e) {

    notifyError('Error', e.message);

  }

};

getItem();

const formatearCampoLabel = (str) => {

  return str
      .split('_')
      .filter(word => word.toLowerCase() !== 'id')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

async function onSubmit(event: FormSubmitEvent<InferType<typeof schema>>) {

  try {

    state.prioridad_id = state.prioridad_id.id;
    state.tipo_id = state.tipo_id.id;
    state.recordatorio_id = state.recordatorio_id.id;

    let res = await cliente.put(`api/tareas/${id}`, state);

    notifySuccess('Tarea Actualizad@', res.data.message);

    navigateTo('/tareas');

  } catch (e) {

    notifyError('Error', e.message);

  }

}

function submitForm() {
  if (formRef.value) {
    formRef.value.submit();
  }
}

const obtenerPrioridades = async () => {

  try {
    let res = await cliente.get('api/tarea-prioridades');
    return res.data;

  } catch (e) {
    notifyError('Error', e.message);
  }

}

const obtenerRecordatorios = async () => {

  try {
    let res = await cliente.get('api/tarea-tiempo-recordatorios');
    return res.data;

  } catch (e) {
    notifyError('Error', e.message);
  }

}

const obtenerTipos = async () => {

  try {
    let res = await cliente.get('api/tarea-tipos');
    return res.data;

  } catch (e) {
    notifyError('Error', e.message);
  }

}

const prioridades = ref([]);
const tipos = ref([]);
const recordatorios = ref([]);

const valoresInputFormulario1 = ref([
  {
    "label": "Nombre",
    "type": "text",
    "key": "nombre"
  },
  {
    "label": "Descripcion",
    "type": "text",
    "key": "descripcion"
  },
  {
    "label": "Fecha Ejecucion",
    "type": "text",
    "key": "fecha_ejecucion"
  },
  {
    "label": "Hora Ejecucion",
    "type": "text",
    "key": "hora_ejecucion"
  },
  {
    "label": "Prioridad",
    "type": "select",
    "key": "prioridad_id"
  },
  {
    "label": "Tipo",
    "type": "select",
    "key": "tipo_id"
  },
  {
    "label": "Recordatorio",
    "type": "select",
    "key": "recordatorio_id"
  }
]);

// const obtenerOpciones = async () => {
//
//   try {
//     let res = await cliente.get('api/direcciones');
//     return res.data;
//
//   } catch (e) {
//     notifyError('Error', e.message);
//   }
//
// }
//
// const opciones = ref([]);
//
onMounted(async () => {
  prioridades.value = await obtenerPrioridades();
  tipos.value = await obtenerTipos();
  recordatorios.value = await obtenerRecordatorios();
});

const active = useState('activeItem');
active.value = 'Tarea';
</script>

<template>
  <mi-card borderColor="#e74c3c">
    <template #header>

    </template>

    <UForm :schema="schema"
           :state="state"
           class="space-y-4"
           @submit="onSubmit"
           ref="formRef"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <template v-for=" (field, index) in valoresInputFormulario1"
                  :key="index">

          <div>

            <div class="flex flex-col space-y-2">
              <UFormGroup
                  :label="field.label + ':'"
                  :name="field.key"
              >


                <UInput v-if="field.type == 'text' || field.type == 'number' || field.type == 'date'"
                        v-model="state[field.key]"
                        :type="field.type"
                />

                <UCheckbox v-if="field.type == 'checkbox'"
                           v-model="state[field.key]"
                           name="notifications"
                />

                <multiselect
                    v-if="field.type == 'select' && field.key == 'prioridad_id'"
                    v-model="state[field.key]"
                    :options="prioridades"
                    label="nombre"
                    placeholder="Seleccione uno..."
                >
                </multiselect>

                <multiselect
                    v-if="field.type == 'select' && field.key == 'tipo_id'"
                    v-model="state[field.key]"
                    :options="tipos"
                    label="nombre"
                    placeholder="Seleccione uno..."
                />

                <multiselect
                    v-if="field.type == 'select' && field.key == 'recordatorio_id'"
                    v-model="state[field.key]"
                    :options="recordatorios"
                    label="nombre"
                    placeholder="Seleccione uno..."
                />

              </UFormGroup>
            </div>


          </div>

        </template>
      </div>


    </UForm>

    <template #footer>
      <div>
        <UButton type="button"
                 color="red"
                 icon="i-heroicons-arrow-left-end-on-rectangle"
                 variant="solid"
                 label="Regresar"
                 @click="navigateTo('/tareas')"
                 class="mr-1"
        />
        <UButton type="button"
                 label="Guardar"
                 @click="submitForm"
                 icon="i-heroicons-bookmark-square"
        />
      </div>
    </template>


  </mi-card>
</template>

<style scoped></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
