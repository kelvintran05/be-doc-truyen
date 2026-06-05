import { Redirect } from "expo-router";

export default function Index() {
  // Direct entry point redirects to tabs, layout handles auth state check
  return <Redirect href="/(tabs)" />;
}
