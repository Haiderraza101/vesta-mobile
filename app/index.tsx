import { Redirect } from "expo-router";

export default function Index() {
  // Always start at login for this static frontend
  return <Redirect href="/(auth)/login" />;
}
