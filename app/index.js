import "./styles/styles.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
const _ = require("lodash");
//TODO:
// 1. Dodać ikonę plusa
// 2. Przekminić jak wyświetlać zagnieżdżoną tabelę

window.onload = () => {
  getAPIAsync("users").then(users => {
    getAPIAsync("companies").then(companies => {
      companies = parseData(companies, users);
      loadTableWithData(companies);
    });
  });
};

async function getAPIAsync(param) {
  let response = await fetch(`http://localhost:3000/${param}`);
  let data = await response.json();
  return data;
}

function parseData(companies, users) {
  _.map(companies, function(company) {
    company.users = _.filter(users, function(user) {
      return company.uri === user.uris.company;
    });
    company.userCount = company.users.length;
  });
  companies = _.orderBy(companies, "userCount", "asc");
  return companies;
}

function loadTableWithData(data) {
  let tableHtml = `<table class="table">
  <thead class="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Company</th>
      <th scope="col">Number of users</th>
    </tr>
  </thead>
  <tbody>`;

  let rowNo = 1;
  _.map(data, function(d) {
    tableHtml += `<tr>
                    <th scope="row">${rowNo}</th>
                    <td>${d.name}</td>
                    <td>${d.userCount}</td>
                  </tr>`;
    rowNo += 1;
  });

  tableHtml += `</tbody>
              </table>`;

  var tableContener = document.getElementById("table-content");
  tableContener.innerHTML = tableHtml;
}
