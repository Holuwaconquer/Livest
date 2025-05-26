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
    // Remove dropdown if present
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

// --- POSTS CODE ---

const allPostsContainer = document.getElementById("allPosts");

function createPostCard(post) {
  const div = document.createElement("div");
  div.className = "postDiv col-md-4 mb-4";

  div.innerHTML = `
    <div class="position-relative overflow-hidden card h-100 rounded-4">
      <div class="imageDiv position-relative overflow-hidden">
        <img src="${post.imageUrl || 'https://via.placeholder.com/300x200'}" class="card-img-top rounded-4" alt="${post.propertyName || 'Property'}">
        <div class="viewPost d-flex justify-content-center align-items-center position-absolute rounded-4">
          <button class="btn showPopOut">View Post</button>
          <button class="btn">Send Application</button>
        </div>
      </div>
      <div class="postMore w-100 py-2 px-1 d-flex position-absolute rounded-bottom-4 justify-content-between align-items-center">
            <h6 class="card-text"><small>Posted by: ${post.postedBy || 'Anonymous'}</small></h6>
            <h6 class="card-text"><small>Posted on: ${post.postedDate || 'Unknown'}</small></h6>
      </div>
      <div class="card-body">
        <div>
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="card-title"><strong>${post.propertyName || 'No Title'}</strong></h5>
            <h5 class="card-title"><strong>&#8358;${post.propertyPrice || 'No Location'}</strong></h5>
          </div>
          <div>
            <p class="card-text text-muted mb-3"><i class="fa-solid fa-location-dot"></i> ${post.propertyLocation || 'No Category'}</p>
            <h6 class="card-subtitle mb-2">${post.propertyDesc || 'No Description'}</h6>
          </div>
        </div>
        </div>
    </div>
  `;

  return div;
}

function loadAllPosts() {
  const postsRef = ref(database, "posts");

  onValue(postsRef, (snapshot) => {
    allPostsContainer.innerHTML = ""; // Clear old posts
    const posts = snapshot.val();

    if (!posts) {
      allPostsContainer.innerHTML = "<p>No posts available.</p>";
      return;
    }

    // Convert posts object to array and sort by timestamp descending
    const postsArray = Object.values(posts).sort((a, b) => b.timestamp - a.timestamp);

    postsArray.forEach(post => {
      const postCard = createPostCard(post);
      postCard.addEventListener("click", () => {
        showPostModal(post);
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

function showPostModal(post) {
  document.getElementById('postTitle').textContent = post.propertyName;
  document.getElementById('postDesc').textContent = post.propertyDesc;
  document.getElementById('postPrice').innerHTML = `<h4><strong>&#8358;${post.propertyPrice}</strong></h4>`;
  document.getElementById('postAuthor').textContent = post.postedBy;
  document.getElementById('authorNo').textContent = post.authorPhone;
  document.getElementById('postImg').src = post.imageUrl;
  document.getElementById('postLocation').textContent = post.propertyLocation;
  document.getElementById('propertyCategory').textContent = post.propertyCategory;
  document.getElementById('propertyPrice').innerHTML = `<p><strong>&#8358;${post.propertyPrice}</strong></p>`;


  popOut.style.display = "flex"; // Or use a class to show it
}


// Load all posts immediately for every visitor (logged in or not)
loadAllPosts();
