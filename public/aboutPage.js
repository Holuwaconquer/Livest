// Import Firebase SDK modules
import Swal from 'https://cdn.skypack.dev/sweetalert2';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase, ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

if(!navigator.onLine){
  alert('You are offline, Please check your internet connection');
}
window.addEventListener('offline', ()=>{
  alert('You lost your internet connection')
})
window.addEventListener('online', ()=>{
  alert('You are back online')
})

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
function isValidFirebaseKey(key) {
  if (typeof key !== 'string' || key.length === 0) return false;
  const invalidChars = ['.', '#', '$', '[', ']'];
  return !invalidChars.some(char => key.includes(char));
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const navBar = document.getElementById('nav-bar');

document.addEventListener('DOMContentLoaded', function() {
  const loader = document.getElementById('loads');
  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.style.opacity = '0';
      setTimeout(function() {
        loader.style.display = 'none';
      }, 800);
    }, 5000);
  });

  setTimeout(function() {
    loader.style.opacity = '0';
    setTimeout(function() {
      loader.style.display = 'none';
    }, 500);
  }, 3000);
});

document.querySelectorAll('.pageLogo').forEach(clicked =>{
  clicked.addEventListener('click', ()=>{
    location.href = 'index.html'
  })
})

window.addEventListener('scroll', function () {
  if (window.scrollY > 100) {
      document.getElementById('nav-bar').classList.add('stickyNav')
  } else {
      document.getElementById('nav-bar').classList.remove('stickyNav')
  }
});

