import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Category {
  id: string;
  label: string;
  image: ImageSourcePropType;
}

const CATEGORIES: Category[] = [
  {
    id: "home_appliances",
    label: "Home Appliances",
    image: require("@/assets/images/categories/cat_appliances.png"),
  },
  {
    id: "vehicles",
    label: "Vehicles",
    image: require("@/assets/images/categories/cat_vehicles.png"),
  },
  {
    id: "entertainment",
    label: "Entertainment",
    image: require("@/assets/images/categories/cat_entertainment.png"),
  },
  {
    id: "computing",
    label: "Computing",
    image: require("@/assets/images/categories/cat_computing.png"),
  },
  {
    id: "security",
    label: "Security & Smart",
    image: require("@/assets/images/categories/cat_security.png"),
  },
  {
    id: "other",
    label: "Other",
    image: require("@/assets/images/categories/cat_other.png"),
  },
];

interface CategoryFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedCategories: string[]) => void;
  initialSelected?: string[];
}

export default function CategoryFilterModal({
  visible,
  onClose,
  onApply,
  initialSelected = [],
}: CategoryFilterModalProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const isPresenting = useRef(false);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialSelected);

  // Sync visible prop with imperative API
  useEffect(() => {
    if (visible && !isPresenting.current) {
      bottomSheetModalRef.current?.present();
      isPresenting.current = true;
    } else if (!visible && isPresenting.current) {
      bottomSheetModalRef.current?.dismiss();
      isPresenting.current = false;
    }
  }, [visible]);

  // Update selected categories when initialSelected changes
  useEffect(() => {
    setSelectedCategories(initialSelected);
  }, [initialSelected]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleDismiss = useCallback(() => {
    isPresenting.current = false;
    setSelectedCategories(initialSelected);
    onClose();
  }, [onClose, initialSelected]);

  const handleCategoryToggle = (categoryId: string) => {
    // Single selection: if already selected, deselect; otherwise select only this one
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? [] : [categoryId]
    );
  };

  const handleClear = () => {
    setSelectedCategories([]);
  };

  const handleApply = () => {
    onApply(selectedCategories);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={['65%']}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.background}
    >
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Category</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            activeOpacity={0.7}
          >
            <X size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          <View style={styles.grid}>
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <View key={category.id} style={styles.categoryItem}>
                  <TouchableOpacity
                    style={[
                      styles.categoryItemInner,
                      isSelected && styles.categoryItemSelected,
                    ]}
                    onPress={() => handleCategoryToggle(category.id)}
                    activeOpacity={0.7}
                  >
                    <Image
                      source={category.image}
                      style={styles.categoryIcon}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        isSelected && styles.categoryLabelSelected,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.7}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: Colors.neutral.gray300,
    width: 40,
  },
  background: {
    backgroundColor: Colors.background.default,
  },
  contentContainer: {
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: Typography.fontSize.h3,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -Spacing.xs,
  },
  categoryItem: {
    width: "50%",
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
  },
  categoryItemInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.md,
  },
  categoryItemSelected: {
    backgroundColor: Colors.primary.main + "10",
    borderColor: Colors.primary.main,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    marginRight: Spacing.sm,
  },
  categoryLabel: {
    flex: 1,
    fontSize: Typography.fontSize.caption,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  categoryLabelSelected: {
    color: Colors.primary.main,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  clearButton: {
    flex: 1,
    height: Spacing.buttonHeight,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  applyButton: {
    flex: 2,
    height: Spacing.buttonHeight,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.semibold,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.white,
  },
});
