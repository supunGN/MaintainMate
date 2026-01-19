import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import PageHeading from "@/components/atoms/PageHeading";
import Text from "@/components/atoms/Text";
import ServiceHistoryCard from "@/components/molecules/ServiceHistoryCard";
import CategoryFilterModal from "@/components/organisms/CategoryFilterModal";
import DateFilterModal, {
  DateFilterType,
} from "@/components/organisms/DateFilterModal";
import SearchFilterHeader from "@/components/organisms/SearchFilterHeader";
import ServiceHistoryDetailsModal from "@/components/organisms/ServiceHistoryDetailsModal";

import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";

/* ---------------- TYPES ---------------- */
interface MaintenanceHistory {
  id: string;
  title: string;
  category: string;
  date: string;
  cost: number;
  provider?: string;
  notes?: string;
  image?: string; //optional image UR
}

/* ---------------- DEMO DATA ---------------- */
const HISTORY_DATA: MaintenanceHistory[] = [
  {
    id: "1",
    title: "AC Service",
    category: "home_appliances",
    date: "2025-01-10",
    cost: 4500,
    notes: "Replaced air filters and cleaned ducts.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpaDB6B4um3RGR3boVAeRsGwV9bOrhD1s25w&s",
  },
  {
    id: "2",
    title: "Bike Oil Change",
    category: "vehicles",
    date: "2024-12-22",
    cost: 2500,
    notes: "Used synthetic oil for better performance.",
  },
  {
    id: "3",
    title: "Laptop Cleaning",
    category: "computing",
    date: "2024-11-05",
    cost: 3000,
    notes: "Removed dust and optimized performance.",
  },
];

/* ---------------- FILTER TABS ---------------- */
const INITIAL_FILTERS = [
  { id: "all", label: "All", isActive: true },
  { id: "category", label: "Category", isActive: false },
  { id: "byDate", label: "by Date", isActive: false },
];

export default function HistoryScreen() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null);

  /* -------- DETAILS MODAL STATE -------- */
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MaintenanceHistory | null>(
    null,
  );

  /* ---------------- SEARCH ---------------- */
  let filteredHistory = HISTORY_DATA.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  /* ---------------- CATEGORY FILTER ---------------- */
  if (selectedCategories.length > 0) {
    filteredHistory = filteredHistory.filter((item) =>
      selectedCategories.includes(item.category),
    );
  }

  /* ---------------- DATE FILTER ---------------- */
  if (dateFilter) {
    const now = new Date();

    filteredHistory = filteredHistory.filter((item) => {
      const itemDate = new Date(item.date);

      switch (dateFilter) {
        case "last30":
          return itemDate >= new Date(now.setDate(now.getDate() - 30));

        case "last90":
          return itemDate >= new Date(now.setDate(now.getDate() - 90));

        case "thisMonth":
          return (
            itemDate.getMonth() === new Date().getMonth() &&
            itemDate.getFullYear() === new Date().getFullYear()
          );

        case "lastMonth":
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return (
            itemDate.getMonth() === lastMonth.getMonth() &&
            itemDate.getFullYear() === lastMonth.getFullYear()
          );

        case "last6Months":
          return itemDate >= new Date(new Date().setMonth(now.getMonth() - 6));

        case "thisYear":
          return itemDate.getFullYear() === new Date().getFullYear();

        default:
          return true;
      }
    });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <PageHeading title="History" />
      </View>

      {/* Search + Filters */}
      <SearchFilterHeader
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search for service"
        filters={filters}
        onFilterPress={(id) => {
          if (id === "category") {
            setCategoryModalVisible(true);
            return;
          }

          if (id === "byDate") {
            setDateModalVisible(true);
            return;
          }

          setFilters((prev) =>
            prev.map((f) => ({
              ...f,
              isActive: f.id === id,
            })),
          );

          if (id === "all") {
            setSelectedCategories([]);
            setDateFilter(null);
          }
        }}
      />

      {/* History List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <ServiceHistoryCard
            item={item}
            onPressMore={() => {
              setSelectedItem(item);
              setDetailsVisible(true);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>History is empty</Text>
          </View>
        }
      />

      {/* Category Modal */}
      <CategoryFilterModal
        visible={categoryModalVisible}
        initialSelected={selectedCategories}
        onApply={(categories) => {
          setSelectedCategories(categories);
          setFilters((prev) =>
            prev.map((f) => ({
              ...f,
              isActive: f.id === "category",
            })),
          );
        }}
        onClose={() => setCategoryModalVisible(false)}
      />

      {/* Date Modal */}
      <DateFilterModal
        visible={dateModalVisible}
        selected={dateFilter}
        onApply={(value) => {
          setDateFilter(value);
          setFilters((prev) =>
            prev.map((f) => ({
              ...f,
              isActive: f.id === "byDate",
            })),
          );
        }}
        onClear={() => {
          setDateFilter(null);
          setFilters((prev) =>
            prev.map((f) => ({
              ...f,
              isActive: f.id === "all",
            })),
          );
        }}
        onClose={() => setDateModalVisible(false)}
      />

      {/* DETAILS VIEW MODAL */}
      <ServiceHistoryDetailsModal
        visible={detailsVisible}
        item={selectedItem}
        onClose={() => setDetailsVisible(false)}
      />
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  header: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
    marginTop: Spacing.xxl,
    paddingBottom: Spacing.sm,
  },
  contentContainer: {
    padding: Spacing.screenHorizontal,
    paddingBottom: 120,
  },
  placeholder: {
    alignItems: "center",
    paddingVertical: 120,
  },
  placeholderText: {
    fontSize: Typography.fontSize.h2,
    fontWeight: "bold",
  },
});
