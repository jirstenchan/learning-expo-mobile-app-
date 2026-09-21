export function problemFor(e: unknown) {
  if (e instanceof Error && e.message === "timeout")
    return "The server took too long. Try again";
  if (e instanceof TypeError)
    return "No connection. Check your Wi-fi and try again";
  if (e instanceof Error && e.message === "404")
    return "That list is not there anymore";
  return "Something went wrong";
}

export type Status = "loading" | "empty" | "error" | "content";
