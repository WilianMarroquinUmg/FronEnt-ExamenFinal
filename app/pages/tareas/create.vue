<script lang="ts" setup>
import {reactive, ref, toRefs} from 'vue';
import { object, string, InferType } from 'yup';
import type { FormSubmitEvent } from '#ui/types';
import MiCard from "~/components/personalized/MiCard.vue";
import InputDate from "~/components/personalized/InputDate.vue";
const {notifySuccess, notifyError} = useToastNotifications();
import multiselect from 'vue-multiselect';

const schema = object({ nombre: string().required("Este campo es requerido"),
descripcion: string().required("Este campo es requerido"),
fecha_ejecucion: string().required("Este campo es requerido"),
hora_ejecucion: string().required("Este campo es requerido"),
prioridad_id: object().required("Este campo es requerido"),
tipo_id: object().required("Este campo es requerido"),
recordatorio_id: object().required("Este campo es requerido") }) ;

const state = reactive( { nombre: undefined,
descripcion: undefined,
fecha_ejecucion: undefined,
hora_ejecucion: undefined,
prioridad_id: undefined,
tipo_id: undefined,
recordatorio_id: undefined }  );

const cliente = useSanctumRequest();

const formRef = ref();
const onSubmit = async (event: FormSubmitEvent<InferType<typeof schema>>) => {

  try {

    state.prioridad_id = state.prioridad_id.id;
    state.tipo_id = state.tipo_id.id;
    state.recordatorio_id = state.recordatorio_id.id;

    let res = await cliente.post('api/tareas', state);

    notifySuccess('Tarea Cread@', res.data.message);

    navigateTo('/tareas');

  } catch (e) {

    notifyError('Error', e.message);

  }

};

const formatearCampoLabel = (str) => {

  return str
      .split('_')
      .filter(word => word.toLowerCase() !== 'id')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

}

function submitForm() {
  if (formRef.value) {
    formRef.value.submit();
  }
}

const valoresInputFormulario1 = ref( [
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
    "type": "date",
    "key": "fecha_ejecucion"
  },
  {
    "label": "Hora Ejecucion",
    "type": "time",
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
] );

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

onMounted(async () => {
  prioridades.value = await obtenerPrioridades();
  tipos.value = await obtenerTipos();
  recordatorios.value = await obtenerRecordatorios();
});


const active = useState('activeItem');
active.value = 'Tarea';

</script>

<template>
  <mi-card>
    <UForm :schema="schema"
           :state="state"
           class="space-y-4"
           @submit="onSubmit"
           ref="formRef"
    >

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <template v-for=" (field, index) in valoresInputFormulario1"
                  :key="index"
        >

          <div class="flex flex-col space-y-2">

            <UFormGroup
                :label="field.label + ':'"
                :name="field.key"
            >

              <UInput v-if="field.type == 'text' || field.type == 'number' || field.type == 'date' || field.type == 'time'"
                      v-model="state[field.key]"
                      :type="field.type"
              />

              <UCheckbox v-if="field.type == 'checkbox'"
                         v-model="state[field.key]"
                         name="notifications"
              />


<!--              ingresar de forma manual cuando sea selector-->

<!--              <USelect v-if="field.type == 'select'"-->
<!--                       v-model="state[field.key]"-->
<!--                       :options="opciones"-->
<!--                       option-attribute="nombre"-->
<!--                       placeholder="Seleccione una opción"-->
<!--                       value-attribute="id"-->
<!--              />-->


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

        </template>
      </div>



    </UForm>

    <template #footer>
      <div>
        <UButton type="button"
                 color="red"
                 variant="solid"
                 label="Regresar"
                 icon="i-heroicons-arrow-left-end-on-rectangle"
                 @click="navigateTo('/tareas')"
                 class="mr-1"
        />
        <UButton type="button"
                 label="Guardar"
                 icon="i-heroicons-bookmark-square"
                 @click="submitForm"
        />
      </div>
    </template>

  </mi-card>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
