let count;
let countLocalStorage = JSON.parse(localStorage.getItem('count'));
count = countLocalStorage;
if (count == null){
  count = 0;
}
let closeCount;
let closeCountStorage = JSON.parse(localStorage.getItem('closeCount'));
closeCount = closeCountStorage;
if (closeCount == null){
  closeCount = 0;
}

document.getElementById('issueInputForm').addEventListener('submit', submitIssue);

function submitIssue(e) {
  count++;
  localStorage.setItem('count',JSON.stringify(count));

  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const id = Math.floor(Math.random()*100000000) + '';
  const status = 'Open';

  const issue = { id, description, severity, assignedTo, status};
  let issues = [];
  if (localStorage.getItem('issues')){
    issues = JSON.parse(localStorage.getItem('issues'));
  }
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));

  document.getElementById('issueInputForm').reset();
  fetchIssues();
  e.preventDefault();
}

const closeIssue = (id , e) => {
  closeCount++;
  localStorage.setItem('closeCount',JSON.stringify(closeCount));
  console.log(closeCount);

  const issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find(issue => parseInt(issue.id) === id);
  currentIssue.status = 'Closed';
  localStorage.setItem('issues', JSON.stringify(issues));

  fetchIssues();

  e.preventDefault();
}

const deleteIssue = (id, e) => {
  const issues = JSON.parse(localStorage.getItem('issues'));
  const currentIssue = issues.find(issue => parseInt(issue.id) === id);
  if(currentIssue.status === "Closed"){
    const remainingIssues = issues.filter(issue => issue.id !== (id+"") );
    //document.getElementById(`issue-card-${id}`).style.display = "none";
    localStorage.setItem('issues', JSON.stringify(remainingIssues));
  }
  else alert("Close the issue first");

  fetchIssues();
  e.preventDefault();
}

const fetchIssues = () => {
  let countLocalStorage = JSON.parse(localStorage.getItem('count'));
  const issueCount = document.getElementById('issue-count');
  issueCount.innerText = countLocalStorage;

  let closeCount = JSON.parse(localStorage.getItem('closeCount'));
  const issueClose = document.getElementById('issue-close');
  issueClose.innerText = countLocalStorage - closeCount;

  const issues = JSON.parse(localStorage.getItem('issues'));
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  for (let i = 0; i < issues.length; i++) {
    const {id, description, severity, assignedTo, status} = issues[i];

    issuesList.innerHTML += ` <div id="issue-card-${id}" class="well">
                              <h6>Issue ID: ${id} </h6>
                              <p><span class="label label-info"> ${status} </span></p>
                              <h3 class="${status}"> ${description} </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              <a href="#" onclick="closeIssue(${id}, event)" class="btn btn-warning ${status}1">Close</a>
                              <a href="#" onclick="deleteIssue(${id}, event)" class="btn btn-danger">Delete</a>
                              </div>`;
  }
}