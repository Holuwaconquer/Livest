// Import Firebase SDK modules
import Swal from 'https://cdn.skypack.dev/sweetalert2';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getDatabase, ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

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

document.querySelectorAll('.pageLogo').forEach(clicked =>{
  clicked.addEventListener('click', ()=>{
    location.href = 'index.html'
  })
})

window.addEventListener('load', () => {
  setTimeout(() => {
    if (!localStorage.getItem("hasSeenIntro")) {
      introJs().setOptions({
      steps: [
        {
          intro: "Welcome to our Estatery Properties Marketplace, Let's show you around.!"
        },
        {
          element: document.querySelector('.nav-bar'),
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
    alert("Please enter a valid phone number.");
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

  // Trim the IDs just in case
  const postId = (postData.postId || "").trim();
  const userId = (postData.userId || "").trim();

  console.log("Submitting application with postId:", postId, "userId:", userId);

  if (!isValidFirebaseKey(userId) || !isValidFirebaseKey(postId)) {
    alert("Invalid application data.");
    Swal.fire({
      icon: 'warning',
      title: 'Invalid application data.',
      text: err.message,
    });
    return;
  }
  if (!name || !phone) {
    alert("Please fill out required fields.");
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
    alert("Failed to send application. Try again later.");
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
      
      // accountlog.style.display = "none";

      loggedCheck.innerHTML = `
        <div style="position: relative; width: 50px; height: 50px; border-radius: 10px;">
          <div id="dropDownParent" style="width: 100%; cursor: pointer; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
            <img width="100%" height="100%" style="border-radius: 10px; object-fit: cover;" src='${userPhotograph}'>
            <i style="position: absolute; border-radius: 50%; bottom: 0; right: 0; padding: 3px; font-size: 1em; background-color: grey; color: white;" class="fa-solid fa-angle-down"></i>
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
            icon: 'sucess',
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
      const navBar = document.getElementById('nav-bar');
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
                  <li><a href="">Home</a></li>
                  <li><a href="">Property</a></li>
                  <li><a href="">About</a></li>
                  <li><a href="">Contact Us</a></li>
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
    const navBar = document.getElementById('nav-bar');
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
                <li><a href="">Home</a></li>
                <li><a href="">Property</a></li>
                <li><a href="">About</a></li>
                <li><a href="">Contact Us</a></li>
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

const allPostsContainer = document.getElementById("postContainer");

function createPostCard(post) {
  const newdiv = document.createElement("div");

  newdiv.innerHTML = `
    <div class="postBox position-relative">
          <div class="riboon-container">
            <div class="ribbon-badge">
              <span class="icon">✨</span>
              Rent
            </div>
          </div>
          <div class="postBoxImg">
            <img src="${post.imageUrl || 'https://via.placeholder.com/300x200'}" alt="${post.propertyName || 'Property'}">
          </div>
          <!-- post box content -->
          <div class="postBox-Content">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h3><strong>&#8358;${post.propertyPrice || 'No Location'}</strong></h3>
                <h2>${post.propertyName || 'No Title'}</h2>
                <p>${post.propertyLocation || 'No Category'}</p>
              </div>
              <div class="fav-toggle" data-favorited="false" style="width: 40px; height: 40px; background-color: white; display: flex; justify-content: center; align-items: center; border-radius: 50%; box-shadow: 0px 0px 10px 5px #eaeafa;">
                <svg xmlns="http://www.w3.org/2000/svg"  width="20" height="20" fill="#7065F0" class="bi bi-heart" viewBox="0 0 16 16">
                  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                </svg>
              </div>
            </div>
            <!-- postitemdetails  -->
            <div class="postitemDetails d-flex py-3 w-100 justify-content-between align-items-center">
              <div class="">
                  <span>
                      <img src="./assets/bed.png" alt="">
                      <small>3</small>
                  </span>
              </div>
              <div class="">
                  <span>
                      <img src="./assets/Icon.png" alt="">
                      <small>4</small>
                  </span>
              </div>
              <div class="">
                  <span>
                      <img src="./assets/Icon (1).png" alt="">
                      <small>360m</small>
                  </span>
              </div>
            </div>
            <!-- end of postitem details -->
          </div>
          <!-- end of post box content -->
        </div>
  `
  return newdiv;


}

let showOnlyFavorites = false;

document.getElementById('toggleFavoritesBtn').addEventListener('click', () => {
  showOnlyFavorites = !showOnlyFavorites;
  document.getElementById('toggleFavoritesBtn').textContent = showOnlyFavorites ? 'Show All Posts' : 'Show Favorites';
  loadAllPosts();
});

function loadAllPosts() {
  const postsRef = ref(database, "posts");
  let loadedPostsArray = [];

  onValue(postsRef, (snapshot) => {
    allPostsContainer.innerHTML = "";
    const posts = snapshot.val();

    if (!posts) {
      allPostsContainer.innerHTML = "<p>No posts available.</p>";
      return;
    }

    loadedPostsArray = Object.entries(posts).map(([key, post]) => ({
      ...post,
      postId: key,
    }));

    const favoritePostIds = JSON.parse(localStorage.getItem('favoritePostIds')) || [];

    const filteredPosts = showOnlyFavorites
      ? loadedPostsArray.filter(post => favoritePostIds.includes(post.postId))
      : loadedPostsArray;

    if (filteredPosts.length === 0) {
      allPostsContainer.innerHTML = "<p>No posts to show.</p>";
      return;
    }

    filteredPosts.forEach(post => {
      const postCard = createPostCard(post);
      postCard.addEventListener("click", () => {
        showPostModal(post);
      });

      const favIcon = postCard.querySelector('.fav-toggle');
      const isFavorited = favoritePostIds.includes(post.postId);

      favIcon.setAttribute('data-favorited', isFavorited);
      favIcon.innerHTML = isFavorited
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7065F0" class="bi bi-heart-fill" viewBox="0 0 16 16">
             <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
           </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7065F0" class="bi bi-heart" viewBox="0 0 16 16">
             <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
           </svg>`;

      favIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentState = favIcon.getAttribute('data-favorited') === 'true';
        favIcon.setAttribute('data-favorited', !currentState);

        let updatedFavorites = JSON.parse(localStorage.getItem('favoritePostIds')) || [];

        if (currentState) {
          updatedFavorites = updatedFavorites.filter(id => id !== post.postId);
        } else {
          updatedFavorites.push(post.postId);
        }

        localStorage.setItem('favoritePostIds', JSON.stringify(updatedFavorites));

        favIcon.innerHTML = !currentState
          ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7065F0" class="bi bi-heart-fill" viewBox="0 0 16 16">
               <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
             </svg>`
          : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#7065F0" class="bi bi-heart" viewBox="0 0 16 16">
               <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
             </svg>`;

       if (showOnlyFavorites) {
          loadAllPosts();
        }
      });

      allPostsContainer.appendChild(postCard);
    });
  });
}



const popOut = document.getElementById('popOut')
const closeBtn = document.getElementById('closeBtn')
const showPopOut = document.getElementById('showPopOut')
closeBtn.addEventListener('click', ()=>{
  popOut.style.display = "none";
})

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("showPopOut")) {
      popOut.style.display = "flex";      
    }
  });
});
const postImg = document.getElementById('postImg')
function showPostModal(post) {
  document.getElementById('postTitle').textContent = post.propertyName;
  document.getElementById('postDesc').textContent = post.propertyDesc;
  document.getElementById('postPrice').innerHTML = `<h4><strong>&#8358;${post.propertyPrice}</strong></h4>`;
  document.getElementById('postAuthor').textContent = post.postedBy;
  document.getElementById('authorNo').textContent = post.authorPhone;
  document.getElementById('postImgMain').src = post.imageUrl;

  postImg.innerHTML = ""; 

if (Array.isArray(post.imageGallery)) {
  post.imageGallery.forEach((url, index) => {
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "80px";
    img.style.height = "50px";
    img.style.objectFit = "fill";
    img.style.cursor = "pointer"
    img.classList.add("rounded", "border", "border-1");
    postImg.appendChild(img);

    img.addEventListener('click', ()=>{
      console.log({index, url});
      document.getElementById('postImgMain').src = url
      
    })
  });
} else {
  const img = document.createElement("img");
  img.src = post.imageUrl || 'https://via.placeholder.com/200';
  img.style.width = "200px";
  img.style.height = "150px";
  img.style.objectFit = "cover";
  img.classList.add("rounded", "border");
  postImg.appendChild(img);
}


  document.getElementById('postLocation').textContent = post.propertyLocation;
  document.getElementById('propertyCategory').textContent = post.propertyCategory;
  document.getElementById('propertyPrice').innerHTML = `<p><strong>&#8358;${post.propertyPrice}</strong></p>`;

   const button = document.getElementById("applyBtn");
  button.setAttribute("data-post-id", post.postId || post.id || '');
  button.setAttribute("data-owner-id", post.userId || post.postedById || '');
  
  popOut.style.display = "flex";
}


