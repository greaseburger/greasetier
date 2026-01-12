import Link from "next/link";

const TierlistLink = ({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      className="rounded bg-blue-950 px-3 py-1 hover:bg-blue-900"
      href={path}
    >
      {children}
    </Link>
  );
};

export default function Home() {
  return (
    <div className="mt-12 flex h-dvh flex-col items-center gap-5">
      <h1 className="text-5xl">Welcome to Greasetier</h1>
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl">Create your own tierlist</h2>
        <div className="flex flex-row gap-3">
          <TierlistLink path="/tier">Manga</TierlistLink>
          <TierlistLink path="/">Movies (not finished)</TierlistLink>
        </div>
      </div>
    </div>
  );
}
