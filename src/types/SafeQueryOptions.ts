import { UseQueryOptions } from "@tanstack/react-query";

export type SafeQueryOptions = Omit<UseQueryOptions, 'queryKey' | 'queryFn'>

export type SafeQueryOptionsTyped<T, TError = unknown, TData = T> = Omit<UseQueryOptions<T, TError, TData>, "queryKey" | "queryFn">

// Simplified version that defaults TError to Error and TData to T
export type SafeQueryOptionsFor<T> = Omit<UseQueryOptions<T, Error, T>, "queryKey" | "queryFn">