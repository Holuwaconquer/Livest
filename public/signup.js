import Swal from 'https://cdn.skypack.dev/sweetalert2';
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, updateProfile, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
let suppressRedirect = false;
document.addEventListener("DOMContentLoaded", () => {
  // Your Firebase config
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
  const provider = new GoogleAuthProvider();

  const resendBtn = document.getElementById('resendVerification');
  let signGoogle = document.getElementById('signGoogle');
  signGoogle.addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          if (!user.emailVerified) {
            Swal.fire({
              icon: 'info',
              title: 'Email Verification Required',
              text: 'Please verify your email before logging in.',
            });
            resendBtn.style.display = 'inline-block';
            signOut(auth);
          } else {
            window.location.href = "index.html";
          }
        }
      }).catch((error) => {
        console.error(error);
      });
  });

  onAuthStateChanged(auth, (user) => {
    if (suppressRedirect) return;
    if (user) {
      if (!user.emailVerified) {
        Swal.fire({
          icon: 'info',
          title: 'Email Verification Required',
          text: 'Please verify your email before logging in.',
        })
        signOut(auth);
        return;
      }
      resendBtn.style.display = 'none';
      if (window.location.pathname.endsWith('signup.html')) {
        location.href = "./client/clientdashboard.html";
      }
    } else {
      console.log("User is not log in.");
    }
  });

  resendBtn.addEventListener('click', () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      sendEmailVerification(user).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Verification Email Sent',
          text: 'Please check your inbox.'
        });
      }).catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Sending Email',
          text: "there's an error sending the verification emal"
        });
      });
    }
  });

  const actionCodeSettings = {
    url: 'https://livest-real-estate.web.app/auth-action.html',
    handleCodeInApp: true
  };

  let InvalidText5 = document.getElementById('InvalidText5');
  let userFname = document.getElementById('userFname');
  let userLname = document.getElementById('userLname');
  let userEmail = document.getElementById('userEmail');
  let userPassword = document.getElementById('userPassword');
  let flexCheckDefault = document.getElementById('flexCheckDefault');

  userFname.addEventListener('keyup', () => {
    let invalidText = document.getElementById('InvalidText');
    let trimmedFName = userFname.value.trim();
    if (trimmedFName.length < 3) {
      invalidText.innerHTML = `<small class="text-danger">First Name cannot be less than 3</small>`;
    } else {
      invalidText.innerHTML = `<small class="text-primary">First Name is valid</small>`;
    }
  });

  userLname.addEventListener('keyup', () => {
    let invalidText2 = document.getElementById('InvalidText2');
    let trimmedLName = userLname.value.trim();
    if (trimmedLName.length < 3) {
      invalidText2.innerHTML = `<small class="text-danger">Last Name cannot be less than 3</small>`;
    } else {
      invalidText2.innerHTML = `<small class="text-primary">Last Name is valid</small>`;
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  userEmail.addEventListener('keyup', () => {
    let invalidText3 = document.getElementById('InvalidText3');
    let trimmedEmail = userEmail.value.trim();
    if (!isValidEmail(trimmedEmail)) {
      invalidText3.innerHTML = `<small class="text-danger">Invalid email format</small>`;
    } else {
      invalidText3.innerHTML = `<small class="text-primary">Email is valid</small>`;
    }
  });

  userPassword.addEventListener('keyup', () => {
    let invalidText4 = document.getElementById('InvalidText4');
    let trimmedPassword = userPassword.value.trim();
    if (trimmedPassword.length < 8) {
      invalidText4.innerHTML = `<small class="text-danger">Password must be at least 8 characters</small>`;
    } else {
      invalidText4.innerHTML = `<small class="text-primary">Strong Password</small>`;
    }
  });

  let signUp = document.getElementById('signUp');
  signUp.addEventListener('click', () => {
    let trimmedFName = userFname.value.trim();
    let trimmedLName = userLname.value.trim();
    let trimmedEmail = userEmail.value.trim();
    let trimmedPassword = userPassword.value.trim();
    
    if (trimmedFName !== "" && trimmedLName !== "" && isValidEmail(trimmedEmail) && trimmedPassword !== "") {
      if (flexCheckDefault.checked) {
        signUp.textContent = 'Sign up in Progress...';
        signUp.disabled = true;
        suppressRedirect = true;
        createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
          .then((userCredential) => {
            const user = userCredential.user;

            return updateProfile(user, {
              displayName: `${trimmedFName} ${trimmedLName}`
            }).then(() => {
              const userDetails = {
                userFname: trimmedFName,
                userLname: trimmedLName,
                userEmail: trimmedEmail,
                createdAt: new Date().toISOString()
              };
              const userRef = ref(database, `/Registered-User/${user.uid}`);
              return set(userRef, userDetails).catch((err) => {
                console.warn("User data not saved to database:", err);
              });
            }).then(() => {
              return sendEmailVerification(user, actionCodeSettings);
            }).then(() => {
              return Swal.fire({
                icon: 'success',
                title: 'Sign Up Complete',
                html: 'A verification email has been sent. Please check your inbox.',
                confirmButtonColor: '#3085d6'
              });
            }).then(() => {
              return signOut(auth).then(() => {
                location.href = "login.html";
              });
            });
          })
          .catch((error) => {
            if (error.code === "auth/network-request-failed") {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Network Error, make sure you have a stable internet connection.',
                confirmButtonColor: '#d33'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: error.message || 'Something went wrong.',
                confirmButtonColor: '#d33'
              });
            }
          })
          .finally(() => {
            signUp.textContent = 'Sign up';
            signUp.disabled = false;
            suppressRedirect = false;
          });

      } else {
        InvalidText5.innerHTML = `<small class="text-danger">make sure you click on "i agree with rules"</small>`;
      }
    } else {
      InvalidText5.innerHTML = `<small class="text-danger">Please fill in all required fields</small>`;
    }
  });
});

const eyecheck = document.getElementById('eyecheck2');
const userPasswordInput = document.getElementById('userPassword');

eyecheck.addEventListener('click', () => {
  const isPasswordVisible = userPasswordInput.type === 'text';
  userPasswordInput.type = isPasswordVisible ? 'password' : 'text';

  // Toggle icon class
  if(isPasswordVisible){
    eyecheck.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
    </svg>
    `
  }else{
   eyecheck.innerHTML = `
    <svg id="eyecheck"  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
        <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
      </svg>
      ` 
  }
});
