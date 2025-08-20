export type Firmenname = {
  id: number;
  firmenName: string;
  strasse: string;
  ort: string;
  hausnummer: number;
  plz: number;
  email: string;
  telefonnummer: string;
  geschaeftsführerName: string;
  instagram: string | null;
  facebook: string | null;
  ustIdNr?: string;
  lieferando: string | null;
};
