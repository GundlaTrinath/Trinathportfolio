import React from "react";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { AiOutlineArrowUp } from "react-icons/ai";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { Link } from "react-scroll";
function App() {
  return (
    <div>
      <Navbar />
      <Home />
      <About />
      <Skills />
      <Contact />
      <div class="animate-bounce bg-white rounded-full p-2 text-3xl fixed bottom-0 right-0 w-fit m-5 cursor-pointer">
        <Link to="home" smooth={true} duration={500}><AiOutlineArrowUp /></Link>
      </div>
    </div>
  );
}

export default App;
