import "./styles/styles.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

const _ = require("lodash");

window.onload = () => {
  getAPIAsync("users").then(users => {
    getAPIAsync("companies").then(companies => {
      let parsedCompanies = parseData(companies, users);
      loadTableWithData(parsedCompanies);
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
    tableHtml += `<tr data-toggle="collapse" data-target=".comapny-${rowNo}">
                    <th scope="row">
                      <i class="fa fa-plus-square" id="icon"></i>${rowNo}
                    </th>
                    <td>${d.name}</td>
                    <td>${d.userCount}</td>
                  </tr>`;
    _.map(d.users, function(u) {
      tableHtml += `<tr class="collapse comapny-${rowNo}">
                      <th scope="row"></th>
                      <td>${u.name}</td>
                      <td>${u.email}</td>
                    </tr>`;
    });
    rowNo += 1;
  });

  tableHtml += `</tbody>
              </table>`;

  var tableContener = document.getElementById("table-content");
  tableContener.innerHTML = tableHtml;
}
