/** lucataco/remove-bg (pinned version) */
const REMOVE_BG_VERSION =
  "95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1"

export async function removeBackgroundFromImageUrl(
  imageUrl: string
): Promise<string> {
  const token = process.env.REPLICATE_TOKEN
  if (!token) throw new Error("REPLICATE_TOKEN is missing from the environment")

  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      version: REMOVE_BG_VERSION,
      input: { image: imageUrl },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Replicate (${res.status}): ${text.slice(0, 280)}`)
  }

  const prediction = (await res.json()) as {
    status: string
    error?: string
    output?: unknown
  }

  if (prediction.status === "failed") {
    throw new Error(prediction.error ?? "Background removal failed")
  }

  const out = prediction.output
  if (typeof out !== "string") {
    throw new Error("Unexpected output from Replicate")
  }

  return out
}
