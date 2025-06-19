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
const loggedCheck = document.getElementById('loggedCheck');
const accountlog = document.querySelector('.accountlog');
const div = document.createElement('div');
div.id = "dropDownBox";
const navBar = document.getElementById('nav-bar');

document.querySelectorAll('.pageLogo').forEach(clicked =>{
  clicked.addEventListener('click', ()=>{
    location.href = 'index.html'
  })
})  
const popOut = document.getElementById('popOut');
const closeBtn = document.getElementById('closeBtn');
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



const allPostsContainer = document.getElementById("postContainer");
let loadedPostsArray = [];
let showOnlyFavorites = false;
function createPostCard(post) {
  const newdiv = document.createElement("div");
  newdiv.innerHTML = `
    <div class="postBox position-relative">
          <div class="riboon-container">
            <div class="ribbon-badge">
              <span class="icon">✨</span>
              ${post.propertyType || 'N/A'}
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
                      <small>${post.bedroom || 'N/A'}</small>
                  </span>
              </div>
              <div class="">
                  <span>
                      <img src="./assets/Icon.png" alt="">
                      <small>${post.bathroom || 'N/A'}</small>
                  </span>
              </div>
              <div class="">
                  <span>
                      <img src="./assets/Icon (1).png" alt="">
                      <small>${post.propsSize || 'N/A'}</small>
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
function renderAllPosts(filteredPosts, filters = {}) {
    allPostsContainer.innerHTML = "";
    
    if (filteredPosts.length === 0) {
        allPostsContainer.innerHTML = `
            <div class="no-results">
                <p>${showOnlyFavorites ? "No favorite properties found" : "No properties found"}</p>
                <button onclick="loadAllPosts()">Show All Properties</button>
            </div>
        `;
        return;
    }
    
    filteredPosts.forEach(post => {
        const postCard = createPostCard(post);
        postCard.addEventListener("click", () => {
            showPostModal(post);
        });

        const favIcon = postCard.querySelector('.fav-toggle');
        const favoritePostIds = JSON.parse(localStorage.getItem('favoritePostIds')) || [];
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

            if (showOnlyFavorites) {
                loadAllPosts(); // Reload if we're in favorites-only mode
            }
        });

        allPostsContainer.appendChild(postCard);
    });
}

function loadAllPosts() {
    const postsRef = ref(database, "posts");
    
    onValue(postsRef, (snapshot) => {
        const posts = snapshot.val();
        
        if (!posts) {
            allPostsContainer.innerHTML = "<p>No properties available.</p>";
            return;
        }

        loadedPostsArray = Object.entries(posts).map(([key, post]) => {
            if (!post.propertyPurpose) {
                post.propertyPurpose = ""; // Set default
            }
            return { ...post, postId: key };
        });

        const favoritePostIds = JSON.parse(localStorage.getItem('favoritePostIds')) || [];
        const filteredPosts = showOnlyFavorites
            ? loadedPostsArray.filter(post => favoritePostIds.includes(post.postId))
            : loadedPostsArray;

        renderAllPosts(filteredPosts);
    });
}

document.addEventListener('DOMContentLoaded', function() {

    const savedFilters = JSON.parse(localStorage.getItem('postFilters')) || {};
    
    document.getElementById('toggleFavoritesBtn').addEventListener('click', () => {
        showOnlyFavorites = !showOnlyFavorites;
        document.getElementById('toggleFavoritesBtn').textContent = 
            showOnlyFavorites ? 'Show All Posts' : 'Show Favorites';
        loadAllPosts();
    });

    if (Object.keys(savedFilters).length > 0) {
        const filtered = filterPosts(savedFilters);
        renderAllPosts(filtered, savedFilters);
    } else {
        loadAllPosts();
    }
    
    localStorage.removeItem('postFilters');
});

function filterPosts({ city, type, priceRange, location, tab }) {
  if (!loadedPostsArray || loadedPostsArray.length === 0) {
    console.warn("No posts loaded to filter");
    return [];
  }

  const [minPrice, maxPrice] = priceRange && priceRange !== "Choose Price Range" 
    ? priceRange.split("-").map(Number) 
    : [null, null];

  return loadedPostsArray.filter(post => {
    const cityValue = post.propertyLocation?.toString().trim().toLowerCase() || "";
    const typeValue = post.propertyType?.toString().trim().toLowerCase() || "";
    const nameValue = post.propertyName?.toString().trim().toLowerCase() || "";
    const tabValue = post.propertyPurpose?.toString().trim().toLowerCase() || "";
    const priceStr = post.propertyPrice?.toString().replace(/[^0-9.]/g, '') || "0";
    const priceValue = parseFloat(priceStr) || 0;

    const shouldFilterCity = city && !["choose city", "choose location"].includes(city.toLowerCase());
    const shouldFilterType = type && type.toLowerCase() !== "choose property type";
    const shouldFilterLocation = location && location.trim() !== "";
    const shouldFilterTab = tab && tab.toLowerCase() !== "choose purpose";
    const shouldFilterPrice = minPrice !== null;

    const matches = {
      city: !shouldFilterCity || cityValue.includes(city.toLowerCase()),
      type: !shouldFilterType || typeValue.includes(type.toLowerCase()),
      location: !shouldFilterLocation || 
               nameValue.includes(location.toLowerCase()) || 
               cityValue.includes(location.toLowerCase()),
      price: !shouldFilterPrice || (priceValue >= minPrice && (!maxPrice || priceValue <= maxPrice)),
      tab: !shouldFilterTab || tabValue === tab.toLowerCase()
    };

    return Object.values(matches).every(Boolean);
  });
}

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
        img.style.border = "2px solid #7065F0"
        img.classList.add("rounded", "shadow");
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
    document.getElementById('propertyBedroom').textContent = post.bedroom;
    document.getElementById('propertyBathroom').innerHTML = `<p><strong>&#8358;${post.bathroom}</strong></p>`;

    const button = document.getElementById("applyBtn");
    button.setAttribute("data-post-id", post.postId || post.id || '');
    button.setAttribute("data-owner-id", post.userId || post.postedById || '');
    
    popOut.style.display = "flex";
}


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

  // Trim the IDs just in case
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


closeBtn.addEventListener('click', () => {
  popOut.style.display = "none";
});

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("showPopOut")) {
    popOut.style.display = "flex";      
  }
});

document.getElementById("closeAppModal").addEventListener("click", () => {
  document.getElementById('applicationModal').style.display = "none";
});

document.getElementById("applyFilters").addEventListener("click", function(e) {
  e.preventDefault();
  const filters = {
    city: document.getElementById("filterCity").value,
    type: document.getElementById("filterType").value,
    priceRange: document.getElementById("filterPrice").value,
    location: document.getElementById("globalSearch").value
  };
  const filtered = filterPosts(filters);
  renderAllPosts(filtered, filters);
});