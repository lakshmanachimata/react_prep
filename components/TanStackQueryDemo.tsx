"use client";

import { memo, useMemo, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { addFruit, fetchFruits, type Fruit } from "@/lib/mock/demoApi";

const FRUITS_QUERY_KEY = ["fruits"] as const;

function FruitsQueryPanel() {
  const [simulateError, setSimulateError] = useState(false);
  const {
    data,
    status,
    error,
    isFetching,
    dataUpdatedAt,
    refetch,
  } = useQuery({
    queryKey: FRUITS_QUERY_KEY,
    queryFn: () => fetchFruits({ fail: simulateError }),
  });
  const { count: renders } = useRenderDebug("FruitsQueryPanel", {
    status,
    count: data?.length ?? 0,
    isFetching,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="FruitsQueryPanel" count={renders} />
      <h3>1. useQuery — fetch mock fruits</h3>
      <p>
        TanStack Query caches by <code>queryKey</code>, tracks loading/error, and
        dedupes concurrent requests.
      </p>
      <label className="effect-demo-toggle">
        <input
          type="checkbox"
          checked={simulateError}
          onChange={(event) => setSimulateError(event.target.checked)}
        />
        Simulate error on next fetch
      </label>
      <div className="effect-demo-controls">
        <button type="button" onClick={() => refetch()}>
          {isFetching ? "Refetching..." : "Refetch"}
        </button>
      </div>
      <p>
        status: <strong>{status}</strong>
        {dataUpdatedAt > 0 && (
          <>
            , updated: <strong>{new Date(dataUpdatedAt).toLocaleTimeString()}</strong>
          </>
        )}
      </p>
      {status === "pending" && <p className="state-demo-note">Loading fruits...</p>}
      {error instanceof Error && (
        <p className="drill-pass-through">Error: {error.message}</p>
      )}
      <FruitList fruits={data ?? []} />
    </div>
  );
}

function FruitList({ fruits }: { fruits: Fruit[] }) {
  const { count: renders } = useRenderDebug("FruitList", { count: fruits.length });

  return (
    <>
      <RenderDebugBadge name="FruitList" count={renders} />
      <ul className="prop-user-list">
        {fruits.map((fruit) => (
          <li key={fruit.id}>{fruit.name}</li>
        ))}
      </ul>
    </>
  );
}

function AddFruitMutationPanel() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const mutation = useMutation({
    mutationFn: addFruit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRUITS_QUERY_KEY });
      setName("");
    },
  });
  const { count: renders } = useRenderDebug("AddFruitMutationPanel", {
    status: mutation.status,
    name,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="AddFruitMutationPanel" count={renders} />
      <h3>2. useMutation + invalidateQueries</h3>
      <p>
        After adding a fruit, <code>invalidateQueries</code> marks the query stale
        and triggers a background refetch.
      </p>
      <form
        className="prop-user-form"
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(name);
        }}
      >
        <label>
          New fruit
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Mango"
          />
        </label>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add fruit"}
        </button>
      </form>
      {mutation.isError && mutation.error instanceof Error && (
        <p className="drill-pass-through">Error: {mutation.error.message}</p>
      )}
      {mutation.isSuccess && (
        <p className="state-demo-note">Added — list refetched via invalidation.</p>
      )}
    </div>
  );
}

function TanStackQueryDemoTree() {
  const { count: renders } = useRenderDebug("TanStackQueryDemoTree");

  return (
    <>
      <RenderDebugBadge name="TanStackQueryDemoTree" count={renders} />
      <FruitsQueryPanel />
      <AddFruitMutationPanel />
    </>
  );
}

function TanStackQueryDemo() {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      }),
    [],
  );
  const { count: renders } = useRenderDebug("TanStackQueryDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="TanStackQueryDemo" count={renders} />
      <h2>TanStack Query playground</h2>
      <p className="drill-description">
        Server-state library: caching, background refetch, loading/error flags, and
        mutations that invalidate related queries. Mock API delays simulate network.
      </p>

      <div className="state-demo-panel">
        <h3>Patterns in this demo</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>useQuery</strong> — fetch + cache by <code>queryKey</code>
          </li>
          <li>
            <strong>status / isFetching</strong> — loading vs background refetch
          </li>
          <li>
            <strong>refetch()</strong> — manual reload
          </li>
          <li>
            <strong>useMutation</strong> — POST-style mock add
          </li>
          <li>
            <strong>invalidateQueries</strong> — refetch list after mutation
          </li>
        </ul>
        <p className="state-demo-note">
          Contrast with Redux Thunk demo: Query owns server cache; Redux owns client
          app state you put in the store.
        </p>
      </div>

      <QueryClientProvider client={queryClient}>
        <TanStackQueryDemoTree />
      </QueryClientProvider>
    </section>
  );
}

export default memo(TanStackQueryDemo);
