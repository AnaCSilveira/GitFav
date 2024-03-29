import { GithubUser } from "./GithubUser.js";

//Classe que vai criar a logica dos dados
//Como os dados serão estruturados

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(userName) {
    try {
      const userExists = this.entries.find((entry) => entry.login === userName);

      if (userExists) {
        throw new Error("Usuário ja cadastrado!");
      }

      const user = await GithubUser.search(userName);
      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (Error) {
      alert(Error.message);
    }
  }

  delete(user) {
    const filterEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filterEntries;
    this.update();
    this.save();
  }
}

//classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.creatRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;

      row.querySelector(".user img").alt = `imagem de ${user.name}`;

      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar esta linhas?");
        if (isOk) {
          this.delete(user);
        }
      };
      this.tbody.append(row);
    });
  }

  creatRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    
            <td class="user">
              <img
                src="https://github.com/AnaCSilveira.png"
                alt="imagem de AnaCSilveira"
              />
              <a href="https://github.com/AnaCSilveira" target="_blank">
                <p>Ana Cristina</p>
                <span>AnaCSilveira</span>
              </a>
            </td>
            <td class="repositories">123</td>
            <td class="followers">1234</td>
            <td><button class="remove">Remover</button></td>
    
    `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
