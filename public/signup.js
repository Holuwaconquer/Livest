// Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, updateProfile, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

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

  let loggedCheck = document.getElementById('loggedCheck');
  let signGoogle = document.getElementById('signGoogle');
  let accountlog = document.querySelector('.accountlog');
  let userRegistered = 0;

  signGoogle.addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.email);
        if (user) {
          window.location.href = "index.html";
        }
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData?.email;
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
      });
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      accountlog.style.display = "none";
      loggedCheck.innerHTML = `<img style="width: 50px; height: 50px; border-radius: 50%;" src="${user.photoURL}">`;
      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        signOut(auth);
        return;
      }
      location.href = 'index.html';
    } else {
      console.log("User is not log in.");
    }
  });

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
        createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
          .then((userCredential) => {
            alert("Sign up successful");
            const user = auth.currentUser;
            sendEmailVerification(user)
              .then(() => {
                alert('email sent');
              }).catch((err) => {
                alert(err);
              });
            updateProfile(user, {
              displayName: `${trimmedFName} ${trimmedLName}`
            }).then(() => {
              let userDetails = {
                userFname: trimmedFName,
                userLname: trimmedLName,
                userEmail: trimmedEmail,
                createdAt: new Date().toISOString()
              };
              const userRef = ref(database, `/Registered-User/${userRegistered}`);
              set(userRef, userDetails)
                .then(() => {
                  alert('info saved');
                  location.href = "login.html";
                }).catch((err) => {
                  console.log('info not save', err);
                });
            });
            signOut(auth).then(() => {
              // Sign-out successful.
            }).catch((error) => {
              // An error happened.
            });
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              InvalidText5.innerHTML = `<small class="text-danger">This email is already registered. <a href="login.html">Login instead?</a></small>`;
            } else {
              alert("Error: " + error.message);
            }
          });
      } else {
        InvalidText5.innerHTML = `<small class="text-danger">make sure you click on "i agree with rules"</small>`;
      }
    } else {
      InvalidText5.innerHTML = `<small class="text-danger">Please fill in all required fields</small>`;
    }
  });
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
    closeIcon2.addEventListener('click', (e)=>{
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