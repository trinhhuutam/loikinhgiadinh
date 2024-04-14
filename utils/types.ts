/* eslint-disable no-unused-vars */
export interface ImageProps {
  id: number;
  height: string;
  width: string;
  public_id: string;
  format: string;
  blurDataUrl?: string;
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}
export interface Section {
  id: number;
  title: string;
  page: number[];
  url: string[];
  public_id: string[];
  asset_ids: string[];
  data?: DataItem[];
  chap?: Chap[];
}

export interface DataItem extends ImageProps {
  asset_id: string;
  public_id: string;
  folder: string;
  filename: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  uploaded_at: string;
  bytes: number;
  backup_bytes: number;
  aspect_ratio: number;
  pixels: number;
  url: string;
  secure_url: string;
  status: string;
  access_mode: string;
  access_control: any;
  etag: string;
  created_by: {
    access_key: string;
  };
  uploaded_by: {
    access_key: string;
  };
}

export interface Chap {
  id_number: number;
  title: string;
  page: number[];
  url: string[];
  public_id: string[];
  asset_ids: string[];
  data?: DataItem[];
  id: number;
}

export interface JsonData {
  product: string;
  version: number;
  releaseDate: string;
  demo: boolean;
  section: Section[];
}