import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setAuth, logout } from "../features/auth/authSlice";
import { Mutex } from "async-mutex";
// import { ServicebaseQuery } from './MapapiSlice';
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
  credentials: "include",
});

const baseQueryUpload = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_UPLOAD_HOST}/api`,
  credentials: "include",
});

const selectBaseQuery = (args: string | FetchArgs) => {
  const url = typeof args === "string" ? args : args.url;
  return url.startsWith("/control-escolar/materiales")
    ? baseQueryUpload
    : baseQuery;
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await selectBaseQuery(args)(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: "/auth/refresh/", method: "POST" },
          api,
          extraOptions
        );
        if (refreshResult.data) {
          api.dispatch(setAuth());
          result = await selectBaseQuery(args)(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    }
  } else {
    await mutex.waitForUnlock();
    // result = await baseQuery(args, api, extraOptions)
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
