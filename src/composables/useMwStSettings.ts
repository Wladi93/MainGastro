import { ref } from "vue";

const mwStOn = ref<boolean>(false);
const mwStRate = ref<number>(19);

export function useMwStSettings() {
  const updateMwStSettings = (enabled: boolean, rate: number) => {
    mwStOn.value = enabled;
    mwStRate.value = rate;
  };

  return {
    mwStOn,
    mwStRate,
    updateMwStSettings,
  };
}
