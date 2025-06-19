  import Swal from 'https://cdn.skypack.dev/sweetalert2';
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
    Swal.fire({
      title: 'Signing out...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    signOut(auth)
      .then(() => {
        Swal.fire({
          icon: 'success',
        title: 'Sign Out Successful',
        text: 'Redirecting you to the login page.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        }).then(() => {
          location.href = "../login.html";
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error signing out',
          text: error.message,
          confirmButtonColor: '#3085d6'
        });
      });
  };
  document.addEventListener('DOMContentLoaded', () => {
    const logOutUserBtn = document.getElementById('logOutUser');
    const logUserOutBtn = document.getElementById('logUserOut');

    if (logOutUserBtn) logOutUserBtn.addEventListener('click', logOut);
    if (logUserOutBtn) logUserOutBtn.addEventListener('click', logOut);
  });

window.addEventListener('load', () => {
  if (localStorage.getItem("newhasSeenIntro")) return;
  const menuLinks = document.querySelectorAll('.menu li');
  const steps = [
    {
      intro: "Hello, Welcome to your dashboard, Let's show you how to walk your way around.!"
    },
    {
      element: document.getElementById('dropDown'),
      intro: "This is a dropdown down menu which you can use to navigate to your profile and the homepage of this appliation"
    }
  ];
  menuLinks.forEach((link, index) => {
    steps.push({
      element: link,
      intro: getStepDescription(index) // Function to get appropriate description for each step
    });
  });

  setTimeout(() => {
    introJs().setOptions({
      steps: steps,
      tooltipClass: 'customTooltip',
      highlightClass: 'customHighlight',
      showStepNumbers: false,
      showProgress: true,
      scrollToElement: true,
      scrollTo: 'tooltip',
      exitOnOverlayClick: false,
      nextLabel: 'Next',
      prevLabel: 'Back',
      doneLabel: 'Finish',
      disableInteraction: true,
    }).start();
    
    localStorage.setItem("newhasSeenIntro", "true");
  }, 1500);
})
function getStepDescription(index) {
  const descriptions = [
    "This is the dashboard page where you can see your account overview",
    "This is the page where you can post, view delete and edit your properties",
    "This is the page where you can see applications sent by client interested in your properties",
    "This is your profile page, where you can edit your profile",
    "This is your notification page, where you can see lists of notification you got",
    "This is your seetings page, where you can modified any settings you want.",
    "Click on this to log out of your account."
  ];
  
  return descriptions[index] || "This is an important section of your dashboard";
}

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

    } else {
      location.href = "../login.html";
    }


    const notificationsRef = ref(database, `notifications/${user.uid}`);
    const notifLabel = document.getElementById('notifLabel')  
    onValue(notificationsRef, (snapshot) => {
          const notifications = snapshot.val();
          const unreadNotifications = Object.entries(notifications).filter(([id, notif]) => !notif.read);
          
          if (unreadNotifications.length === 0) {
            notifLabel.textContent = '';
            return;
          }else{
            notifLabel.textContent = unreadNotifications.length;
          }
      });
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
const loader = document.getElementById('dynamicLoader');
function loadPage(page) {

  loader.style.display = 'flex';
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
      }).finally(()=>{
        loader.style.display = 'none';
      })
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
document.querySelector('.newNot').addEventListener('click', (e)=>{
  loadPage(document.querySelector('.newNot').getAttribute('data-page'));
})
