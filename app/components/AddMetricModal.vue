<script setup lang="ts">
import { ref, reactive } from "vue";
import { useBodyMetrics } from "~/composables/useBodyMetrics";
import * as z from 'zod';
import { UForm } from "#components";
import type { FormSubmitEvent } from "@nuxt/ui";
const emit = defineEmits<{ close: [boolean] }>();

const { addMetric } = useBodyMetrics(); // use your composable
const submitting = ref(false);
const form = useTemplateRef('form')
const toast = useToast();
const onSubmit = async (event: FormSubmitEvent<MetricSchema>) => {
  console.log('Submitting and clicked')
  submitting.value = true;
  console.log(event.data)
  try {
    // Call your composable to insert metric
    await addMetric(event.data);
    toast.add({ title: 'Success', description: 'Body metrics have been added.', color: 'success'})
    emit("close", true); // signal success
  } catch (err: any) {
    console.error("Error saving metric:", err.message || err);
  } finally {
    submitting.value = false;
  }
};

type MetricKey = keyof MetricSchema;

type MetricField = {
  label: string;
  name: string;
  required: boolean;
  key: MetricKey;
  type: string;

}

const metricFields = ref<MetricField[]>([
  { label: "Recorded At", name: "recorded_at", required: true, key: 'recorded_at', type: "date" },
  { label: "Weight (kg)", name: "weight_kg", required: true, key: 'weight_kg', type: "number" },
  { label: "Body Fat %", name: "body_fat_percent", required: true, key: "body_fat_percent", type: "number" },
  { label: "Visceral Fat", name: "visceral_fat", required: true, key: "visceral_fat", type: "number" },
  { label: "Bone Mass (kg)", name: "bone_mass_kg", required: true, key: "bone_mass_kg", type: "number" },
  { label: "Basal Metabolic Rate", name: "basal_metabolic_rate", required: true, key: "basal_metabolic_rate", type: "number" },
  { label: "Metabolic Age", name: "metabolic_age", required: true, key: "metabolic_age", type: "number" },
  { label: "Muscle Mass (kg)", name: "muscle_mass_kg", required: true, key: "muscle_mass_kg", type: "number" },
  { label: "Physique Rating", name: "physique_rating", required: true, key: "physique_rating", type: "number" },
  { label: "Body Water %", name: "body_water_percent", required: true, key: "body_water_percent", type: "number" },
  // { label: "BMI", name: "bmi", required: false, model: localMetric.bmi, type: "number" },
])

const metricSchema = z.object({
  recorded_at: z.iso.date(),
  weight_kg: z.number('Weight is required').min(0, 'Weight must be more than 0 kg').max(1000, 'Weight must be less than 1000 kg'),
  body_fat_percent: z.number('Body Fat is required').min(0, 'Body Fat must be more than 0%').max(100, 'Body Fat must be less than 100%'),
  visceral_fat: z.number('Visceral Fat is required').min(0, 'Visceral Fat must be more than 0').max(100, 'Visceral Fat must be less than 100'),
  bone_mass_kg: z.number('Bone Mass is required').min(0,'Bone Mass must be more than 0 kg'),
  basal_metabolic_rate: z.number('Basal Metablic Rate is required').min(0, 'Basal Metabolic Rate must be more than 0 kcal'),
  metabolic_age: z.number('Metabolic Age is required').min(0, 'Metabolic Age must be more than 0'),
  muscle_mass_kg: z.number('Muscle Mass is required').min(0,'Muscle Mass must be more than 0 kg'),
  physique_rating: z.number('Physique rating is required').min(1, 'Physique Rating must be more than 1').max(9, 'Physique Rating must be less than 9'),
  body_water_percent: z.number('Body Water is required').min(0, 'Body Water must be more than 0%').max(100, 'Body Water must be less than 100%'),
})

type MetricSchema = z.output<typeof metricSchema>;

const metricState = reactive<Partial<MetricSchema>>({
  recorded_at: new Date().toISOString().slice(0,10),
  weight_kg: undefined,
  body_fat_percent: undefined,
  visceral_fat: undefined,
  bone_mass_kg: undefined,
  basal_metabolic_rate: undefined,
  metabolic_age: undefined,
  muscle_mass_kg: undefined,
  physique_rating: undefined,
  body_water_percent: undefined
})
</script>

<template>
  <UModal :title="'Add Body Metric'">
    <template #body>
      <div class="space-y-4 p-4">
        <UForm ref="form" :schema="metricSchema" :state="metricState" @submit="onSubmit" id="add-metric-form" :validate-on="['change']">
          <div v-for="field in metricFields">
            <UFormField :label="field.label" :name="field.name" :required="field.required">
              <template v-if="field.key === 'visceral_fat'">
                  <UInputNumber v-model="metricState[field.key]" :step="0.5" :format-options="{
                    minimumFractionDigits: 1
                  }" />
              </template>
              <template v-else>
                <UInput v-model="metricState[field.key]" :type="field.type" @change="(e)=> { console.log(e)}"/>
                </template>
            </UFormField>
          </div>
        </UForm>
        </div>
      </template>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="outline" @click="emit('close', false)" :disabled="submitting">Cancel</UButton>
          <UButton color="primary" :loading="submitting" @click="form?.submit()">Save</UButton>
        </div>
      </template>
  </UModal>
</template>
