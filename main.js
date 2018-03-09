var userArray = [];
var projectArray = [];
var sprintArray = [];
var issueArray = [];
var commentArray = [];
var statusArray = ["New", "In progress", "Feedback", "Rework", "Resolved", "Ready for Testing"];

//nodes to create project
var projectNameInput = document.getElementById("projectField");
var createPrjButton = document.getElementById("projectCreateBtn");
var projectList = document.getElementById("selectProject");

//nodes to create user
var userNameInput = document.getElementById("userField");
var createUserButton = document.getElementById("userCreateBtn");
var userList = document.getElementById("selectUser");

//nodes to create Sprints
var addNewSprint = document.getElementById("addNewSprint");
var sprintMenu = document.getElementById("sprintMenu");
var sprintCreateButton = document.getElementById("sprintCreateBtn");

//node to show project tree
var contentTree = document.getElementById("listColumn");

//nodes to create Issues
var showIssueCreate = document.getElementById("showIssueCreate");
var showIssueOption = document.getElementById("issueSettings");
var addNewIssue = document.getElementById("addIssue");

// node to populate Table
var table = document.getElementById("issueTable");


var selectedSprintTabID = "";
var selectedUserID = -1;
var rowIndex = 0;



class User {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    get getUserId() {
        return this.id;
    }
    get getUserName() {
        return this.name;
    }
}

class Project {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.sprints = [];

        this.setUpdateProjectSprints = function (sprintID) { this.sprints.push(sprintID); };
    }
    get getProjectId() {
        return this.id;
    }
    get getProjectName() {
        return this.name;
    }
    get getProjectSprints() {
        return this.sprints;
    }

}


class Issue {
    constructor(id, type, name, sprint, createdBy, assignee, description, status, updateAt, createdAt) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.sprint = sprint;
        this.createdBy = createdBy;
        this.assignee = assignee;
        this.description = description;
        this.status = status;
        this.tasks = [];
        this.comments = [];
        this.updateAt = updateAt;
        this.createdAt = createdAt;
        this.setIssueStatus= function(newStatus){
            this.status = newStatus;
        };
        this.setCommentAdd= function(commentId){
            this.comments.push(commentId);
        };
        this.setTaskAdd= function(taskID){
            this.tasks.push(taskID);
        };
        this.setUpdateDate= function(newDate){
            this.updateAt = newDate;
        };
  
    }
    get getIssueId() {
        return this.id;
    }
    get getIssueType() {
        return this.type;
    }
    get getIssueName() {
        return this.name;
    }
    get getIssueSprint() {
        return this.sprint;
    }
    get getIssueCreatedBy() {
        return this.createdBy;
    }
    get getIssueAssigne() {
        return this.assignee;
    }
    get getIssueDescription() {
        return this.description;
    }
    get getIssueStatus() {
        return this.status;
    }
    get getIssueSubTasks() {
        return this.task;
    }
    get getIssueComments() {
        return this.comments;
    }
    get getIssueUpdatedDate() {
        return this.updateAt;
    }
    get getIssueCreatedDate() {
        return this.createdAt;
    }

    

}


class Sprint {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    get getSprintId() {
        return this.id;
    }
    get getSprintName() {
        return this.name;
    }

}

class Comments {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    get getCommentId() {
        return this.id;
    }
    get getCommentName() {
        return this.name;
    }
}



function createNewUser(name) {
    var userID = userArray.length + 1;
    var user = new User(userID, name);
    userArray.push(user);
}

function createNewProject(name) {
    var projectID = projectArray.length + 1;
    var project = new Project(projectID, name);
    projectArray.push(project);
}

function createNewSprint(name) {
    var sprintID = sprintArray.length + 1;
    var sprint = new Sprint(sprintID, name);
    sprintArray.push(sprint);
}

function connectSprint(project, sprint) {
    var pushSprintID = sprint.getSprintId;
    project.setUpdateProjectSprints(pushSprintID);
}

function listProjectSprint(project) {
    var string = " ";
    for (i = 0; i < project.sprints.length; i++) {
        string = string + project.sprints[i] + " ";
    }
    return string;
}

