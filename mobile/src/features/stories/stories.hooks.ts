import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "../../core/api/client";
import { Story } from "../../types/story";
import { LOCAL_STORIES } from "../../core/data/localStories";

interface StoriesResponse {
  stories: Story[];
  totalPages: number;
  page: number;
}

// Hook: Fetch a single story detail
export const useStory = (id: number) => {
  return useQuery<Story>({
    queryKey: ["story", id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/stories/${id}`);
        return response.data;
      } catch (error) {
        console.warn("[StoriesHooks] API error, falling back to LOCAL_STORIES:", error);
        const local = LOCAL_STORIES.find((s) => s.id === id);
        if (local) return local;
        throw error;
      }
    },
    staleTime: 0, // Freshly query the backend to load full database pages instead of stale local copies
    initialData: () => {
      // Pre-populate with local data instantly on boot
      return LOCAL_STORIES.find((s) => s.id === id);
    }
  });
};

// Hook: Fetch infinite paginated lists of stories
export const useStoriesList = (limit = 10) => {
  return useInfiniteQuery<StoriesResponse>({
    queryKey: ["stories"],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await apiClient.get(`/stories`, {
          params: { page: pageParam, limit },
        });
        
        const data = response.data;
        if (Array.isArray(data)) {
          return {
            stories: data,
            totalPages: 1,
            page: 1,
          };
        }
        return data;
      } catch (error) {
        console.warn("[StoriesHooks] API list error, falling back to LOCAL_STORIES:", error);
        return {
          stories: LOCAL_STORIES,
          totalPages: 1,
          page: 1,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    initialData: () => {
      // Instantly load the catalog offline
      return {
        pages: [
          {
            stories: LOCAL_STORIES,
            totalPages: 1,
            page: 1,
          }
        ],
        pageParams: [1]
      };
    }
  });
};
