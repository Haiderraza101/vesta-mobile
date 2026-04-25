import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Smartphone } from "lucide-react-native";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-6 pt-8">
        <View className="flex-row items-center gap-3 mb-8">
          <Smartphone size={32} color="#007AFF" />
          <View>
            <Text variant="h1" weight="bold">Vesta</Text>
            <Text variant="caption" className="text-muted-foreground">React Native + Firebase</Text>
          </View>
        </View>

        <Card className="mb-6">
          <Text variant="h3" weight="semibold" className="mb-2">Welcome Home</Text>
          <Text variant="body" className="text-muted-foreground mb-4">
            This project is pre-configured with a production-grade structure and reusable components.
          </Text>
          <Button label="Get Started" onPress={() => console.log("Pressed")} />
        </Card>

        <View className="gap-6 mb-12">
          <Text variant="h3" weight="semibold">Sample UI Components</Text>
          
          <Input 
            label="Email Address" 
            placeholder="Enter your email" 
            keyboardType="email-address"
          />

          <View className="flex-row gap-3">
            <Button 
              label="Secondary" 
              variant="secondary" 
              className="flex-1"
            />
            <Button 
              label="Destructive" 
              variant="destructive" 
              className="flex-1"
            />
          </View>

          <Button 
            label="Outline Button" 
            variant="outline" 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
