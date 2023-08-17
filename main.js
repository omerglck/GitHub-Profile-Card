import { elements } from "./JS/helpers.js";

const url = "https://api.github.com/users/";

//* API'a istek atıp gelen verileri aktarma
async function getUser(userName) {
  try {
    // axios ile api'a istek atık sonuna kullanıcın girdiği kullanıcı adını ekleyerek kullanıcın bilgilerini aldık.
    const data = await axios(url + userName);
    // kullanıcının bilgilerini ekrana aktarmak için createUserCard fonksiyonuna aktardık.
    createUserCard(data);
    getRepos(userName);
  } catch (err) {
    createErrorCard("Kullanıcı bulunamadı!");
  }
}

elements.form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = elements.search.value;

  if (user) {
    // Kullanıcıdan aldığımız kullanıcı adını axios ile api'a istek attık.
    getUser(user);
    elements.search.value = "";
  }
});

//* Aratılan kullanıcının bilgilerini ekrana aktarma
function createUserCard(user) {
  console.log(user);
  const userName = user.data.name || user.data.login;
  const userBio = user.data.bio ? `<p>${user.data.bio}</p>` : "";
  const card = `
    <div class="card">
        <img
        class="user-image"
        src=${user.data.avatar_url}
        alt=${user.data.name}
        />
        <div class="user-info">
        <div class="user-name">
            <h2>${userName}</h2>
            <small>@${user.data.login}</small>
        </div>
        </div>
        <p>${userBio}</p>
        <ul>
        <li><i class="bi bi-people"></i> ${user.data.followers} <strong>Followers</strong></li>
        <li> ${user.data.following} <strong>Following</strong></li>
        <li>
            <i class="bi bi-bookmark-fill"></i> ${user.data.public_repos} <strong>Repository</strong>
        </li>
        </ul>
        <div class="repos" id="repos">

        </div>
    </div>
    `;
  elements.main.innerHTML = card;
}

//* Kullanıcı bulunamadığı zaman ekrana aktaracağımız fonksiyon
function createErrorCard(msg) {
  const cardError = `
        <div class="card" style="color:white">
            <h2>${msg}</h2>

        </div> 
    `;
  elements.main.innerHTML = cardError;
}

//* Repoları api ile alırız
async function getRepos(userName) {
  try {
    // axios ile url'e kullanıcıdan aldığımız kullanıcı adı ve repos'u ekleriz ve repolara ulaşırız
    const response = await axios(url + userName + "/repos");
    const repos = response.data; // Veriyi repos değişkenine atadık
    addReposToCard(repos);
  } catch (err) {
    console.log(err);
    createErrorCard("Repoları alırken hata oluştu");
  }
}

function addReposToCard(repos) {
  console.log(repos);
  const reposEle = document.getElementById("repos");

  repos.slice(0, 5).forEach((repo) => {
    const reposLink = document.createElement("a");
    reposLink.href = repo.html_url;
    reposLink.target = "_blank";
    reposLink.innerHTML = `<i class="bi bi-journal"></i> ${repo.name}`;

    reposEle.appendChild(reposLink);
  });
}
// Ekranı temizleme işlemei
const deleteBtn = document.querySelector(".delete");
deleteBtn.addEventListener("click", () => (elements.main.innerHTML = ""));
