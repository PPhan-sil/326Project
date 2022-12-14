import { api } from './api.js';
import { utils } from './utils.js';
export const profile = {
  init: async (user) => {
    const userStats = await api.fetchGET("api/users/" + user._id + "/stats");
    const statHTMl = await utils.loadTemplate('../components/templates/stats.html', {
      commits: userStats.reduce((acc, e) => acc += e.chatCommits, 0),
      uptime: Math.round(userStats.reduce((acc, e) => acc += e.duration, 0) / 60000),
    });
    document.getElementById("stats").appendChild(statHTMl.body.firstChild);
    const projects = await api.fetchGET('api/projects/author/' + user._id);
    const userComments = await api.fetchGET('api/comments/author/' + user._id);

    const pfp = document.getElementById("pfp");
    const username = document.getElementById("username");
    const likes = document.getElementById("likes");
    const totalPosts = document.getElementById("totalPosts");
    const comments = document.getElementById("comments");
    const created = document.getElementById("created");
    pfp.src = user.avatar;
    username.innerHTML = user.username;
    likes.innerHTML += projects.reduce((acc, e) => acc += e.likes.length, 0) + " Likes";
    totalPosts.innerHTML += projects.length + " Projects";
    comments.innerHTML += userComments.length + " Comments";
    const createDate = new Date(user.dateCreated.toString().substring(0, 10));
    created.innerHTML += createDate.toDateString();

    const posts = document.getElementById("posts");

    await projects.forEach(async (project, idx) => {
      const ranking = await api.fetchGET("api/projects/" + project._id + "/topContributors");
      const newCard = await utils.loadTemplate('../components/templates/profileCard.html', {
        projectID: `project-${project._id}`,
        title: project.title,
        content: project.content.substring(0, 100) + ((project.content.length > 100) ? "..." : ""),
        comments: project.comments.length,
        likes: project.likeNumber,
        rank1User: (ranking[0]) ? ranking[0].username : '-',
        rank1Avatar: (ranking[0]) ? ranking[0].avatar : '',
        rank1Score: (ranking[0]) ? ranking[0].commentCount : '-',
        rank2User: (ranking[1]) ? ranking[1].username : '-',
        rank2Avatar: (ranking[1]) ? ranking[1].avatar : '',
        rank2Score: (ranking[1]) ? ranking[1].commentCount : '-',
        rank3User: (ranking[2]) ? ranking[2].username : '-',
        rank3Avatar: (ranking[2]) ? ranking[2].avatar : '',
        rank3Score: (ranking[2]) ? ranking[2].commentCount : '-',
      });


      function toProject() {
        return () => window.location.href = "../project?=" + project._id;
      }

      newCard.getElementById('title').addEventListener("click", toProject(project._id));
      newCard.getElementById('content').addEventListener("click", toProject(project._id));

      posts.appendChild(newCard.body.firstChild);
    });

  }
}
