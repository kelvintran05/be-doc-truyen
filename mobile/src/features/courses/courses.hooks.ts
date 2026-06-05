import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../core/api/client";
import { Course, Lesson } from "../../types/course";

// Hook: Fetch all courses
export const useCoursesList = () => {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await apiClient.get("/courses");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

// Hook: Fetch a single course detail by slug
export const useCourseDetail = (slug: string) => {
  return useQuery<Course>({
    queryKey: ["course", slug],
    queryFn: async () => {
      const response = await apiClient.get(`/courses/${slug}`);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });
};

// Hook: Fetch a single lesson detail by id
export const useLessonDetail = (id: number) => {
  return useQuery<Lesson>({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const response = await apiClient.get(`/courses/lessons/${id}`);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });
};
