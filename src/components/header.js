import React, { useState, useEffect } from 'react';
// import { Link, globalHistory, useLocation } from '@reach/router';
// import { createConnection } from 'mongoose';

export default Header;
function Header() {
  // const { activeSession, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  // useEffect(() => {
  //   return globalHistory.listen((action) => {
  //     setMenuOpen(false);
  //   });
  // }, []);

  return (
    <header>
      <div className="header-grid">
        {/* Title & Mobile Menu Button */}
        <div>
          {/* <button
            className="btn button-unstyled menu-button"
            onClick={() => {
              setMenuOpen(!menuOpen);
            }}
          >
            Menu
          </button> */}

          <span className="header-title">
            <a href="/">DK Charts</a>
          </span>
        </div>

        {/* Desktop Layout */}
        {/* <div className="desktop-menu">
          <DesktopNavList />
        </div> */}

        {/* Mobile Layout */}
        {/* <div className="mobile-menu">{menuOpen ? <MobileNavList /> : null}</div> */}
      </div>
    </header>
  );
}

// function DesktopNavList({ activeSession, userType, subdomainActive }) {
//   // console.log((activeSession, userType));
//   return (
//     <nav className="desktop-grid">
//       <ul className="nav-list">
//         <li>
//           <NavLink to="/charts">Weekly Charts</NavLink>
//         </li>

//         <li>
//           <NavLink to="/position/qb">QB</NavLink>
//         </li>

//         <li>
//           <NavLink to="/position/rb">RB</NavLink>
//         </li>

//         <li>
//           <NavLink to="/position/wr">WR</NavLink>
//         </li>

//         <li>
//           <NavLink to="/position/te">TE</NavLink>
//         </li>
//         <li>
//           <NavLink to="/position/dst">DST</NavLink>
//         </li>
//       </ul>

//       {/* Right Aligned */}
//       <div>
//         <ul className="nav-list">
//           <li>
//             <NavLink to="/custom">Custom List</NavLink>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }

// function MobileNavList({ activeSession, userType, subdomainActive }) {
//   // console.log((activeSession, userType));
//   return (
//     <nav>
//       <ul className="nav-list">
//         <li>
//           <NavLink to="/charts">Weekly Charts</NavLink>
//         </li>
//       </ul>

//       <ul className="nav-list">
//         <li>
//           <NavLink to="/position/qb">QB</NavLink>
//         </li>
//         <li>
//           <NavLink to="/position/rb">RB</NavLink>
//         </li>

//         <li>
//           <NavLink to="/position/wr">WR</NavLink>
//         </li>

//         <li>
//           <NavLink to="/position/te">TE</NavLink>
//         </li>

//         <li>
//           <NavLink to="/position/dst">DST</NavLink>
//         </li>
//       </ul>

//       <span>
//         <NavLink to="/custom">Custom List</NavLink>
//       </span>
//     </nav>
//   );
// }

// const NavLink = (props) => (
//   <Link
//     {...props}
//     getProps={({ isCurrent }) => {
//       return {
//         className: isCurrent ? 'nav-link active' : 'nav-link',
//       };
//     }}
//   />
// );