function createTree(name, nodeID, type, id) {
    var sprintTree = document.createElement(type);
    sprintTree.innerHTML = name;
    sprintTree.setAttribute("id", id);

    nodeID.appendChild(sprintTree);
}

// creates an user and it is added to the user select list; 
createUserButton.onclick = function () {
    var username = userNameInput.value;
    if (username !== "" && username !== " ") {
        createNewUser(username);
        var opt = document.createElement("option");
        opt.value = userList.length;
        opt.innerHTML = username;
        userList.appendChild(opt);
        userList.selectedIndex = userList.length - 1;
        selectedUserID = userList.length - 1;
        userNameInput.value = "";
    } else {
        window.alert("Please enter username");
    }
};


// creates a project, and it is added to project select list, when project is created it selected
createPrjButton.onclick = function () {    
    var projectname = projectNameInput.value;
    if (userArray.length!==0){
    if (projectname !== "" && projectname !== " ") {
        createNewProject(projectname);                                          //creates the project and add to the projectArray
        var opt = document.createElement('option');
        opt.value = projectList.length;
        opt.innerHTML = projectname;
        projectList.appendChild(opt);
        projectList.selectedIndex = projectList.length - 1;
        var projectid = "project" + projectname + "_" + projectList.selectedIndex;
        createTree(projectname, contentTree, "UL", projectid);
        projectNameInput.value = "";
    } else {
        window.alert("Please enter the name of the Project");        
        /* testing getParentTasks function
                var task1=[1,2,3,4,5,6,7];
                var task2=[1,3,5,7];
                window.alert(task2.toString());
                window.alert("parent tasks Id:" getNotMatchingItemsTwoArray(task1,task2).toString());*/
    }
   }else{
     window.alert("Please Create a User First");      
   }
};




// will show the option to create a sprint
addNewSprint.onclick = function () {
    var selectedProjectId = projectList.selectedIndex;
    if (selectedProjectId > 0) {
        document.getElementById("sprintField").style.visibility = "visible";
        document.getElementById("sprintCreateBtn").style.visibility = "visible";
    } else {
        window.alert("please select a project first");
    }
};


// creates a sprint and adds to the project
sprintCreateButton.onclick = function () {
    var name = document.getElementById("sprintField").value;
    var tablength = sprintMenu.children.length;
    if (name !== "") {
        document.getElementById("sprintField").style.visibility = "hidden";
        document.getElementById("sprintCreateBtn").style.visibility = "hidden";

        var tab = document.createElement("LI");
        var aNode = document.createElement("A");
        aNode.setAttribute("class", "aSprintTab");
        aNode.setAttribute("onclick", "manageSprintMenu(this)");
        aNode.setAttribute("id", '"sprint-' + name + "_" + (tablength - 1) + '"');
        aNode.innerHTML = name;
        tab.appendChild(aNode);
        sprintMenu.insertBefore(tab, sprintMenu.childNodes[tablength - 1]);

        manageSprintMenu(sprintMenu.children[tablength - 1].children[0]);

        var selectedProjectId = projectList.selectedIndex;
        createNewSprint(name);
        var project = projectArray[selectedProjectId - 1];
        var sprint = sprintArray[sprintArray.length - 1];
        connectSprint(project, sprint);

        //setting up the tree
        var projectname = project.getProjectName;
        var nodeID = "project" + projectname + "_" + selectedProjectId;
        var node = document.getElementById(nodeID);
        var sprintID = "sprint" + name + "_" + (tablength - 1);
        createTree(name, node, "UL", sprintID);
        document.getElementById("sprintField").value = "";


    } else {
        window.alert("Please enter sprintname");
    }
};

function getNotMatchingItemsTwoArray(alltasks,subtasks){
    // getting all tasks
    var i=0;          //iterating the alltask
    var j=0;          //iterating the subtastk                     
    var n=0;          //iterating the parenttask
    var parenttasks=[];
    subtasks.sort();
    for(i=0;i<alltasks.length;i++){
        if(alltasks[i]===subtasks[j]){            
            j++;
        }else{
            parenttasks[n]=alltasks[i];
                n++;
        }
    }
    
    return parenttasks;
}

