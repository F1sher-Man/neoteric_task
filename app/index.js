import './styles/styles.scss';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { filter, map, orderBy } from 'lodash';

window.onload = () => {
  fetchCompaniesData('users').then(users => {
    fetchCompaniesData('companies').then(companies => {
      let parsedCompanies = parseCompaniesWithUsers(companies, users);
      loadTableWithData(parsedCompanies);
    });
  });
};

async function fetchCompaniesData(param) {
  return fetch(`http://localhost:3000/${param}`).then(data => data.json());
}

function parseCompaniesWithUsers(companies, users) {
  map(companies, function (company) {
    company.users = filter(users, function (user) {
      return company.uri === user.uris.company;
    });
    company.userCount = company.users.length;
  });
  companies = orderBy(companies, 'userCount', 'asc');
  return companies;
}

function loadTableWithData(companies) {
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
  companies.forEach(company => {
    tableHtml += `<tr data-toggle="collapse" data-target=".comapny-${rowNo}">
                    <th scope="row">
                      <i class="fa fa-plus-square" id="icon"></i>${rowNo}
                    </th>
                    <td>${company.name}</td>
                    <td>${company.userCount}</td>
                  </tr>`;
    company.users.forEach(user => {
      tableHtml += `<tr class="collapse comapny-${rowNo}">
                      <th scope="row"></th>
                      <td>${user.name}</td>
                      <td>${user.email}</td>
                    </tr>`;
    });
    rowNo += 1;
  });

  tableHtml += `</tbody>
              </table>`;

  let tableContener = document.getElementById('table-content');
  tableContener.innerHTML = tableHtml;
}
