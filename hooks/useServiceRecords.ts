import { getServiceRecords, ServiceRecord } from '@/utils/storage';
import { useQuery } from '@tanstack/react-query';

/**
 * Custom hook for fetching all service records using React Query
 * Provides automatic caching, background refetching, and loading states
 */
export const useServiceRecords = () => {
  return useQuery<ServiceRecord[], Error>({
    queryKey: ['serviceRecords'],
    queryFn: getServiceRecords,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};
