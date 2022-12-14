import { utils } from './utils.js';
import { api } from './api.js';
import { register } from './register.js';
import { feed } from './feed.js';
import { project } from './project.js';
import { dashboard } from './dashboard.js';
import { profile } from './profile.js';
import { canvas } from './canvas.js';
import { chat } from './chat.js';
import { index } from './index.js';
import { navbar } from './navbar.js';
import { login } from './login.js';
import { socket } from './socketInstance.js';


async function signBtn() {
  if (await api.isLoggedIn() === undefined) {
    await utils.loadModule(`../components/navLogin.html`, 'loginDiv');
    await utils.loadModule('../components/login.html', 'modals');
    login.init();
  } else {
    await utils.loadModule(`../components/navLogout.html`, 'logoutDiv');
    await utils.loadModule(`../components/navAccount.html`, 'nav-acc');
    document.getElementById('logoutBtn').addEventListener("click", async () => {
      window.localStorage.removeItem('token');
      window.location.href = "/";
    });
  }
}

const core = {
  init: async () => {
    await utils.loadModule('../components/navbar.html', 'navbar');
    await navbar.init();
    await utils.loadModule('../components/footer.html', 'footer');
    let route = window.location.pathname;

    signBtn();
    switch (route) {
      case "/":
        await utils.loadModule('../pages/index.html', 'content');
        await utils.loadAnimate({"top-projects":500});
        index.init();
        break;
      case "/register":
        await utils.loadModule('../pages/register.html', 'content');
        register.init();
        break;
      case "/feed":
        await utils.loadModule('../components/searchBar.html', 'topSearch');
        await utils.loadModule('../pages/feed.html', 'content');
        const toAnimate = { "post-tags": 250, "feed": 400};
        await utils.loadAnimate(toAnimate);
        await feed.init();
        break;
      case route.match(/^\/project\?*/)?.input:
        const projectData = await api.fetchGET('api/projects/' + window.location.search.substring(2));
        if (projectData !== undefined) {
          await utils.loadModule('../pages/project.html', 'content');
          const toAnimate = {"right-bar-card-body":300,"comments":500};
          await utils.loadAnimate(toAnimate);
          await project.init(projectData);
          break;
        }
      case route.match(/^\/profile\?*/)?.input:
        const profileData = await api.fetchGET('api/users/' + window.location.search.substring(2));
        if (profileData !== undefined) {
          await utils.loadModule('../pages/profile.html', 'content');
          await utils.loadAnimate({ "posts": 250 });
          profile.init(profileData);
          break;
        }
      case route.match(/^\/dashboard\?*/)?.input:
        const userData = await api.isLoggedIn();
        if (userData !== undefined) {
          await utils.loadModule('../pages/dashboard.html', 'content');
          await utils.loadModule('../components/changePassword.html', 'modals');
          await utils.loadModule('../components/deleteAccount.html', 'modals');
          await utils.loadModule('../components/deleteProject.html', 'modals');
          await utils.loadAnimate({ "posts": 250});
          dashboard.init(userData);
          break;
        } else {
          document.location.href = "/";
        }
      case route.match(/^\/canvas\?*/)?.input:
        // check if current user in canvas, if not add them to canvas
        // get user from await api.isLoggedin()
        const projectID = new URLSearchParams(window.location.search).get(""); 
        const user = await api.isLoggedIn();
        if(!user){
          console.log("User not logged in");
        }
        else if((await api.fetchGET(`api/canvas?user=${user._id}&project=${projectID}`)).length === 0){
          await api.fetchPOST("api/canvas",{
            project: projectID,
            user:user._id
          })
        }
        utils.setTitle("Canvas");
        document.getElementById("footer").style.display = "none";
        await utils.loadModule(`pages/canvas.html`, 'content');
        await utils.loadAnimate({
          "active-users-container": 300
        })
        await canvas.init(socket);
        await chat.init(socket);
        break;
      default:
        await utils.load404();
        break;
    }
  },
};

core.init();
