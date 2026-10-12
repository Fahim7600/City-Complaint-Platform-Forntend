import type { User } from "./user";

export interface Review {
  id: string;
  complaintId: string;
  citizenId: string;
  technicianId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  citizen?: User;
  technician?: User;
}

export interface CreateReviewInput {
  rating: number;
  comment?: string;
}

export interface TechnicianRating {
  technicianId: string;
  averageRating: number;
  reviewCount: number;
}
