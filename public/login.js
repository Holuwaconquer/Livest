// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
document.addEventListener("DOMContentLoaded", () => {
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

  const loggedCheck = document.getElementById('loggedCheck');
  const accountlog = document.querySelector('.accountlog');
  const InvalidText5 = document.getElementById('InvalidText5');
  const logInBtn = document.getElementById('logInBtn');

  // Check auth state & update UI
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        signOut(auth);
        return;
      }
      accountlog.style.display = "none";
      loggedCheck.innerHTML = `<img style="width: 50px; height: 50px; border-radius: 50%;" src="${user.photoURL || 'default-avatar.png'}" alt="User photo">`;
      location.href = 'index.html';
    } else {
      console.log("User is signed out.");
    }
  });
  
  accountlog.firstElementChild.classList.add('login');
  accountlog.lastElementChild.classList.add('sign');
  
  logInBtn.addEventListener('click', () => {
    logInBtn.textContent = 'processing...'
    InvalidText5.innerHTML = "";
    const userEmail = document.getElementById('userEmail').value.trim();
    const userPassword = document.getElementById('userPassword').value.trim();

    if (userEmail === "" || userPassword === "") {
      InvalidText5.innerHTML = `<small class="text-danger">Please enter both email and password.</small>`;
      return;
    }
    
    signInWithEmailAndPassword(auth, userEmail, userPassword)
    .then((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) {
          alert("Please verify your email before logging in.");
          signOut(auth);
          return;
        }
        location.href = "index.html";
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/wrong-password") {
          InvalidText5.innerHTML = `<small class="text-danger">Incorrect password. Please try again.</small>`;
        } else if (err.code === "auth/user-not-found") {
          InvalidText5.innerHTML = `<small class="text-danger">No account found with this email.</small>`;
        } else if (err.code === "auth/invalid-email") {
          InvalidText5.innerHTML = `<small class="text-danger">Invalid email format.</small>`;
        }else if(err.code === "auth/network-request-failed"){
          InvalidText5.innerHTML = `<small class="text-danger">Network Error, Make sure you have a stable internet connection</small>`;
        } 
        else {
          InvalidText5.innerHTML = `<small class="text-danger">${err.message}</small>`;
        }
      }).finally(
        logInBtn.textContent = 'Log In'
      );
  });

  // Menu toggle handlers
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const accountIcon = document.getElementById('accountIcon');
  const closeIcon = document.getElementById('closeIcon');
  const closeIcon2 = document.getElementById('closeIcon2');
  const centerSide = document.querySelector('.center-login-side');
  const rightSide = document.querySelector('.right-login-side');

  hamburgerIcon.addEventListener('click', () => {
    centerSide.classList.toggle('showMenu');
  });

  closeIcon.addEventListener('click', (e) => {
    e.preventDefault();
    if (centerSide.classList.contains('showMenu')) {
      centerSide.classList.remove('showMenu');
    }
  });

  accountIcon.addEventListener('click', () => {
    rightSide.classList.add('showAccout');
  });

  closeIcon2.addEventListener('click', (e) => {
    e.preventDefault();
    if (rightSide.classList.contains('showAccout')) {
      rightSide.classList.remove('showAccout');
    }
  });

  document.addEventListener('click', (e) => {
    if (centerSide.classList.contains('showMenu') && !centerSide.contains(e.target) && !hamburgerIcon.contains(e.target)) {
      centerSide.classList.remove('showMenu');
    }
    if (rightSide.classList.contains('showAccout') && !rightSide.contains(e.target) && !accountIcon.contains(e.target)) {
      rightSide.classList.remove('showAccout');
    }
  });
});
