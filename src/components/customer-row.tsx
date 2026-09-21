import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CustomerRowProps = {
  name: string;
  balance: number;
  lastPaid: string;
  onPress: () => void;
};

export function CustomerRow({
  name,
  balance,
  lastPaid,
  onPress,
}: CustomerRowProps) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View
        style={{
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderColor: "#ddd",
        }}
      >
        <Text style={{ fontSize: 18 }}>{name}</Text>
        <Text>₱ {balance.toFixed(2)}</Text>
      </View>
      {expanded && <Text>Last paid {lastPaid}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
  },
});
