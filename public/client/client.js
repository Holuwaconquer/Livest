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
  const database = getDatabase(app);

  // Utility function to handle logout
  const logOut = () => {
    signOut(auth)
      .then(() => {
        alert('Sign-out successful.');
        location.href = "../login.html";
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  // Auth state observer
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const currentUserName = document.getElementById('currentUserName');
      const verifiedUser = document.getElementById('verifiedUser');
      const userPassport = document.getElementById('userPassport');

      currentUserName.textContent = user.displayName || "User";
      verifiedUser.textContent = user.emailVerified ? 'Verified' : 'Not Verified';


      const userRef = ref(database, `users/${user.uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.profilePicture) {
          userPassport.src = data.profilePicture;
        } else {
          userPassport.src = ""; // 
        }
      });

      // Setup logout buttons
      document.getElementById('logOutUser').addEventListener('click', logOut);
      document.getElementById('logUserOut').addEventListener('click', logOut);

    } else {
      location.href = "../login.html";
    }
  });

  // Menu toggle and outside click handler
  document.addEventListener('DOMContentLoaded', () => {
    const revealMenuBtn = document.getElementById('revealMenuBtn');
    const sidenav = document.getElementById("sidenav");

    if (revealMenuBtn && sidenav) {
      revealMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sidenav.classList.toggle('revealMenu');
      });

      document.addEventListener('click', (e) => {
        if (!revealMenuBtn.contains(e.target) && !sidenav.contains(e.target)) {
          sidenav.classList.remove('revealMenu');
        }
      });
    }
  });



let toggleBtn = document.querySelector('.toggle-btn');
let sidenav = document.getElementById('sidenav');
let tooltips = document.querySelector('.tooltips');
let mainPage = document.getElementById('mainPage');
let showDrop = document.getElementById('showDrop');
let dropDown = document.getElementById('dropDown');

const tooltipLabels = [
  "Dashboard",
  "Property",
  "Order",
  "Message",
  "Profile",
  "Notification",
  "Settings",
  "Log Out"
];

// Toggle sidenav collapse and manage tooltips
toggleBtn.addEventListener('click', () => {
  sidenav.classList.toggle('collapsed');

  const menuLinks = document.querySelectorAll('.menu li');

  menuLinks.forEach((linkItem, idx) => {
    const sidenavText = linkItem.querySelector('.sidenavText');

    if (sidenav.classList.contains('collapsed')) {
      sidenavText.style.display = 'none';

      linkItem.addEventListener('mouseover', () => {
        tooltips.innerHTML = `
          <p style="
            background-color: #333;
            font-size: 14px;
            color: white;
            padding: 8px 15px;
            position: absolute;
            top: ${12 + idx * 6}%;
            left: 85px;
            z-index: 1;
            border-radius: 4px;
            white-space: nowrap;
          ">
            ${tooltipLabels[idx]}
          </p>`;
      });

      linkItem.addEventListener('mouseout', () => {
        tooltips.innerHTML = "";
      });
    } else {
      sidenavText.style.display = '';
      tooltips.innerHTML = "";
    }
  });
});

// Page loading with fetch + inline scripts
function loadPage(page) {
  setTimeout(() => {
    fetch(page)
      .then(response => response.text())
      .then(data => {
        mainPage.innerHTML = data;
        localStorage.setItem("lastPage", page);
        runInlineScripts(mainPage);
      })
      .catch(err => {
        console.error("Error loading page:", err);
      });
  }, 1000);
}

function runInlineScripts(container) {
  container.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement('script');
    [...oldScript.attributes].forEach(attr => newScript.setAttribute(attr.name, attr.value));
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// Initialize page & menu link clicks
document.addEventListener('DOMContentLoaded', () => {
  const lastPage = localStorage.getItem("lastPage") || "./dashboardpage/dashboard.html";
  loadPage(lastPage);

  document.querySelectorAll('.menuLink').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.menu li').forEach(item => item.classList.remove('active'));
      link.parentElement.classList.add('active');
      loadPage(link.getAttribute('data-page'));
    });
  });
});

// Dropdown toggle and outside click close
showDrop.addEventListener('click', () => {
  dropDown.classList.toggle('show');
});

document.addEventListener('click', e => {
  if (!showDrop.contains(e.target) && !dropDown.contains(e.target)) {
    dropDown.classList.remove('show');
  }
});
