type TStrapiError = {
  status: number;
  name: string;
  message: string;
  details?: Record<string, string[]>;
};

interface IStrapiErrorsProps {
  error?: TStrapiError | null;
}

export function StrapiErrors({ error }: IStrapiErrorsProps) {
  if (!error?.message) return null;
  return <div className="text-pink-500 text-md italic py-2">{error.message}</div>;
}