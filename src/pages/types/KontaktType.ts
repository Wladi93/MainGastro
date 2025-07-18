export interface KontaktMail {
  id: string;
  email: string;
  password: string;
  smtp: string;
  port: number;
}

export interface KontaktMailResponse {
  id: string;
  email: string;
  smtp: string;
  port: number;
}
