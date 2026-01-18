import SearchInput from '@/components/atoms/SearchInput';
import FilterBar, { ActiveFilter, FilterOption } from '@/components/molecules/FilterBar';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { ListFilter } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchFilterHeaderProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  onFilterPress?: (filterId: string) => void;
  activeFilters?: ActiveFilter[];
  onRemoveFilter?: (filterId: string) => void;
  showFiltersInitially?: boolean;
}

export default function SearchFilterHeader({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onFilterPress,
  activeFilters = [],
  onRemoveFilter,
  showFiltersInitially = false,
}: SearchFilterHeaderProps) {
  const [showFilters, setShowFilters] = useState(showFiltersInitially);

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  return (
    <View style={styles.container}>
      {/* Top Row: Search Bar + Filter Toggle Button */}
      <View style={styles.topRow}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <SearchInput
            placeholder={searchPlaceholder}
            value={searchValue}
            onChangeText={onSearchChange}
          />
        </View>

        {/* Filter Toggle Button */}
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={handleFilterToggle}
          activeOpacity={0.7}
        >
          <ListFilter
            size={22}
            color={showFilters ? Colors.primary.main : Colors.neutral.gray600}
          />
        </TouchableOpacity>
      </View>

      {/* Bottom Row: Filter Bar (Conditionally Rendered) */}
      {showFilters && filters.length > 0 && (
        <FilterBar
          filters={filters}
          onFilterPress={onFilterPress || (() => {})}
          activeFilters={activeFilters}
          onRemoveFilter={onRemoveFilter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.default,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
  },
  filterButton: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Spacing.borderRadius.lg,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary.main + '20', // 20% opacity
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
});
