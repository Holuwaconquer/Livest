import Swal from 'https://cdn.skypack.dev/sweetalert2';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let suppressRedirect = false; 
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
  const InvalidText5 = document.getElementById('InvalidText5');
  const logInBtn = document.getElementById('logInBtn');
  // Check auth state & update UI
  onAuthStateChanged(auth, (user) => {
  if (suppressRedirect) return; // prevent race/conflict

  if (user) {
    if (!user.emailVerified) {
      Swal.fire({
        icon: 'info',
        title: 'Email Verification Required',
        text: 'Please verify your email before logging in.',
      });
      signOut(auth);
      return;
    }

    if (window.location.pathname.endsWith('login.html')) {
      location.href = "./client/clientdashboard.html";
    }

    loggedCheck.innerHTML = `<img style="width: 50px; height: 50px; border-radius: 50%;" src="${user.photoURL || 'default-avatar.png'}" alt="User photo">`;
  } else {
    console.log("User is signed out.");
  }
});
  const actionCodeSettings = {
    url: 'https://livest-real-estate.web.app/auth-action.html',
    handleCodeInApp: true
  };

  const newuserEmail = document.getElementById('userEmail').value.trim();
  const forgotpwd = document.getElementById('forgotpwd')
  forgotpwd.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('userEmail').value.trim();
    if (!email) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email before resetting the password.',
      });
      return;
    }

    forgotPassword(email);
  });

  const forgotPassword = (email) => {
    sendPasswordResetEmail(auth, email, actionCodeSettings)
      .then(() => {
        alert("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };
  
  logInBtn.addEventListener('click', () => {
    logInBtn.textContent = 'Logging in...';
    logInBtn.disabled = true;
    InvalidText5.innerHTML = "";

    const userEmail = document.getElementById('userEmail').value.trim();
    const userPassword = document.getElementById('userPassword').value.trim();


  if (userEmail === "" || userPassword === "") {
    InvalidText5.innerHTML = `<small class="text-danger">Please enter both email and password.</small>`;
    logInBtn.textContent = 'Log In';
    logInBtn.disabled = false; // enable button
    return;
  }
  suppressRedirect = true;

  signInWithEmailAndPassword(auth, userEmail, userPassword)
  .then((userCredential) => {
    const user = userCredential.user;
    if (!user.emailVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Not Verified',
        text: 'Please verify your email before logging in.',
      });
      signOut(auth);
      logInBtn.textContent = 'Log In';
      logInBtn.disabled = false;
      suppressRedirect = false; // reset flag
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Login Successful!',
      text: 'Redirecting you to the dashboard...',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        location.href = "./client/clientdashboard.html";
      }
    });
  })

    .catch((err) => {
      console.log(err);
      if (err.code === "auth/wrong-password") {
        Swal.fire({
          icon: 'warning',
          title: 'Wrong password',
          text: 'Incorrect password. Please try again.',
        });
       } else if (err.code === "auth/user-not-found") {
        Swal.fire({
          icon: 'warning',
          title: 'User not found',
          text: 'No account found with this email.',
        });
       } else if (err.code === "auth/invalid-email") {
        Swal.fire({
          icon: 'warning',
          title: 'Wrong email format',
          text: 'Invalid email format.',
        });
       } else if (err.code === "auth/network-request-failed") {
        Swal.fire({
          icon: 'warning',
          title: 'Network Error',
          text: 'Make sure you have a stable internet connection.',
        });
       } else if (err.code === "auth/invalid-credential") {
        Swal.fire({
          icon: 'warning',
          title: 'Wrong details',
          text: 'Email or password is not correct.',
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Error',
          text: err.message,
        });
      }
    })
    .finally(() => {
      logInBtn.textContent = 'Log In';
      logInBtn.disabled = false;
      suppressRedirect = false;
    });
});

const eyecheck = document.getElementById('eyecheck');
const userPasswordInput = document.getElementById('userPassword');

eyecheck.addEventListener('click', () => {
  const isPasswordVisible = userPasswordInput.type === 'text';
  userPasswordInput.type = isPasswordVisible ? 'password' : 'text';

  if(isPasswordVisible){
    eyecheck.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
  </svg>`
  }else{
    eyecheck.innerHTML =`
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
      </svg>
    `
  }
});



});
