import { saveServiceRecord, ServiceRecord } from '@/utils/storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for adding a new service record
 * Automatically invalidates the cache after successful addition
 */
export const useAddService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (record: Omit<ServiceRecord, 'id' | 'createdAt'>) => 
      saveServiceRecord(record),
    onSuccess: () => {
      // Invalidate and refetch service records
      queryClient.invalidateQueries({ queryKey: ['serviceRecords'] });
    },
  });
};
