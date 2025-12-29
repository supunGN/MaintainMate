import ActiveFilterChip from '@/components/atoms/ActiveFilterChip';
import FilterChip from '@/components/atoms/FilterChip';
import { Spacing } from '@/constants/Spacing';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export interface FilterOption {
  id: string;
  label: string;
  isActive?: boolean;
}

export interface ActiveFilter {
  id: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: FilterOption[];
  onFilterPress: (filterId: string) => void;
  activeFilters?: ActiveFilter[];
  onRemoveFilter?: (filterId: string) => void;
}

export default function FilterBar({
  filters,
  onFilterPress,
  activeFilters = [],
  onRemoveFilter,
}: FilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {/* Filter toggle chips */}
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          label={filter.label}
          onPress={() => onFilterPress(filter.id)}
          onRemove={filter.isActive ? () => onRemoveFilter?.(filter.id) : undefined}
          isActive={filter.isActive}
        />
      ))}
      
      {/* Active filter chips with X icon */}
      {activeFilters.map((activeFilter) => (
        <ActiveFilterChip
          key={activeFilter.id}
          label={activeFilter.value}
          onRemove={() => onRemoveFilter?.(activeFilter.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.sm,
  },
});
