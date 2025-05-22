// Import Firebase SDK modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
  import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyASp595xhwD3gYSm_CfzivBe5hE0MtnA_o",
    authDomain: "livest-real-estate.firebaseapp.com",
    databaseURL: "https://livest-real-estate-default-rtdb.firebaseio.com",
    projectId: "livest-real-estate",
    storageBucket: "livest-real-estate.firebasestorage.app",
    messagingSenderId: "647434805745",
    appId: "1:647434805745:web:610c262a9968a1a6ac2450"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase();

  // DOM elements
  const loggedCheck = document.getElementById('loggedCheck');
  const accountlog = document.querySelector('.accountlog');
  const div = document.createElement('div');
  div.id = "dropDownBox";

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User signed in
      const [first] = user.displayName ? user.displayName.split(' ') : ["User"];
      const userRef = ref(database, `users/${user.uid}`);

      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        const userPhotograph = data?.profilePicture || "https://via.placeholder.com/50"; // fallback image
        
        // Hide login/signup links
        accountlog.style.display = "none";

        // Show user photo dropdown
        loggedCheck.innerHTML = `
          <div style="position: relative; width: 50px; height: 50px; border-radius: 10px;">
            <div id="dropDownParent" style="width: 100%; cursor: pointer; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
              <img width="100%" height="100%" style="border-radius: 10px; object-fit: cover;" src='${userPhotograph}'>
              <i style="position: absolute; border-radius: 50%; bottom: 0; right: 0; padding: 3px; font-size: 1em; background-color: grey; color: white;" class="fa-solid fa-angle-down"></i>
            </div>
          </div>
        `;

        // Setup dropdown content
        div.innerHTML = `
          <div class="shadow py-2" style="width: 200px; position: absolute; border-radius: 4px; top: 75px; right: 0; background: white;">
            <p class="py-3 px-4">Hello <strong>${first}</strong></p>
            <button onclick="location.href='./client/clientdashboard.html'" class="py-3 px-4 w-100" style="text-align: left; border: none; outline: none; background-color: transparent; color: black;">Dashboard</button>
            <p id="logOutUser" class="py-3 px-4" style="cursor: pointer;">Log out</p>
          </div>
        `;
        loggedCheck.appendChild(div);
        div.classList.add('indexDropdown');
        div.style.display = "none";

        // Toggle dropdown visibility on user photo click
        loggedCheck.addEventListener('click', () => {
          div.style.display = div.style.display === 'block' ? 'none' : 'block';
        });

        // Hide dropdown if clicked outside
        document.addEventListener('click', (e) => {
          if (!loggedCheck.contains(e.target) && !div.contains(e.target)) {
            div.style.display = 'none';
          }
        });

        // Logout button handler
        document.getElementById('logOutUser').addEventListener('click', () => {
          signOut(auth).then(() => {
            // Refresh page to update UI after logout
            location.reload();
          }).catch((error) => {
            console.error("Logout error:", error);
          });
        });
      });
    } else {
      // No user signed in - show login/signup links
      accountlog.style.display = "flex"; // show the login/signup links
      loggedCheck.innerHTML = '';
      if (div.parentElement) {
        div.parentElement.removeChild(div);
      }
    }
  });

  // Add classes to login/signup buttons for styling (optional)
  if (accountlog.firstElementChild) accountlog.firstElementChild.classList.add('login');
  if (accountlog.lastElementChild) accountlog.lastElementChild.classList.add('sign');

  // Hamburger menu toggle
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const accountIcon = document.getElementById('accountIcon');
  const closeIcon = document.getElementById('closeIcon');
  const closeIcon2 = document.getElementById('closeIcon2');
  const centerSide = document.querySelector('.center-side');
  const rightSide = document.querySelector('.right-side');

  hamburgerIcon.addEventListener('click', () => {
    centerSide.classList.toggle('showMenu');
  });

  closeIcon.addEventListener('click', (e) => {
    e.preventDefault();
    centerSide.classList.remove('showMenu');
  });

  accountIcon.addEventListener('click', () => {
    rightSide.classList.add('showAccout');
  });

  closeIcon2.addEventListener('click', (e) => {
    e.preventDefault();
    rightSide.classList.remove('showAccout');
  });

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (centerSide.classList.contains('showMenu') && !centerSide.contains(e.target) && !hamburgerIcon.contains(e.target)) {
      centerSide.classList.remove('showMenu');
    }
    if (rightSide.classList.contains('showAccout') && !rightSide.contains(e.target) && !accountIcon.contains(e.target)) {
      rightSide.classList.remove('showAccout');
    }
  });