export interface BestellMail {
  id: string;
  email: string;
  password: string;
  smtp: string;
  port: number;
  rechnungOn: boolean;
  rechnungSendenOn: boolean;
  abholenOn: boolean;
  liefernOn: boolean;
  mwStOn: boolean;
  mwSt: number;
}

export interface BestellMailResponse {
  id: string;
  email: string;
  smtp: string;
  port: number;
  rechnungOn: boolean;
  rechnungSendenOn: boolean;
  liefernOn: boolean;
  abholenOn: boolean;
  mwStOn: boolean;
  mwSt: number;
}
