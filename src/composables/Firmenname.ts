import { ref, type Ref } from "vue";
import api from "src/boot/axios";
import type { Firmenname } from "src/pages/types/SettingsFirmenNameType";
import { Notify } from "quasar";

const firmenName: Ref<Firmenname[]> = ref([]);

export function useFirmenName() {
  const loadFirmenName = async () => {
    try {
      const response = await api.get("api/firmenname/");
      firmenName.value = response.data;
      if (firmenName.value.length > 0) {
        document.title = firmenName.value[0]!.firmenName;
      }
    } catch (error) {
      console.error("Fehler beim Laden des Namens", error);
    }
  };

  const updateFirmenName = async (firma: Firmenname) => {
    try {
      await api.put(`/api/firmenname/${firma.id}`, firma);

      const index = firmenName.value.findIndex((f) => f.id === firma.id);
      if (index !== -1) {
        firmenName.value[index] = { ...firma };
      }

      document.title = firma.firmenName;
      Notify.create({
        message: "Daten erflogreich gespeichert...",
        color: "positive",
        position: "top",
        icon: "check",
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Anschrift", error);
      Notify.create({
        message: "Fehler beim Speichern der Daten!",
        color: "negative",
        position: "top",
        icon: "clear",
      });
    }
  };

  return {
    firmenName,
    loadFirmenName,
    updateFirmenName,
  };
}
