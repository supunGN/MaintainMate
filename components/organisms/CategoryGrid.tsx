import CategoryCard from '@/components/molecules/CategoryCard';
import { Spacing } from '@/constants/Spacing';
import React from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';

export interface Category {
  id: string;
  label: string;
  image: ImageSourcePropType;
}

interface CategoryGridProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

export default function CategoryGrid({ categories, selectedCategoryId, onSelectCategory }: CategoryGridProps) {
  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <View key={category.id} style={styles.gridItem}>
          <CategoryCard
            image={category.image}
            label={category.label}
            isSelected={selectedCategoryId === category.id}
            onPress={() => onSelectCategory(category.id)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.screenHorizontal,
    marginHorizontal: -Spacing.sm, // Negative margin to offset item margins
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
});
