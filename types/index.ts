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
  name: string;
  phone: string;
  location: string;
};

export type SubmitPayload = {
  vibhag: string;
  zilla: string;
  nagar: string;
  name: string;
  phone: string;
  location: string;
};
