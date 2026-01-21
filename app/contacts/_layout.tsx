import { Stack } from "expo-router";
import React from "react";

export default function ContactsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="addContact" />
      <Stack.Screen name="contactBook" />
    </Stack>
  );
}