window.addEventListener('load', () => {
  setTimeout(() => {
    if (!localStorage.getItem("hasSeenIntro")) {
      introJs().setOptions({
      steps: [
        {
          intro: "Welcome to our Estatery Properties Marketplace, Let's show you around.!"
        },
        {
          element: navBar,
          intro: "This is the navigation bar where you can explore options.",
        },
        {
          element: document.getElementById('signUP'),
          intro: "Use this button to create account and start uploading your properties",
        },
        {
          element: document.querySelector('.search-bar'),
          intro: "You can filter your properties choice with this section",
        },
        {
          element: document.getElementById('mainPost'),
          intro: "These are handpicked properties just for you.",
        },
        {
          element: document.getElementById('aLandlord'),
          intro: "Submit your email to subscribe to our newsletter and receive notifications on how you can make more income",
        }
      ],
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
    
      localStorage.setItem("hasSeenIntro", "true");
    }
  }, 1500);
});


const loggedCheck = document.getElementById('loggedCheck');
const accountlog = document.querySelector('.accountlog');
const div = document.createElement('div');
div.id = "dropDownBox";

document.getElementById("applicationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("applicantName").value.trim();
  const phone = document.getElementById("applicantPhone").value.trim();
  const applicantEmail = document.getElementById("applicantEmail").value.trim();
  const message = document.getElementById("applicantMessage").value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (applicantEmail && !emailRegex.test(applicantEmail)) {
    Swal.fire({
      icon: 'warning',
      title: 'Wrong Email',
      text: 'Please enter a valid email address.',
    });
    return;
  }

  const phoneRegex = /^\d{7,15}$/;
  if (!phoneRegex.test(phone)) {
    Swal.fire({
      icon: 'warning',
      title: 'Wrong Phone Number',
      text: 'Please enter a valid phone number.',
    });
    return;
  }

  let postData;
  try {
    postData = JSON.parse(document.getElementById("appPostId").value);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid post data. Please try again.',
      text: err.message,
    });
    console.error("Error parsing post data:", err);
    return;
  }

  const postId = (postData.postId || "").trim();
  const userId = (postData.userId || "").trim();

  console.log("Submitting application with postId:", postId, "userId:", userId);

  if (!isValidFirebaseKey(userId) || !isValidFirebaseKey(postId)) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid application data.',
      text: "err.message",
    });
    return;
  }
  if (!name || !phone) {
    Swal.fire({
      icon: 'warning',
      title: 'Please fill out required fields.',
      text: err.message,
    });
    return;
  }

  const application = {
    name,
    phone,
    applicantEmail,
    message,
    date: new Date().toISOString(),
    fromUserId: auth.currentUser ? auth.currentUser.uid : "guest",
  };

  try {
    const appRef = push(ref(database, `applications/${userId}/${postId}`));
    await set(appRef, application);

    const notification = {
      type: "new_application",
      message: `${name} has applied to your post.`,
      timestamp: new Date().toISOString(),
      postId,
      fromUserId: auth.currentUser ? auth.currentUser.uid : "guest",
      name: name,
      phone: phone,
      read: false
    };
    

    const notificationRef = push(ref(database, `notifications/${userId}`));
    await set(notificationRef, notification);


    Swal.fire({
      icon: 'success',
      title: 'Application Sent!',
      text: 'Your Application has been submitted successfully',
    });
    document.getElementById('applicationModal').style.display = "none";
    document.getElementById('applicationForm').reset();
  } catch (err) {
    console.error("Error submitting application:", err);
    Swal.fire({
      icon: 'error',
      title: 'Application not Sent!',
      text: 'Failed to send application. Try again later.',
    });
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    accountlog.innerHTML = ""
    const [first] = user.displayName ? user.displayName.split(' ') : ["User"];
    const userRef = ref(database, `users/${user.uid}`);

    
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      const userPhotograph = data?.profilePicture || "https://via.placeholder.com/50"; // fallback image

      loggedCheck.innerHTML = `
        <div style="position: relative; width: 40px; height: 40px; border-radius: 10px;">
          <div id="dropDownParent" style="width: 100%; cursor: pointer; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <img width="100%" height="100%" style="border-radius: 10px; object-fit: cover;" src='${userPhotograph}'>
            <div style="position: absolute; bottom: -10px; width: 25px; height: 25px; right: -10px; padding: 1px; background-color: white; border-radius: 50%">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7065F0" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </div>
          </div>
        </div>
      `;

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

      loggedCheck.addEventListener('click', () => {
        div.style.display = div.style.display === 'block' ? 'none' : 'block';
      });

 
      document.addEventListener('click', (e) => {
        if (!loggedCheck.contains(e.target) && !div.contains(e.target)) {
          div.style.display = 'none';
        }
      });

      document.getElementById('logOutUser').addEventListener('click', () => {
        signOut(auth).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'Log Out Sucessful',
            text: 'You have been logged out',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
            willClose: () => {
              location.reload();
            }
          });
        }).catch((error) => {
          console.error("Logout error:", error);
        });
      });
      const hamburgerIcon = document.getElementById('hamburgerIcon');
  
      let menuOpen = false;
      
      hamburgerIcon.addEventListener('click', () => {
        const existingMenu = document.getElementById('hamburgerMenuDropdown');
  
        if (menuOpen && existingMenu) {
          existingMenu.remove();
          hamburgerIcon.classList.remove('open');
          menuOpen = false;
        } else {
  
          const menuDropDown = document.createElement('div');
          menuDropDown.id = 'hamburgerMenuDropdown';
          menuDropDown.innerHTML = `
            <div class="menuDropdown">
              <div class="">
                <ul>
                  <li><a href="index.html">Home</a></li>
                  <li><a href="allPost.html">Property</a></li>
                  <li><a href="#">About</a></li>
                  <li><a href="contact.html">Contact Us</a></li>
                </ul>
              </div>
              <div class="signButton">
                <div class="d-flex align-items-center gap-2">
                  <div style="width: 40px;  height: 40px; border-radius: 10px;">
                    <img width="100%" height="100%" style="border-radius: 10px; object-fit: cover;" src='${userPhotograph}'>
                  </div>
                  <div>
                    <p>Hello <strong>${first}</strong></p>
                  </div>
                </div>
                <a style="color: white; text-decoration: none;" href="">Go to DashBoard</a>
                <button id="logOutUse">Log Out</button>
              </div>
            </div>
          `;
          if (navBar) {
            navBar.appendChild(menuDropDown);
          }
          hamburgerIcon.classList.add('open');
          menuOpen = true;
        }
      });
    });

  } else {
    accountlog.style.display = "flex";
    if (div.parentElement) {
      div.parentElement.removeChild(div);
    }
    const hamburgerIcon = document.getElementById('hamburgerIcon');

    let menuOpen = false;
    hamburgerIcon.addEventListener('click', () => {
      const existingMenu = document.getElementById('hamburgerMenuDropdown');

      if (menuOpen && existingMenu) {
        existingMenu.remove();
        hamburgerIcon.classList.remove('open');
        menuOpen = false;
      } else {

        const menuDropDown = document.createElement('div');
        menuDropDown.id = 'hamburgerMenuDropdown';
        menuDropDown.innerHTML = `
          <div class="menuDropdown">
            <div class="">
              <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="allPost.html">Property</a></li>
                <li><a href=#"">About</a></li>
                <li><a href="contact.html">Contact Us</a></li>
              </ul>
            </div>
            <div class="signButton">
              <button onclick="location.href='login.html'" class="login">Log in</button>
              <button onclick="location.href='signup.html'" class="sign">Join Now</button>
            </div>
          </div>
        `;
        
        if (navBar) {
          navBar.appendChild(menuDropDown);
        }
        hamburgerIcon.classList.add('open');
        menuOpen = true;
      }
    });
  }
});


if (accountlog.firstElementChild) accountlog.firstElementChild.classList.add('login');
if (accountlog.lastElementChild) accountlog.lastElementChild.classList.add('sign');


// POSTS CODE
