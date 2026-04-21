type Meta = {
  errorMessage?: string;
  successMessage?: string;
};

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: Meta;
    mutationMeta: Record<string, unknown>;
  }
}

export {};