function getParentTasksIds(){
    var i;
    var allSubTaskID=[];
    var subTaskID=[];
    var parentTasksID=[];
    var allTasksID=[];    
        
           // getting all subtasks ids
          for (i=0;i<issueArray.length;i++){
             var subtask=[];
             subtask=issueArray[i].getIssueSubTasks;
            if (typeof subtask!=="undefined"&&subtask.type!=="null"){
              allSubTaskID=subTaskID.concat(subtask);
              subTaskID=allSubTaskID;  
            }
          }
          //getting all tasks ID
            for (i=0;i<issueArray.length;i++){
              allTasksID[i]=i+1;
             }
             
          if(allTasksID.length>0){
            if(allSubTaskID.length>0){
                parentTasksID=getNotMatchingItemsTwoArray(allTasksID,subTaskID);
             }
             else{
               parentTasksID= allTasksID; 
             }
                 
     return parentTasksID;     
}
}


//show add issue form, and complete the data
showIssueCreate.onclick = function () {

    if (selectedSprintTabID !== "") {
        var selectAssigne = document.getElementById("selectIssueAssigne");
        for (i = 0; i < userArray.length; i++) {
            var opt = document.createElement("option");
            opt.value = userArray[i].getUserId;
            opt.innerHTML = userArray[i].getUserName;
            selectAssigne.appendChild(opt);
        }


        /// need to getParentIssues to  populate table, paret Issues are those which ID's are not present in any issue.task;
        
        var parentTaskID=getParentTasksIds();
        if(typeof parentTaskID!=="undefined"&&typeof parentTaskID!=="null"){
            var selectParentIssue = document.getElementById("selectParentIssue");
             for (i = 0; i < parentTaskID.length; i++) {
                    var opt1 = document.createElement("option");
                    opt1.value = issueArray[parentTaskID[i]-1].getIssueName.getIssueId;
                    opt1.innerHTML = issueArray[parentTaskID[i]-1].getIssueName;
                    selectParentIssue.appendChild(opt1);
                }
        }
        else{
              window.alert("No issues yet"); 
          }
          
        document.getElementById("newIssueContainer").style.visibility = "visible";
    } else {
        window.alert("Please select a sprint");
    }
 };


addNewIssue.onclick = function () {
    var errorResponce = "Please enter ";
    var issueName = document.getElementById("isseuField");
    var name = issueName.value;
    if (name === "" || name === " ") {
        errorResponce += "name ";
    }
    var selType = document.getElementById("selectIssueType");
    var typeText = selType.options[selType.selectedIndex].text;
    if (typeText === "-Type-") {
        errorResponce += "type ";
    }
    var issueDescription = document.getElementById("newIsseuDescription");
    var dscp = issueDescription.value;
    if (dscp === "" || dscp === " ") {
        errorResponce += "description ";
    }
    var selAssigne = document.getElementById("selectIssueAssigne");
    var assegnee = selAssigne.options[selAssigne.selectedIndex].text;
    if (assegnee === "-Assigned-") {
        errorResponce += "assignee ";
    }
    var assegneID = selAssigne.selectedIndex;
    var sprintID = getSprintTabID(selectedSprintTabID);
    var userID = userList.selectedIndex;
    var commentTextArea= document.getElementById("newComment");
    var commentText=commentTextArea.value;

    if (errorResponce.length === 13) {
        createNewIssue(name, typeText, assegneID, dscp, sprintID, userID);
       
        if (commentText!==""||commentText!==" "){
            createNewCommment(commentText);
            connectComments(commentArray[commentArray.length-1],issueArray[issueArray.length-1]);
        } 
        
        rowIndex=issueArray.length;        
        selType.selectedIndex=0;
        selAssigne.selectedIndex=0;
        var i;
        var assigneItems=selAssigne.childElementCount;
        for (i=1;i<assigneItems;i++){
            selAssigne.remove(1);
        };
        addIssueToTable();
        
        
        //resets the create form
        issueName.value="";
        issueDescription.value="";
        commentTextArea.value="";
        
        document.getElementById("newIssueContainer").style.visibility = "hidden";
        document.getElementById("myDropdown").style.visibility="hidden";
      
    } else {
        window.alert(errorResponce);
    }
};