loadAllPosts();


document.addEventListener("click", function (event) {
  if (event.target.classList.contains("sendAppBtn")) {
    const postIdRaw = event.target.getAttribute("data-post-id") || "";
    const userIdRaw = event.target.getAttribute("data-owner-id") || "";


    const postId = postIdRaw.trim();
    const userId = userIdRaw.trim();


    console.log("Setting appPostId with:", { postId, userId });


    if (!isValidFirebaseKey(userId) || !isValidFirebaseKey(postId)) {
      alert("Invalid post or owner ID in button attributes.");
      return;
    }

    document.getElementById('appPostId').value = JSON.stringify({ postId, userId });
    document.getElementById('applicationModal').style.display = "flex";
  }
});

document.getElementById("closeAppModal").addEventListener("click", () => {
  document.getElementById('applicationModal').style.display = "none";
});

const testimonials = [
  { text: "Estatery is the platform I go to on almost a daily basis...", img: "./assets/ladyPic.png", author: "Mary Beth" },
  { text: "Super easy to use, clean interface!", img: "./assets/guy1.png", author: "John Doe" },
  { text: "Fantastic support and powerful features.", img: "./assets/ladyPic.png", author: "Dan Steve" }
];

const displayTime = 5000;
let currentIndex = 0;

const testimonialText = document.getElementById('testimonialText');
const testimonialAuthor = document.getElementById('testimonialAuthor');
const userWrappers = document.querySelectorAll('.user-wrapper');
const progressCircles = document.querySelectorAll('.ring-progress');
const userImages = document.querySelectorAll('.user-img');

// Set images once
userImages.forEach((img, index) => {
  if (testimonials[index]) {
    img.src = testimonials[index].img;
  }
});

function updateTestimonial(index) {
  const testimonial = testimonials[index];
  testimonialText.style.opacity = 0;
  testimonialAuthor.style.opacity = 0;

  setTimeout(() => {
    testimonialText.textContent = testimonial.text;
    testimonialAuthor.textContent = testimonial.author;

    userWrappers.forEach((el, idx) => {
      el.classList.toggle('active', idx === index);
    });

    progressCircles.forEach((el, idx) => {
      el.style.strokeDashoffset = idx === index ? '0' : '100';
    });

    testimonialText.style.opacity = 1;
    testimonialAuthor.style.opacity = 1;
  }, 300);
}

setInterval(() => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  updateTestimonial(currentIndex);
}, displayTime);

updateTestimonial(currentIndex);


window.addEventListener('scroll', function () {
  const navBar = document.getElementById('nav-bar');
  if (window.scrollY > 300) {
      navBar.classList.add('stickyNav')
  } else {
      navBar.classList.remove('stickyNav')
  }
});
