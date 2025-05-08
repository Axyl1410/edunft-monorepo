import Loading from "@workspace/ui/components/loading";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Loading text="Please wait..." />
    </div>
  );
}
