import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <h1>Welcome to home</h1>
      <button className="bg-sky-400 p-2 " onClick={()=>router.push('/register')}>Register</button>
    </main>
  );
}
