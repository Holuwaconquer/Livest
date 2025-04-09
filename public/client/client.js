let toggleBtn = document.querySelector('.toggle-btn')
let sidenav = document.getElementById('sidenav')
toggleBtn.addEventListener('click', ()=>{
    sidenav.classList.toggle('collapsed')
    // alert('working')

    let menuLink = document.querySelectorAll('.menu li a');
    menuLink.forEach(linkItem =>{
        let sidenavText = linkItem.querySelector('.sidenavText');
        let sidenavIcon = linkItem.querySelector('.sidenavIcon');

        let tooltips = document.querySelector('.tooltips')
        if(sidenav.classList.contains('collapsed')){
            sidenavText.style.display='none';
            // dashboard
            menuLink[0].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 21%; left: 85px; z-index: 1;">Dashboard</p>`
            })
            menuLink[0].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
            // property
            menuLink[1].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 30%; left: 85px; z-index: 1;">Property</p>`
            })
            menuLink[1].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
            // order
            menuLink[2].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 38%; left: 85px; z-index: 1;">Order</p>`
            })
            menuLink[2].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
            // manage client
            menuLink[3].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 46%; left: 85px; z-index: 1;">Manage Client</p>`
            })
            menuLink[3].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
            // inbox
            menuLink[4].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 55%; left: 85px; z-index: 1;">Inbox</p>`
            })
            menuLink[4].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
            // Admin Profile
            menuLink[5].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 63%; left: 85px; z-index: 1;">Admin Profile</p>`
            })
            menuLink[5].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
            // settings
            menuLink[6].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 71.5%; left: 85px; z-index: 1;">Settings</p>`
            })
            menuLink[6].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
            // Notification
            menuLink[7].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 79.5%; left: 85px; z-index: 1;">Notification</p>`
            })
            menuLink[7].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
            // Log out
            menuLink[8].addEventListener('mouseover', ()=>{
                tooltips.innerHTML =`<p style="Background-color: #333; font-size: 14px; color: white; padding:8px 15px;
                 position: absolute; top: 88%; left: 85px; z-index: 1; ">Log Out</p>`
            })
            menuLink[8].addEventListener('mouseout', ()=>{
                tooltips.innerHTML=""
            })
        }else{
            sidenavText.style.display='';
            tooltips.innerHTML=""
        }
    });
});

document.addEventListener('DOMContentLoaded', ()=>{
    let lastPage = localStorage.getItem("lastPage") || "./dashboardpage/dashboard.html";
    loadPage(lastPage);
    function loadPage(page){
        let mainPage = document.getElementById('mainPage')
        setTimeout(() =>{
            fetch(page)
            .then(response => response.text())
            .then(data =>{
                mainPage.innerHTML= data;
                localStorage.setItem("lastPage", page);
            })
            .catch(error =>{
                console.error("Error loading page:", error);   
            })
        }, 1000);
    }
    document.querySelectorAll('.menu a').forEach(link =>{
        link.addEventListener('click', function(e){
            e.preventDefault();
            document.querySelectorAll('.menu li').forEach(item => item.classList.remove('active'));
            this.parentElement.classList.add('active');
            loadPage(this.getAttribute('data-page'))
        })
    });
    // loadPage('../admin/dashboard-pages/admindashboard.html')
})
