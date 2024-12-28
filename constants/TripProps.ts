import { Province } from "./Provinces";

export type TripProps = {
  id: string;
  leadUserId?: string;
  title: string;
  avatar: string;
  startDate: string;
  endDate: string;
  provinceStart: Province;
  provinceEnd: Province;
  joinStatus?: number;
  applyStatus?: boolean;
};