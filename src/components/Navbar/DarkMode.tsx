import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

export default function DarkModeToggle() {
    const router = useRouter()
  const [darkMode, setDarkMode] = useState(typeof window !=="undefined" && localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if(typeof window !== "undefined"){
      if (darkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => {
        setDarkMode(!darkMode)
         router.refresh()
    }
    }
      className=" rounded-full p-2"
    >
      {darkMode ? <MdDarkMode/>: <MdOutlineDarkMode/>}
    </button>
  );
}
