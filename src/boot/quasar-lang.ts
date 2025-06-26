import { boot } from "quasar/wrappers";
import langDe from "quasar/lang/de";
import { Lang } from "quasar";

export default boot(() => {
  const myLang = {
    ...langDe,
    table: {
      ...langDe.table,
      rowsPerPageAll: "alle",
    },
  };

  Lang.set(myLang);
});
