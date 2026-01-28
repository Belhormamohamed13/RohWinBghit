import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { apiClient } from "./axios";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

export function axiosBaseQuery(
  { baseUrl }: { baseUrl?: string } = { baseUrl: "" }
): BaseQueryFn<AxiosBaseQueryArgs, unknown, { status?: number; data?: unknown }> {
  return async ({ url, method = "GET", data, params, headers }) => {
    try {
      const result = await apiClient.request({
        url: `${baseUrl ?? ""}${url}`,
        method,
        data,
        params,
        headers
      });

      // Normalize to { data, meta, error }
      const payload = result.data;
      const normalized =
        payload && typeof payload === "object" && "data" in payload
          ? {
              data: payload.data,
              meta: "meta" in payload ? payload.meta : null,
              error: payload.success === false && payload.error ? payload.error : null
            }
          : { data: payload, meta: null, error: null };

      return { data: normalized };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message
        }
      };
    }
  };
}

