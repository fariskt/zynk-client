import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";

export default function DarkModeToggle() {
    const router = useRouter()
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => {
        setDarkMode(!darkMode)
         router.refresh()
    }
    }
      className="p-2 rounded-lg"
    >
      {darkMode ? <MdDarkMode/>: <MdOutlineDarkMode/>}
    </button>
  );
}
