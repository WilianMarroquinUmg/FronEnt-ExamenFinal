<script setup lang="ts">
import MiCard from '~/components/personalized/MiCard.vue';
import {object, string, InferType} from 'yup';
import {ref, reactive, onMounted} from 'vue';
import type {FormSubmitEvent} from '#ui/types';
import InputDate from "~/components/personalized/InputDate.vue";

const {notifySuccess, notifyError} = useToastNotifications();

const route = useRoute();
const id = route.params.id;

const schema = object({ nombre: string().required("Este campo es requerido"),
valor: string().required("Este campo es requerido") })

const state = reactive({ nombre: undefined,
valor: undefined });

const formRef = ref();

let cliente = useSanctumRequest();

const getItem = async () => {

  try {

    let res = await cliente.get(`api/tarea-tiempo-recordatorios/${id}`);

    let objetKeys = Object.keys(state);

    objetKeys.forEach(key => {

      if (key && !isNaN(Date.parse(key))) {
        const date = new Date(key);

        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        state[key] = formattedDate;

      }else {

        state[key] = res.data[key];

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

    let res = await cliente.put(`api/tarea-tiempo-recordatorios/${id}`, state);

    notifySuccess('TareaTiempoRecordatorio Actualizad@', res.data.message);

    navigateTo('/tareatiemporecordatorios');

  } catch (e) {

    notifyError('Error', e.message);

  }

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
    "label": "Valor",
    "type": "text",
    "key": "valor"
  }
] );

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
// onMounted(async () => {
//   opciones.value = await obtenerOpciones();
// });

const active = useState('activeItem');
active.value = 'TareaTiempoRecordatorio';
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

          <div >

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

<!--                agregar aca todos los selectores de forma manual -->

<!--                <USelect v-if="field.type == 'select'"-->
<!--                         v-model="state[field.key]"-->
<!--                         :options="opciones"-->
<!--                         option-attribute="nombre"-->
<!--                         placeholder="Seleccione una opción"-->
<!--                         value-attribute="id"-->
<!--                />-->

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
                 @click="navigateTo('/tareatiemporecordatorios')"
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
