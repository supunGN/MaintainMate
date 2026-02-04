import EmptyState from "@/components/atoms/EmptyState";
import PageHeader from "@/components/molecules/PageHeader";
import CategoryFilterModal from "@/components/organisms/CategoryFilterModal";
import DateFilterModal, { DateFilterType } from "@/components/organisms/DateFilterModal";
import SearchFilterHeader from "@/components/organisms/SearchFilterHeader";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useServiceRecords } from "@/hooks/useServiceRecords";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CATEGORY_LABELS: Record<string, string> = {
  home_appliances: "Home Appliances",
  vehicles: "Vehicles",
  entertainment: "Entertainment",
  computing: "Computing",
  security: "Security & Smart",
  other: "Other",
};

const DATE_LABELS: Record<string, string> = {
  last30: "Last 30 Days",
  last90: "Last 90 Days",
  thisYear: "This Year",
};

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const { data: services = [] } = useServiceRecords();

  const [search, setSearch] = useState("");

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null);

  // Dynamic filters based on selection
  const filters = useMemo(() => [
    {
      id: "category",
      label: selectedCategories.length > 0
        ? CATEGORY_LABELS[selectedCategories[0]]
        : "Category",
      isActive: selectedCategories.length > 0
    },
    {
      id: "byDate",
      label: dateFilter
        ? DATE_LABELS[dateFilter]
        : "by Date",
      isActive: !!dateFilter
    },
  ], [selectedCategories, dateFilter]);

  // Parse date from service record format (MM - DD - YYYY)
  const parseDate = useCallback((dateStr: string) => {
    const [month, day, year] = dateStr.split(' - ').map(Number);
    return new Date(year, month - 1, day);
  }, []);

  // Filter services based on search, category, and date
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.itemName.toLowerCase().includes(search.toLowerCase()) ||
          item.repairType.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    // Date filter
    if (dateFilter) {
      const now = new Date();
      filtered = filtered.filter((item) => {
        const itemDate = parseDate(item.date);

        switch (dateFilter) {
          case "last30":
            return itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          case "last90":
            return itemDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          case "thisYear":
            return itemDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [services, search, selectedCategories, dateFilter, parseDate]);

  // Calculate total cost
  const totalCost = useMemo(() => {
    return filteredServices.reduce((sum, item) => sum + parseFloat(item.cost), 0);
  }, [filteredServices]);

  // Group by category for pie chart
  const categoryData = useMemo(() => {
    const grouped = filteredServices.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = { total: 0, count: 0 };
      }
      acc[category].total += parseFloat(item.cost);
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const colors = [
      Colors.chart.primary,
      Colors.chart.secondary,
      Colors.chart.tertiary,
      Colors.chart.quaternary,
      Colors.chart.quinary,
    ];

    return Object.entries(grouped)
      .map(([category, data], index) => ({
        value: data.total,
        label: category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        color: colors[index % colors.length],
        count: data.count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredServices]);

  // Pie chart data with percentages
  const pieChartData = useMemo(() => {
    if (totalCost === 0) return [];
    return categoryData.map(item => ({
      ...item,
      text: `${((item.value / totalCost) * 100).toFixed(1)}%`,
    }));
  }, [categoryData, totalCost]);

  // Group by month for bar chart
  const monthlyData = useMemo(() => {
    const grouped = filteredServices.reduce((acc, item) => {
      const date = parseDate(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += parseFloat(item.cost);
      return acc;
    }, {} as Record<string, number>);

    const sortedMonths = Object.keys(grouped).sort();
    const last5Months = sortedMonths.slice(-5);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return last5Months.map((monthKey, index) => {
      const [year, month] = monthKey.split('-');
      const monthIndex = parseInt(month) - 1;
      const isCurrentMonth = index === last5Months.length - 1;

      return {
        value: grouped[monthKey],
        label: monthNames[monthIndex],
        frontColor: isCurrentMonth ? Colors.primary.main : Colors.neutral.gray300,
      };
    });
  }, [filteredServices, parseDate]);

  // Expense breakdown list
  const expenseBreakdown = useMemo(() => {
    return filteredServices.map(item => ({
      id: item.id,
      itemName: item.itemName,
      category: item.category,
      date: item.date,
      cost: parseFloat(item.cost),
    })).sort((a, b) => b.cost - a.cost);
  }, [filteredServices]);

  const handleFilterPress = useCallback((filterId: string) => {
    if (filterId === "category") {
      setCategoryModalVisible(true);
    } else if (filterId === "byDate") {
      setDateModalVisible(true);
    }
  }, []);

  const handleRemoveFilter = useCallback((id: string) => {
    if (id === "category") {
      setSelectedCategories([]);
    } else if (id === "byDate") {
      setDateFilter(null);
    }
  }, []);

  const handleCategoryApply = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
    setCategoryModalVisible(false);
  }, []);

  const handleDateApply = useCallback((filter: DateFilterType) => {
    setDateFilter(filter);
    setDateModalVisible(false);
  }, []);

  const handleDateClear = useCallback(() => {
    setDateFilter(null);
    setDateModalVisible(false);
  }, []);

  const handleCloseCategoryModal = useCallback(() => {
    setCategoryModalVisible(false);
  }, []);

  const handleCloseDateModal = useCallback(() => {
    setDateModalVisible(false);
  }, []);

  const maxBarValue = useMemo(() => {
    if (monthlyData.length === 0) return 15000;
    const max = Math.max(...monthlyData.map(d => d.value));
    return Math.ceil(max / 5000) * 5000;
  }, [monthlyData]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <PageHeader title="Expense Reports" />

        {/* Search + Filters */}
        <SearchFilterHeader
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search expenses"
          filters={filters}
          onFilterPress={handleFilterPress}
          onRemoveFilter={handleRemoveFilter}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Maintenance Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Maintenance Cost</Text>
            <Text style={styles.amount}>Rs. {totalCost.toLocaleString()}</Text>

            {pieChartData.length > 0 ? (
              <View style={styles.pieContainer}>
                <PieChart
                  data={pieChartData}
                  donut
                  radius={70}
                  innerRadius={42}
                  showText
                  textColor={Colors.neutral.white}
                  textSize={12}
                  textBackgroundRadius={14}
                />
                <View style={styles.legend}>
                  {categoryData.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View style={styles.legendRow}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendTitle}>{item.label}</Text>
                      </View>
                      <Text style={styles.legendValue}>
                        Rs. {item.value.toLocaleString()} ({item.count} items)
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <EmptyState
                title="No data available"
                subtitle="Add maintenance records to see your expense reports"
              />
            )}
          </View>

          {/* Monthly Expenses */}
          {monthlyData.length > 0 && (
            <View style={styles.card}>
              <View style={styles.expenseHeader}>
                <Text style={styles.cardTitle}>Monthly Expenses</Text>
                <Text style={styles.totalValue}>Rs. {totalCost.toLocaleString()}</Text>
              </View>

              <View style={styles.barChartWrapper}>
                <View style={styles.yAxisLabels}>
                  <Text style={styles.yLabel}>{maxBarValue.toLocaleString()}</Text>
                  <Text style={styles.yLabel}>{(maxBarValue * 0.67).toFixed(0)}</Text>
                  <Text style={styles.yLabel}>{(maxBarValue * 0.33).toFixed(0)}</Text>
                  <Text style={styles.yLabel}>0</Text>
                </View>

                <BarChart
                  data={monthlyData}
                  barWidth={34}
                  spacing={20}
                  roundedTop
                  hideRules
                  hideYAxisText
                  yAxisThickness={0}
                  xAxisThickness={0}
                  noOfSections={3}
                  maxValue={maxBarValue}
                  isAnimated
                />
              </View>
            </View>
          )}

          {/* Expense Breakdown */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Expense Breakdown</Text>
            {expenseBreakdown.length > 0 ? (
              <View style={styles.breakdownList}>
                {expenseBreakdown.map((item) => (
                  <View key={item.id} style={styles.breakdownItem}>
                    <View style={styles.breakdownLeft}>
                      <Text style={styles.breakdownItemName}>{item.itemName}</Text>
                      <Text style={styles.breakdownDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.breakdownCost}>Rs. {item.cost.toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <EmptyState
                title="No expenses found"
                subtitle="Your maintenance costs will be listed here"
              />
            )}
          </View>
        </ScrollView>
      </View>

      {/* Category Filter Modal */}
      <CategoryFilterModal
        visible={categoryModalVisible}
        initialSelected={selectedCategories}
        onApply={handleCategoryApply}
        onClose={handleCloseCategoryModal}
      />

      {/* Date Filter Modal */}
      <DateFilterModal
        visible={dateModalVisible}
        selected={dateFilter}
        onApply={handleDateApply}
        onClear={handleDateClear}
        onClose={handleCloseDateModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  innerContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
  card: {
    backgroundColor: Colors.neutral.gray100,
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  amount: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.main,
    marginBottom: Spacing.lg,
  },
  pieContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  legend: {
    flex: 1,
    gap: Spacing.sm,
  },
  legendItem: {
    gap: 4,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendTitle: {
    fontSize: Typography.fontSize.caption,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  legendValue: {
    fontSize: Typography.fontSize.caption,
    color: Colors.text.secondary,
    marginLeft: 16,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  totalValue: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.main,
  },
  barChartWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  yAxisLabels: {
    justifyContent: "space-between",
    height: 180,
    marginRight: Spacing.sm,
  },
  yLabel: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  breakdownList: {
    gap: Spacing.sm,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  breakdownLeft: {
    flex: 1,
  },
  breakdownItemName: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  breakdownDate: {
    fontSize: Typography.fontSize.caption,
    color: Colors.text.secondary,
  },
  breakdownCost: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },

});
