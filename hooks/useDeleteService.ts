import { deleteServiceRecord } from '@/utils/storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for deleting a service record
 * Automatically invalidates the cache after successful deletion
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteServiceRecord(id),
    onSuccess: () => {
      // Invalidate and refetch service records
      queryClient.invalidateQueries({ queryKey: ['serviceRecords'] });
    },
  });
};
