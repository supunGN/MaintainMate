import { ServiceRecord, updateServiceRecord } from '@/utils/storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Custom hook for updating an existing service record
 * Automatically invalidates the cache after successful update
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedFields }: { id: string; updatedFields: Partial<ServiceRecord> }) =>
      updateServiceRecord(id, updatedFields),
    onSuccess: () => {
      // Invalidate and refetch service records
      queryClient.invalidateQueries({ queryKey: ['serviceRecords'] });
    },
  });
};
