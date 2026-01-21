import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-gifted-charts";

export default function ReportsScreen() {
  const [monthOpen, setMonthOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("April 2024");
  const [selectedItem] = useState("All Items");

  const generateMonthYears = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const years = [2023, 2024, 2025];
    return years.flatMap(year => months.map(month => `${month} ${year}`));
  };

  const monthYearList = generateMonthYears();

  // Pie chart data
  const pieChartDataRaw = [
    { value: 7200, label: "Toyota Corolla", color: "#2F7D5A", extra: "31,391" },
    { value: 4300, label: "Yamaha FZ", color: "#66BB6A", extra: "19,391" },
    { value: 2000, label: "Washing Machine", color: "#A5D6A7", extra: "12,291" },
  ];

  const total = pieChartDataRaw.reduce((sum, item) => sum + item.value, 0);

  // Add percentage text on slices
  const pieChartData = pieChartDataRaw.map(item => ({
    ...item,
    text: `${((item.value / total) * 100).toFixed(1)}%`,
  }));

  // Bar chart data
  const barData = [
    { value: 4000, label: "Jan", frontColor: "#E0E0E0" },
    { value: 5200, label: "Feb", frontColor: "#E0E0E0" },
    { value: 5800, label: "Mar", frontColor: "#E0E0E0" },
    { value: 13500, label: "Apr", frontColor: "#2F7D5A" },
    { value: 3000, label: "May", frontColor: "#E0E0E0" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Expense Reports</Text>
          <Pressable onPress={() => setSearchOpen(true)} hitSlop={10}>
            <Ionicons name="search" size={24} color="#333" />
          </Pressable>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <Pressable style={styles.filter} onPress={() => setMonthOpen(true)}>
            <Text style={styles.filterText}>{selectedMonth} ⌄</Text>
          </Pressable>
          <Pressable style={styles.filter} onPress={() => setItemOpen(true)}>
            <Text style={styles.filterText}>{selectedItem} ⌄</Text>
          </Pressable>
        </View>

        {/* Total Maintenance Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Maintenance Cost</Text>
          <Text style={styles.amount}>Rs. {total.toLocaleString()}</Text>

          <View style={styles.pieContainer}>
            <PieChart
              data={pieChartData}
              donut
              radius={70}
              innerRadius={42}
              showText
              textColor="#fff"
              textSize={12}
              textBackgroundRadius={14}
            />
            <View style={styles.legend}>
              {pieChartDataRaw.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <Text style={styles.legendTitle}>
                    {item.label} ₹{item.value.toLocaleString()}
                  </Text>
                  <Text style={styles.legendValue}>
                    Rs. {((item.value / total) * 100).toFixed(1)}% {item.extra}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Monthly Expenses */}
        <View style={styles.card}>
          <View style={styles.expenseHeader}>
            <Text style={styles.cardTitle}>Monthly Maintenance Expenses</Text>
            <Text style={styles.totalValue}>Rs. {total.toLocaleString()}</Text>
          </View>

          <View style={styles.barChartWrapper}>
            <View style={styles.yAxisLabels}>
              <Text style={styles.yLabel}>15,000</Text>
              <Text style={styles.yLabel}>10,000</Text>
              <Text style={styles.yLabel}>5,000</Text>
              <Text style={styles.yLabel}>0</Text>
            </View>

            <BarChart
              data={barData}
              barWidth={34}
              spacing={20}
              roundedTop
              hideRules
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
              noOfSections={3}
              maxValue={15000}
              isAnimated
            />
          </View>
        </View>
      </ScrollView>

      {/* Month Dropdown */}
      <Modal transparent visible={monthOpen} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setMonthOpen(false)}>
          <View style={[styles.dropdown, { marginTop: 140 }]}>
            <ScrollView style={{ maxHeight: 340 }}>
              {monthYearList.map((monthYear) => (
                <Pressable
                  key={monthYear}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedMonth(monthYear);
                    setMonthOpen(false);
                  }}
                >
                  <Text style={monthYear === selectedMonth ? styles.activeDropdownText : null}>
                    {monthYear}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Item Dropdown */}
      <Modal transparent visible={itemOpen} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setItemOpen(false)}>
          <View style={[styles.dropdown, { marginTop: 140 }]}>
            {["All Items", "Vehicle", "Appliances", "Others"].map((item) => (
              <Pressable
                key={item}
                style={styles.dropdownItem}
                onPress={() => setItemOpen(false)}
              >
                <Text>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Search Modal */}
      <Modal transparent visible={searchOpen} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setSearchOpen(false)}>
          <View style={styles.searchModal}>
            <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
            <Text style={styles.searchPlaceholder}>Search expenses...</Text>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },
  filters: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  filter: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  amount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
    marginBottom: 20,
  },
  pieContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legend: {
    flex: 1,
    flexShrink: 1,
    marginLeft: 16,
  },
  legendItem: {
    marginBottom: 8,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  legendValue: {
    fontSize: 13,
    color: "#666",
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2F7D5A",
  },
  barChartWrapper: {
    flexDirection: "row",
    height: 200,
    alignItems: "flex-end",
  },
  yAxisLabels: {
    width: 60,
    height: 180,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 12,
  },
  yLabel: {
    fontSize: 12,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  activeDropdownText: {
    color: "#2F7D5A",
    fontWeight: "600",
  },
  searchModal: {
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: "#999",
    flex: 1,
  },
});
