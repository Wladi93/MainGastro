import { ref, type Ref } from "vue";
import api from "src/boot/axios";
import type { Inhalt } from "../components/InhaltTypes";

const inhalt: Ref<Inhalt[]> = ref([]);

export function useInhalt() {
  const loadInhalt = async () => {
    try {
      const response = await api.get("api/inhalt/");
      inhalt.value = response.data;
    } catch (error) {
      console.error("Fehler beim Laden der Inhalte", error);
    }
  };

  return {
    inhalt,
    loadInhalt,
  };
}
