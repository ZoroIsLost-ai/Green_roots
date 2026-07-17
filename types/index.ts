export type Hierarchy = {
  [vibhag: string]: {
    [zilla: string]: string[];
  };
};

export type ResponseRecord = {
  id: string;
  created_at: string;
  vibhag: string;
  zilla: string;
  nagar: string;
  sanyojak_name: string;
  sanyojak_phone: string;
  sanyojak_location: string;
  sah_sanyojak_name: string;
  sah_sanyojak_phone: string;
  sah_sanyojak_location: string;
};

export type SubmitPayload = {
  vibhag: string;
  zilla: string;
  nagar: string;
  sanyojak_name: string;
  sanyojak_phone: string;
  sanyojak_location: string;
  sah_sanyojak_name: string;
  sah_sanyojak_phone: string;
  sah_sanyojak_location: string;
};
