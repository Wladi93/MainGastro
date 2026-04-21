export interface Zeitraum {
  id?: number;
  von: string;
  bis: string;
}

export interface Oeffnungszeiten {
  id: number;
  tag: string;
  zeitraeume: Zeitraum[];
}