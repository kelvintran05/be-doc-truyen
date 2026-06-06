import { API_URL } from "@/lib/constants";
import { decryptPayload } from "@/lib/crypto";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) throw new ApiError(`HTTP error ${res.status}`, res.status);
  const data = await res.json();
  return decryptPayload<T>(data.payload);
}

export const api = {
  stories: {
    all: () => request<import("@/lib/types").Story[]>("/stories"),
    byId: (id: number) => request<import("@/lib/types").Story>(`/stories/${id}`),
  },
  courses: {
    all: () => request<import("@/lib/types").Course[]>("/courses"),
    bySlug: (slug: string) => request<import("@/lib/types").Course>(`/courses/slug/${slug}`),
    lesson: (id: number) => request<import("@/lib/types").Lesson>(`/courses/lessons/${id}`),
  },
};
