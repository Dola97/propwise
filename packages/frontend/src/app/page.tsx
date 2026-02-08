import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { CustomerTable } from "@/components/features/customers/customer-table";
import { CustomerEventsListener } from "@/components/features/customers/customer-events-listener";
import { InternalBanner } from "@/components/layout/internal-banner";
import { customerKeys } from "@/app/hooks/query-keys";

const DEFAULT_PARAMS = {
    page: 1,
    limit: 10,
    sortBy: "created_at" as const,
    sortOrder: "DESC" as const,
};

export default async function HomePage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: customerKeys.list(DEFAULT_PARAMS, false),
        queryFn: async () => {
            const url = new URL(`${process.env.API_URL}/customers`);

            url.searchParams.set("page", "1");
            url.searchParams.set("limit", "10");
            url.searchParams.set("sortBy", "created_at");
            url.searchParams.set("sortOrder", "DESC");

            const res = await fetch(url.toString(), { cache: "no-store" });

            if (!res.ok) {
                return {
                    data: [],
                    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
                };
            }
            return res.json();
        },
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <InternalBanner />
                <CustomerEventsListener />
                <main className="mx-auto max-w-7xl px-6 py-8">
                    <CustomerTable />
                </main>
            </div>
        </HydrationBoundary>
    );
}