function connectComments(comment, issue) {
    var commentID = comment.getCommentId;
    issue.setCommentAdd(commentID);
}


function createNewIssue(name, type, assigneeID, description, sprintID, userID) {
    var issueID = issueArray.length + 1;
    var d = new Date();
    var issue = new Issue(issueID, type, name, sprintID, userID, assigneeID, description, "New", d, d);
    issueArray.push(issue);
    
}

function getCommentNameFromID(array){
    result="";
    var i;
    for (i=0;i<array.length;i++){
        result+=commentArray[array[i]-1].getCommentName+'\n';
    }
    return result;
}

function addIssueToTable() {
    var getissueID = issueArray.length - 1;
    var row = table.insertRow(table.rows.length - 1);
    row.setAttribute("onclick","manageIssue(this)");
    
    //getting all the subtask ids
    
    
    var issueName = row.insertCell(0);
    var subTask = row.insertCell(1);
    var type = row.insertCell(2);
    var status = row.insertCell(3);
    var descriptions = row.insertCell(4);
    var comments = row.insertCell(5);
    var assigned = row.insertCell(6);
    var created = row.insertCell(7);
    var updated = row.insertCell(8);
    var issueID = row.insertCell(9);
    //issueID.style.display="none";
    
    

    var assigneName = userArray[issueArray[getissueID].getIssueAssigne - 1].getUserName;
    var createdName = userArray[issueArray[getissueID].getIssueCreatedBy - 1].getUserName;
    var update = issueArray[getissueID].getIssueUpdatedDate.toISOString();
    var commentsIds=issueArray[getissueID].getIssueComments;
    var commentsContent=getCommentNameFromID(commentsIds);
    
   // var subTaskIds=issueArray[getissueID].getIssueSubTasks;
    
    
    
    issueName.innerHTML = issueArray[getissueID].getIssueName;
    type.innerHTML = issueArray[getissueID].getIssueType;
    status.innerHTML = issueArray[getissueID].getIssueStatus;
    descriptions.innerHTML = issueArray[getissueID].getIssueDescription;
    assigned.innerHTML = assigneName;
    created.innerHTML = createdName;
    issueID.innerHTML = issueArray[getissueID].getIssueId;
    updated.innerHTML = update;
    comments.innerHTML =commentsContent;
    
   // subTask.innerHTML =issueArray[getissueID].;
    
}

function manageIssue(obj) {
    document.getElementById("myDropdown").style.visibility="visible";
    rowIndex = obj.rowIndex;

}

function getSprintTabID(tabID) {
    var pos = tabID.indexOf("_");
    var sprintTabID = tabID.slice(pos);
    return sprintTabID;
}





function createNewSubTask(name, assigneName, description, userID, sprintID) {
    var issueID = issueArray.length + 1;
    var assigneeId = getAssignee(assigneName);
    var parentIssue = issueArray[0];
    var issue = new Issue(issueID, "TASK", name, sprintID, userID, assigneeId, description, "New", Date.now, Date.now);
    parentIssue.addNewParentTaskId(issue.getIssueId());
    issueArray.push(issue);
}



function createNewCommment(name) {
    var commentID = commentArray.length + 1;
    var comment = new Comments(commentID, name);
    commentArray.push(comment);
}




function issueToString(issue) {
    return "Issue " + issue.id + " " + issue.type + " " + issue.name + " " + issue.sprint + " " + issue.createdBy + " " + issue.assignee + " " + issue.description + " " + issue.status + issue.createdBy + " " + issue.comments[0] + " PTASK " + issue.tasks[0];
}



function manageSprintMenu(obj) {
    var sprintTabsList = document.getElementsByTagName("a");
    var i;
    for (i = 0; i < sprintTabsList.length; i++) {
        sprintTabsList[i].className = "sprintTabs";
    }
    obj.className = "active";
    selectedSprintTabID = obj.id;
}




