import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ShareBar from "@/components/share-bar";
import { Stat } from "@/components/stat";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Customer, fetchCustomers } from "@/data/customers";
import { problemFor, Status } from "@/data/problem";
import { summarise } from "@/data/summary";

export default function HomeScreen() {
  const [status, setStatus] = useState<Status>("loading");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [problem, setProblem] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    setStatus("loading");
    fetchCustomers()
      .then((rows) => {
        if (!live) return;
        setCustomers(rows);
        setStatus(rows.length === 0 ? "empty" : "content");
      })
      .catch((e) => {
        if (!live) return;
        setProblem(problemFor(e));
        setStatus("error");
      });
    return () => {
      live = false;
    };
  }, [attempt]);

  if (status === "loading")
    return (
      <ThemedView style={styles.middle}>
        <ActivityIndicator />
      </ThemedView>
    );
  if (status === "error")
    return (
      <ThemedView style={styles.middle}>
        <ThemedText>{problem}</ThemedText>
        <Button title="Try again" onPress={() => setAttempt(attempt + 1)} />
      </ThemedView>
    );
  if (status === "empty")
    return (
      <ThemedView style={styles.middle}>
        <ThemedText>No customers yet.</ThemedText>
      </ThemedView>
    );

  const summary = summarise(customers);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Customer Homepage</Text>
        <Text style={styles.title}>Chan proj week 3</Text>

        <View style={styles.card}>
          <View style={styles.statRow}>
            <Stat label="Total owed" value={`₱ ${summary.total.toFixed(2)}`} />
            <Stat
              label="Average owed"
              value={`₱ ${summary.average.toFixed(2)}`}
            />
          </View>
          <View style={styles.statRow}>
            <Stat
              label="Still owing"
              value={`${summary.owing} of ${summary.count}`}
            />
            <Stat label="Settled" value={String(summary.settled)} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Basta kana</Text>
          {summary.ranked.map((c) => (
            <ShareBar
              key={c.id}
              name={c.name}
              balance={c.balance}
              share={c.share}
            />
          ))}
        </View>

        <Link href="/customers" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>View Customers</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  //revisit later kapoy pag design rn piste
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 24,
    gap: 16,
  },

  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#888",
    textTransform: "uppercase",
  },

  title: {
    fontSize: 36,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#d6d6da",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },

  cardLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },

  button: {
    backgroundColor: "#3c87f7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  statRow: {
    flexDirection: "row",
    gap: 24,
  },
});
