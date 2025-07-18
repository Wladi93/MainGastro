import { boot } from "quasar/wrappers";
import { setCssVar } from "quasar";
import api from "./axios";

const colorMappings = {
  1: "primary",
  2: "secondary",
  3: "info",
};

export default boot(async () => {
  try {
    const colorPromises = [1, 2, 3].map((id) =>
      api.get(`api/color/${id}`).catch((error) => {
        console.error(`Fehler beim Laden der Farbe ${id}:`, error);
        return null;
      })
    );

    const results = await Promise.all(colorPromises);

    results.forEach((res, index) => {
      const colorId = index + 1;
      if (res?.data?.color) {
        const cssVarName = colorMappings[colorId as keyof typeof colorMappings];
        setCssVar(cssVarName, res.data.color);
      }
    });
  } catch (error) {
    console.error("Fehler beim Laden der Farben beim Boot:", error);
  }
});
