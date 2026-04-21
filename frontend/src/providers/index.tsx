"use client";

import MaterialUiProvider from "@/providers/mui";
import TanstackQueryProvider from "@/providers/tanstack-query";
import MuiXDateProvider from "@/providers/mui-x-date";
import NotistackProvider from "@/providers/notistack";
import { ErrorBoundary } from "react-error-boundary";
import GlobalError from "@/components/error/GlobalError";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { configureEcho } from "@laravel/echo-react";
import { echoOptions } from "@/lib/echo";

configureEcho(echoOptions);
dayjs.extend(utc);
dayjs.extend(timezone);

const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ErrorBoundary FallbackComponent={GlobalError}>
      <TanstackQueryProvider>
        <MaterialUiProvider>
          <MuiXDateProvider>
            <NotistackProvider>{children}</NotistackProvider>
          </MuiXDateProvider>
        </MaterialUiProvider>
      </TanstackQueryProvider>
    </ErrorBoundary>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export default AppProvider;
