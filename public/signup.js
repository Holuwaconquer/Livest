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
  let loggedCheck = document.getElementById('loggedCheck');
  let signGoogle = document.getElementById('signGoogle');
  let accountlog = document.querySelector('.accountlog');
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
      accountlog.style.display = "none";
      loggedCheck.innerHTML = `<img style="width: 50px; height: 50px; border-radius: 50%;" src="${user.photoURL}">`;
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


  accountlog.firstElementChild.classList.add('login');
  accountlog.lastElementChild.classList.add('sign');

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
  eyecheck.classList.toggle('fa-eye');
  eyecheck.classList.toggle('fa-eye-slash');
});

let hamburgerIcon = document.getElementById('hamburgerIcon')
      let accountIcon = document.getElementById('accountIcon')
      let closeIcon = document.getElementById('closeIcon')
      let centerSide = document.querySelector('.center-login-side')
      let rightSide = document.querySelector('.right-login-side')
    hamburgerIcon.addEventListener('click', ()=>{
      centerSide.classList.toggle('showMenu')
    })
    closeIcon.addEventListener('click', (e)=>{
      e.preventDefault()
      if(centerSide.classList.contains('showMenu')){
        centerSide.classList.remove('showMenu')
      }
    })
    accountIcon.addEventListener('click', ()=>{
      rightSide.classList.add('showAccout')
    })
    document.getElementById('closeIcon2').addEventListener('click', (e)=>{
      e.preventDefault()
      if(rightSide.classList.contains('showAccout')){
        rightSide.classList.remove('showAccout')
      }
    })
    document.addEventListener('click', (e)=>{
      if(centerSide.classList.contains('showMenu') && !centerSide.contains(e.target) && !hamburgerIcon.contains(e.target)){
        centerSide.classList.remove('showMenu')
      }
      else if(rightSide.classList.contains('showAccout') && !rightSide.contains(e.target) && !accountIcon.contains(e.target)){
        rightSide.classList.remove('showAccout')
      }
    })