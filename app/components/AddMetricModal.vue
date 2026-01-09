<script setup lang="ts">
import type { BodyMetricInsert } from "~/types/bodyMetric";
import { ref, reactive, toRaw } from "vue";
import { useBodyMetrics } from "~/composables/useBodyMetrics";

const props = defineProps<{ metric: BodyMetricInsert }>();
const emit = defineEmits<{ close: [boolean] }>();

const { addMetric } = useBodyMetrics(); // use your composable
const submitting = ref(false);

const localMetric = reactive({ ...props.metric });

const submit = async () => {
  submitting.value = true;
  try {
    // Call your composable to insert metric
    await addMetric({
      weight_kg: localMetric.weight_kg,
      bmi: localMetric.bmi,
      body_fat_percent: localMetric.body_fat_percent,
      body_water_percent: localMetric.body_water_percent,
      muscle_mass_kg: localMetric.muscle_mass_kg,
      bone_mass_kg: localMetric.bone_mass_kg,
      visceral_fat: localMetric.visceral_fat,
      basal_metabolic_rate: localMetric.basal_metabolic_rate,
      metabolic_age: localMetric.metabolic_age,
      recorded_at: localMetric.recorded_at
    });
    emit("close", true); // signal success
  } catch (err: any) {
    console.error("Error saving metric:", err.message || err);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <UModal :title="'Add Body Metric'">
    <template #body>
      <div class="space-y-4 p-4">
        <UFormField label="Weight (kg)" name="weight" required>
          <UInput v-model.number="localMetric.weight_kg" type="number" />
        </UFormField>

        <UFormField label="BMI" name="bmi">
          <UInput v-model.number="localMetric.bmi" type="number" />
        </UFormField>

        <UFormField label="Body Fat %" name="body_fat_percent">
          <UInput v-model.number="localMetric.body_fat_percent" type="number" />
        </UFormField>

        <UFormField label="Body Water %" name="body_water_percent">
          <UInput v-model.number="localMetric.body_water_percent" type="number" />
        </UFormField>

        <UFormField label="Muscle Mass (kg)" name="muscle_mass_kg">
          <UInput v-model.number="localMetric.muscle_mass_kg" type="number" />
        </UFormField>

        <UFormField label="Bone Mass (kg)" name="bone_mass_kg">
          <UInput v-model.number="localMetric.bone_mass_kg" type="number" />
        </UFormField>

        <UFormField label="Visceral Fat" name="visceral_fat">
          <UInput v-model.number="localMetric.visceral_fat" type="number" />
        </UFormField>

        <UFormField label="Basal Metabolic Rate" name="basal_metabolic_rate">
          <UInput v-model.number="localMetric.basal_metabolic_rate" type="number" />
        </UFormField>

        <UFormField label="Metabolic Age" name="metabolic_age">
          <UInput v-model.number="localMetric.metabolic_age" type="number" />
        </UFormField>

        <UFormField label="Recorded At" name="recorded_at">
          <UInput v-model="localMetric.recorded_at" type="date" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="emit('close', false)" :disabled="submitting">Cancel</UButton>
        <UButton color="primary" @click="submit" :loading="submitting">Save</UButton>
      </div>
    </template>
  </UModal>
</template>
