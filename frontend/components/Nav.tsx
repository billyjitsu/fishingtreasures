import { ConnectButton } from "@rainbow-me/rainbowkit";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => {
    const listener = () => {
      if (window.scrollY > 180) {
        setAnimateHeader(true);
      } else {
        setAnimateHeader(false);
      }
    };
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, [animateHeader]);

  //OG Nav bar
  //<nav className="flex bg-transparent  py-3 px-1 justify-between w-full items-center  fixed top-0 z-50 "> {/* absolute or fixed*/}

  //was used before
  // <nav
  //     className={`flex bg-black pt-10 pb-10 px-1 w-full justify-between items-center fixed top-0 z-50 duration-500 ease-in-out ${
  //       animateHeader &&
  //       " backdrop-filter backdrop-blur-lg bg-black/25 trasition shadow-xl "
  //     }`}
  //   ></nav>

  return (
    <nav className="flex bg-transparent  py-3 px-1 justify-between w-full items-center  fixed top-0 z-50  "> {/* absolute or fixed*/}
      <div className="container px-1 mx-auto flex flex-wrap items-center justify-between ">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          {/* Logo - Title */}

          <Link legacyBehavior href="/">
            <a className="text-xl font-bold text-blue-500 inline-block whitespace-nowrap uppercase">
              Fishing Treasures
            </a>
          </Link>

          {/*  Hamburger Menu  */}
          <button
            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <FontAwesomeIcon
              icon={faBars}
              width="24px"
              className="text-blue-500 "
            />
          </button>
        </div>

        <div
          className={ 
            "lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none " +
            (navbarOpen ? " block rounded shadow-lg" : " hidden")
          }
          id="nav-drop"
        >
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
            {/* <li className="flex items-center">
              <a
                className="py-2 text-sm uppercase px-6 font-bold leading-snug text-gray-800 lg:text-base lg:text-white hover:opacity-75 lg:px-3"
                href="#claim"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <i className=" leading-lg opacity-75"></i>
                <span>Claim</span>
              </a>
            </li> */}
            {/* <li className="flex items-center">
              <Link legacyBehavior href= "/admin">
              <a
  
                className="py-2 text-sm uppercase px-6 font-bold leading-snug text-gray-800 lg:text-base lg:text-blue-500 hover:opacity-75 lg:px-3"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <i className=" leading-lg  opacity-75"></i>
                <span>Admin</span>
              </a>
              </Link>
            </li> */}
            <li className="flex items-center">
              <a
                className="py-2 text-sm uppercase px-6 font-bold leading-snug text-gray-800 lg:text-base lg:text-blue-500 hover:opacity-75 lg:px-3"
                href="https://mumbai.polygonscan.com/address/0x99658894056D116D3FC4E0b7CF996e480520fC50"
                target="_blank"
                rel="noreferrer"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <i className=" leading-lg  opacity-75"></i>
                <span>Contract</span>
              </a>
            </li>

            <li className="py-2 flex items-center mb-3 px-3 lg:mb-0 lg:px-0 lg:ml-2">
              <ConnectButton showBalance={false} />
              {/*    <ConnectButton label="Sign in" showBalance={false} chainStatus="none" /> */}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
