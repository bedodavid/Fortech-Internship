var userArray = [];
var projectArray = [];
var sprintArray = [];
var issueArray = [];
var commentArray = [];


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
var cancelSprintCreation = document.getElementById("sprintCancel");

//node to show project tree
var contentTree = document.getElementById("listColumn");

//nodes to create Issues
var showIssueCreate = document.getElementById("showIssueCreate");
var showIssueOption = document.getElementById("issueSettings");
var addNewIssue = document.getElementById("addIssue");
var selectParentIssue = document.getElementById("selectParentIssue");
var cancelIssueCreation = document.getElementById("issueCancel");

//nodes to updates Issues
var showIssueUpdate = document.getElementById("showIssueUpdate");
var updateIssueBtn=document.getElementById("updateIssue");
var hideManageBtn = document.getElementById("howIssueHide");
var filterStatusBtn = document.getElementById("filterStatusBtn");
var filterCancelBtn = document.getElementById("filterCancelBtn");
var selectSprintToMove = document.getElementById("selectSprintIssue");



// Nodes.'s to populate  and management Table
var table = document.getElementById("issueTable");
var commentTextArea = document.getElementById("newComment");
var statusColumFilter = document.getElementById("statusColhead");
var filterStatusContainer = document.getElementById("filterStatusContainer");
var filterStatusSelect = document.getElementById("filterStatusSelect");






var parentTaskIDs = [];
var selectedSprintTabID = 0;
var selectedUserID = -1;
var rowIndex = 0;




// objects to be used
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

        this.setUpdateProjectSprints = function (sprintID) {
            this.sprints.push(sprintID);
        };
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
        
        this.setIssueName =function (newName){
           this.name = newName;  
        };        
        this.setIssueSprint =function (newSprint){
           this.sprint = newSprint;  
        };
         this.setIssueType =function (newType){
           this.type = newType;  
        };
        this.setIssueAssegnee =function(newAssigne){
           this.assignee=newAssigne; 
        };
         this.setIssueDescription =function (newDescription){
           this.description = newDescription;  
        };
        this.setIssueStatus = function (newStatus) {
            this.status = newStatus;
        };
        this.setCommentAdd = function (commentId) {
            this.comments.push(commentId);
        };
        this.setTaskAdd = function (taskID) {
            this.tasks.push(taskID);
        };

        this.setUpdateDate = function (newDate) {
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
        return this.tasks;
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


/// methods creating Objects
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

function createNewIssue(name, type, assigneeID, description, sprintID, userID) {
    var issueID = issueArray.length + 1;
    var d = new Date();
    var issue = new Issue(issueID, type, name, sprintID, userID, assigneeID, description, "New", d, d);
    issueArray.push(issue);

}


function createNewCommment(name) {
    var commentID = commentArray.length + 1;
    var comment = new Comments(commentID, name);
    commentArray.push(comment);
}


// methods connecting objects 
function connectSprint(project, sprint) {
    var pushSprintID = sprint.getSprintId;
    project.setUpdateProjectSprints(pushSprintID);
}

function connectComments(comment, issue) {
    var commentID = comment.getCommentId;
    issue.setCommentAdd(commentID);
}




//methods connecting and managing the forms of the  UI

function getIDFromStringID(tabID) {
    
    var pos = tabID.indexOf("_");
    var elementTabID = tabID.slice(pos + 1, (tabID.length - 1));
    return elementTabID;
    
}

function createTree(name, nodeID, type, id) {
    var sprintTree = document.createElement(type);
    sprintTree.innerHTML = name;
    sprintTree.setAttribute("id", id);

    nodeID.appendChild(sprintTree);
}

function listProjectSprint(project) {
    var string = " ";
    for (i = 0; i < project.sprints.length; i++) {
        string = string + project.sprints[i] + " ";
    }
    return string;
}

function getTime(date) {
    var hour = (date.getHours() < 10 ? '0' : '') + date.getHours(),
            minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    return (hour + ":" + minutes);
}

function getDate(date) {
    var year = date.getFullYear(),
            month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1),
            day = ((date.getDate) < 10 ? '0' : '') + date.getDate();

    return (year + "-" + month + "-" + day);
}

function getNotMatchingItemsTwoArray(alltasks, subtasks) {
    // getting all tasks
    var i = 0;          //iterating the alltask
    var j = 0;          //iterating the subtastk                     
    var n = 0;          //iterating the parenttask
    var parenttasks = [];
    subtasks.sort();
    for (i = 0; i < alltasks.length; i++) {
        if (alltasks[i] === subtasks[j]) {
            j++;
        } else {
            parenttasks[n] = alltasks[i];
            n++;
        }
    }
    return parenttasks;
}


// Get just the IDs of the Parent Type Issues
function getParentTasksIds() {
    var i,
    allSubTaskID = [],
    subTaskID = [],
    parentTasksID = [],
    allTasksID = [],
    returnTasksID = [];

    // getting all subtasks ids
    for (i = 0; i < issueArray.length; i++) {
        var subtask = [];
        subtask = issueArray[i].getIssueSubTasks;
        if (typeof subtask !== "undefined" && subtask.type !== "null") {
            allSubTaskID = subTaskID.concat(subtask);
            subTaskID = allSubTaskID;
        }
    }
    //getting all tasks ID
    for (i = 0; i < issueArray.length; i++) {
        allTasksID[i] = i + 1;
    }

    if (allTasksID.length > 0) {
        if (allSubTaskID.length > 0) {
            parentTasksID = getNotMatchingItemsTwoArray(allTasksID, subTaskID);
        } else {
            parentTasksID = allTasksID;
        }

        for (i = 0; i < parentTasksID.length; i++) {
            var issueType = issueArray[parentTasksID[i] - 1].getIssueType;
            if (issueType !== "Task") {
                returnTasksID.push(parentTasksID[i]);
            }
        }
        return returnTasksID;
    }
}

function getCommentNameFromID(array) {
    result = "";
    var i;
    for (i = 0; i < array.length; i++) {
        result += commentArray[array[i] - 1].getCommentName + '\n';
    }
    return result;
}


function addIssueToTable(isSubtask, insertRow) {
    var getissueID = issueArray.length - 1;
    var row = table.insertRow(insertRow);
    row.setAttribute("onclick", "manageIssue(this)");

    //getting all the subtask ids
    var issueName = row.insertCell(0);
    var type = row.insertCell(1);
    var status = row.insertCell(2);
    var descriptions = row.insertCell(3);
    var comments = row.insertCell(4);
    var assigned = row.insertCell(5);
    var created = row.insertCell(6);
    var updated = row.insertCell(7);
    var issueID = row.insertCell(8);
    issueID.style.display="none";

    if (isSubtask) {
        issueName.setAttribute("class", "subIssueCol");
    } else {
        issueName.setAttribute("class", "issueCol");
    }

    type.setAttribute("class", "typeCol");
    status.setAttribute("class", "statusCol");
    descriptions.setAttribute("class", "descCol");
    comments.setAttribute("class", "commCol");
    assigned.setAttribute("class", "asgCol");
    created.setAttribute("class", "crtCol");
    updated.setAttribute("class", "updCol");
    issueID.setAttribute("class", "issueColD");
    //issueID.style.display = "none";

    var assigneName = userArray[issueArray[getissueID].getIssueAssigne - 1].getUserName;
    var createdName = userArray[issueArray[getissueID].getIssueCreatedBy - 1].getUserName;
    var updateTime = issueArray[getissueID].getIssueUpdatedDate,
            update = getDate(updateTime) + " / " + getTime(updateTime);

    var commentsIds = issueArray[getissueID].getIssueComments;
    var commentsContent = getCommentNameFromID(commentsIds);


    issueName.innerHTML = issueArray[getissueID].getIssueName;
    type.innerHTML = issueArray[getissueID].getIssueType;
    status.innerHTML = issueArray[getissueID].getIssueStatus;
    descriptions.innerHTML = issueArray[getissueID].getIssueDescription;
    assigned.innerHTML = assigneName;
    created.innerHTML = createdName;
    issueID.innerHTML = issueArray[getissueID].getIssueId;
    updated.innerHTML = update;
    comments.innerHTML = commentsContent;
}

function resetNewIssueFormUI() {
    document.getElementById("isseuField").value = "";
    document.getElementById("selectIssueType").selectedIndex = 0;
    var selAssigne = document.getElementById("selectIssueAssigne");
    document.getElementById("newComment").value = "";
    document.getElementById("newIsseuDescription").value = "";

    selAssigne.selectedIndex = 0;
    var i;
    var assigneItems = selAssigne.childElementCount;
    for (i = 1; i < assigneItems; i++) {
        selAssigne.remove(1);
    }
    selectParentIssue.selectedIndex = 0;
    var parentItems = selectParentIssue.childElementCount;
    for (i = 1; i < parentItems; i++) {
        selectParentIssue.remove(1);
    }
}

function filterIssues(value, columNumber, appendClass) {
    var tablelength = table.rows.length,
            i;
    for (i = 1; i < tablelength - 1; i++) {
        if (table.rows[i].classList.contains(appendClass)) {
            table.rows[i].classList.remove(appendClass);
        }
        if (table.rows[i].cells[columNumber - 1].innerHTML !== value) {
            table.rows[i].classList.add(appendClass);
        }
    }

}

function getParentIssue(subIssueID){
    
}



// methods managing the events from the UI

// BY CLICKING on table sets visible of the creating, editing, move and deleting option form, returning which row was clicked
function manageIssue(obj) {
    if (sprintArray.length > 0) {
        document.getElementById("myDropdown").style.visibility = "visible";
        if (typeof obj.rowIndex!=="undefined"){
            rowIndex = obj.rowIndex; 
        }
        
    } else {
        window.alert("Please first create a Sprint");
    }
}

function filterIssueBySprint(value) {
    var tableLength = table.rows.length,
            i;
    if (tableLength > 2) {
        for (i = 1; i < tableLength - 1; i++) {
            row = table.rows[i];
            var rowIssueSprintID = issueArray[row.cells[8].innerHTML - 1].getIssueSprint;
            if (row.classList.contains("sprintRowHidden")) {
                row.classList.remove("sprintRowHidden");
            }
            if (rowIssueSprintID !== selectedSprintTabID) {
                row.classList.add("sprintRowHidden");

            }
        }
    }
}


//By CLICKING on s SPRINTTAB manage the  SELECTION of Sprints UI (from the menutab)
function manageSprintMenu(obj) {
    var sprintTabsList = document.getElementsByTagName("a");
    var i;
    for (i = 0; i < sprintTabsList.length; i++) {
        sprintTabsList[i].className = "sprintTabs";
    }
    obj.className = "active";
    sprintTabName = obj.id;
    selectedSprintTabID = getIDFromStringID(sprintTabName);
    filterIssueBySprint();   
    
    
    document.getElementById("newIssueContainer").style.visibility = "hidden";
    document.getElementById("myDropdown").style.visibility = "hidden";

}



// BY CLICKINg on the CREATE user, creates an user and it is added to the user select list; 
function createUserUI() {
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

        document.getElementById("newIssueContainer").style.visibility = "hidden";
        document.getElementById("newSprintForm").style.visibility = "hidden";
        document.getElementById("myDropdown").style.visibility = "hidden";
        resetNewIssueFormUI();

    } else {
        window.alert("Please enter username");
    }
}
;


// BY CLICKINg on the CREATE Project, creates a project, and it is added to project select list, when project is created it selected
function createProjectUI() {
    var projectname = projectNameInput.value;
    if (userArray.length !== 0) {
        if (projectname !== "" && projectname !== " ") {
            createNewProject(projectname);                                          //creates the project and add to the projectArray
            var opt = document.createElement('option');
            opt.value = projectList.length;
            opt.innerHTML = projectname;
            projectList.appendChild(opt);

            //updating the Project Overview
            projectList.selectedIndex = projectList.length - 1;
            var projectid = "project" + projectname + "_" + projectList.selectedIndex;
            createTree(projectname, contentTree, "UL", projectid);
            projectNameInput.value = "";

            document.getElementById("newSprintForm").style.visibility = "hidden";
            document.getElementById("myDropdown").style.visibility = "hidden";
            document.getElementById("newIssueContainer").style.visibility = "hidden";
            resetNewIssueFormUI();
        } else {
            window.alert("Please enter the name of the Project");
        }
    } else {
        window.alert("Please Create a User First");
        
    }
}
;



// BY CLICKING on NEW SPRINT, trigger an event which sets visible of the Sprint creation form
function triggerSprintCreationUI() {
    var selectedProjectId = projectList.selectedIndex;
    if (selectedProjectId > 0) {
        document.getElementById("newSprintForm").style.visibility = "visible";
    } else {
        window.alert("please select a project first");
    }
}
;


//BY CLICKING on SAVE, creates a new Sprint, adds to the tab, and the latest creates is automatically selected
function createSprintUI() {
    var name = document.getElementById("sprintField").value;
    var tablength = sprintMenu.children.length;
    if (name !== "") {
        document.getElementById("newSprintForm").style.visibility = "hidden";
        var tab = document.createElement("LI");
        var aNode = document.createElement("A");
        aNode.setAttribute("class", "aSprintTab");
        aNode.setAttribute("onclick", "manageSprintMenu(this)");
        aNode.setAttribute("id", '"sprint-' + name + "_" + tablength + '"');
        aNode.innerHTML = name;
        tab.appendChild(aNode);

        sprintMenu.insertBefore(tab, sprintMenu.childNodes[tablength - 1]);
        manageSprintMenu(sprintMenu.children[tablength - 1].children[0]);
        createNewSprint(name);


        var selectedProjectId = projectList.selectedIndex;
        var project = projectArray[selectedProjectId - 1];
        var sprint = sprintArray[sprintArray.length - 1];
        connectSprint(project, sprint);


        //updating the -Project Overview-
        var projectname = project.getProjectName;
        var nodeID = "project" + projectname + "_" + selectedProjectId;
        var node = document.getElementById(nodeID);
        var sprintID = "sprint" + name + "_" + (tablength - 1);
        createTree(name, node, "UL", sprintID);

        document.getElementById("sprintField").value = "";
        document.getElementById("newIssueContainer").style.visibility = "hidden";
        document.getElementById("newSprintForm").style.visibility = "hidden";
        document.getElementById("myDropdown").style.visibility = "hidden";
        resetNewIssueFormUI();
    } else {
        window.alert("Please enter sprintname");
    }
}

// By CLICKING on CREATE ISSUE will set visible the Issue Creation from, the from will be visible after CLICKED on the TABLE
function triggerIssueCreationUI() {
    if (selectedSprintTabID !== 0) {
        var selectAssigne = document.getElementById("selectIssueAssigne");
        for (i = 0; i < userArray.length; i++) {
            var opt = document.createElement("option");
            opt.value = userArray[i].getUserId;
            opt.innerHTML = userArray[i].getUserName;
            selectAssigne.appendChild(opt);
        }

        /// need to getParentIssues to  populate table, paret Issues are those which ID's are not present in any issue.task;
        parentTaskIDs = getParentTasksIds();
        if (typeof parentTaskIDs !== "undefined" && typeof parentTaskIDs !== "null") {
            for (i = 0; i < parentTaskIDs.length; i++) {
                var parentSprint = issueArray[parentTaskIDs[i] - 1].getIssueSprint;
                if (parentSprint === selectedSprintTabID) {
                    var opt1 = document.createElement("option");
                    opt1.value = issueArray[parentTaskIDs[i] - 1].getIssueId;
                    opt1.innerHTML = issueArray[parentTaskIDs[i] - 1].getIssueName;
                    selectParentIssue.appendChild(opt1);
                }
            }
        } else {
            // ...window.alert("No issues yet");
        }

        document.getElementById("selectIssueType").style.display="block";
        document.getElementById("selectParentIssue").style.display="block";
        document.getElementById("selectSprintIssue").style.display="none";
        document.getElementById("selectStatusIssue").style.display="none";
        
        
        addNewIssue.style.display="block";
        updateIssueBtn.style.display="none";
        
        document.getElementById("newIssueContainer").style.visibility = "visible";
        document.getElementById("myDropdown").style.visibility = "hidden";

    } else {
        window.alert("Please select a sprint");
    }
}



//By CLICKING on the SAVE button, will creates a new Issue, and will add to the table
function createIssueUI() {
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
    var sprintID = selectedSprintTabID;
    var userID = userList.selectedIndex;

    var commentText = commentTextArea.value;

    if (errorResponce.length === 13) {
        var selectedParentTask = selectParentIssue.selectedIndex;

        if (selectedParentTask === 0) {
            createNewIssue(name, typeText, assegneID, dscp, sprintID, userID);
            addIssueToTable(false, table.rows.length - 1);

            //updating the -Project Overview-             
            var sprintName = sprintArray[selectedSprintTabID - 1].getSprintName;

            var nodeID = "sprint" + sprintName + "_" + (selectedSprintTabID - 1);
            var node = document.getElementById(nodeID);
            var issueID = "issue" + name + "_" + (issueArray.length - 1);
            createTree(name, node, "UL", issueID);
        } else {

            createNewIssue(name, "Task", assegneID, dscp, sprintID, userID);
            var selectPrtOptions = selectParentIssue.options,
                selectedvalue = selectPrtOptions[selectedParentTask].value;
            var parenTaskArrayPosition = (selectedvalue - 1);
            
            var  tablePosition = selectedvalue-(1-2); // need to add +1 like this, as otherwise the action is string addition
               
            var i;
            for (i = 0; i < selectedvalue; i++) {
                if (typeof issueArray[i].getIssueSubTasks !== "undefined" && typeof issueArray[i].getIssueSubTasks !== "null") {
                    tablePosition += issueArray[i].getIssueSubTasks.length;
                }
            }
            issueArray[parenTaskArrayPosition].setTaskAdd(issueArray.length);
            addIssueToTable(true, tablePosition);


            //updating the -Project Overview- 
            var issueName = issueArray[parenTaskArrayPosition].getIssueName;
            var nodeID = "issue" + issueName + "_" + (parenTaskArrayPosition);
            var node = document.getElementById(nodeID);
            var subIssueID = "subIssue" + name + "_" + (issueArray.length - 1);
            createTree(name, node, "UL", subIssueID);
        }

        if (commentText !== "" || commentText !== " ") {
            createNewCommment(commentText);
            connectComments(commentArray[commentArray.length - 1], issueArray[issueArray.length - 1]);
        }


        // reseting the create issue form fields  
        selType.selectedIndex = 0;
        selAssigne.selectedIndex = 0;
        var i;
        var assigneItems = selAssigne.childElementCount;
        for (i = 1; i < assigneItems; i++) {
            selAssigne.remove(1);
        }
        ;
        issueName.value = "";
        issueDescription.value = "";
        commentTextArea.value = "";

        resetNewIssueFormUI();
        document.getElementById("newIssueContainer").style.visibility = "hidden";
        document.getElementById("myDropdown").style.visibility = "hidden";
        document.getElementById("newSprintForm").style.visibility = "hidden";
    } else {
        window.alert(errorResponce);
    }
}

function showIssueUpdateUI() {   
    if (rowIndex>0) {
        var i;       
        var selectAssigne = document.getElementById("selectIssueAssigne");
        for (i = 0; i < userArray.length; i++) {
            var opt = document.createElement("option");
            opt.value = userArray[i].getUserId;
            opt.innerHTML = userArray[i].getUserName;
            selectAssigne.appendChild(opt);
        }
       
        for (i=0; i< sprintArray.length;i++){
            if(i!==selectedSprintTabID-1){              
             var opt = document.createElement("option");
             opt.value = sprintArray[i].getSprintId;
             opt.innerHTML = sprintArray[i].getSprintName;
             selectSprintToMove.appendChild(opt);
            } 
        } 
        
        
        //if(){
         document.getElementById("selectIssueType").style.display="none";    
       // }
        
       
        
        document.getElementById("selectParentIssue").style.display="none";
        document.getElementById("selectSprintIssue").style.display="block";
        document.getElementById("selectStatusIssue").style.display="block";
        
        
        addNewIssue.style.display="none";
        updateIssueBtn.style.display="block";
        
        document.getElementById("newIssueContainer").style.visibility = "visible";
        document.getElementById("myDropdown").style.visibility = "hidden";
        
    }else{
        alert("Please select a row first");
        document.getElementById("myDropdown").style.visibility = "hidden";
    }
}

function updateIssueUI(){
     var issueId=table.rows[rowIndex].cells[8].innerHTML;
     var subIssueID="subIssue"+table.rows[rowIndex].cells[0].innerHTML+"_"+(issueId-1);  // so i can get the parent Issue
     
     var parentIssueIDString=document.getElementById(subIssueID).parentNode.getAttribute("id")  // the id contains the name and the arrayposition of the parent ID
     var pos = parentIssueIDString.indexOf("_");
     var elementTabID = parentIssueIDString.slice(pos+1, parentIssueIDString.length );  ///IMPORTANT this is the parent Issue arrayposition
     
     //alert(elementTabID);
     
     var issueName = document.getElementById("isseuField"),
        name = issueName.value;

    var issueDescription = document.getElementById("newIsseuDescription"),
        dscp = issueDescription.value; 

    var selAssigne = document.getElementById("selectIssueAssigne");
    var assegneID = selAssigne.selectedIndex;
    
    
    var commentText = commentTextArea.value;
    
    var newStatus = document.getElementById("selectStatusIssue"),
        newStatusIndex=newStatus.selectedIndex;
    
    
    var moveSprint=selectSprintToMove.selectedIndex;
   

    
   if (name!==""&&name!==" "){
       issueArray[rowIndex-1].setIssueName(name);
           
      
       if(table.rows[rowIndex].cells[0].getAttribute("class")==="issueCol"){
           var issueID="issue"+table.rows[rowIndex].cells[0].innerHTML+"_"+(issueId-1);
           var newIssueID="issue"+name+"_"+(issueId-1) ;
         document.getElementById(issueID).innerHTML=name;
         document.getElementById(issueID).setAttribute("id",newIssueID); 
       }else{  
         var newSubIssueID="subIssue"+name+"_"+(issueId-1);
         document.getElementById(subIssueID).innerHTML=name;
         document.getElementById(subIssueID).setAttribute("id",newSubIssueID);   
       }
        table.rows[rowIndex].cells[0].innerHTML=name;
   }
   
   if (assegneID!==0){
       
   }
   
   //changing to new status
   if(newStatusIndex!==0){
      var statusOptions= newStatus.options,
          newSelectedStatus = statusOptions[newStatusIndex].text;
      issueArray[rowIndex-1].setIssueStatus(newSelectedStatus); 
      table.rows[rowIndex].cells[2].innerHTML=newSelectedStatus;
   }
 
    // changing the update time
    
    var date= new Date();
        issueArray[rowIndex-1].setUpdateDate(date);
    var update = getDate(date) + " / " + getTime(date);
    table.rows[rowIndex].cells[7].innerHTML=update;
    
    
   resetNewIssueFormUI(); 
   newStatus.selectedIndex=0; 
  document.getElementById("newIssueContainer").style.visibility = "hidden";
}



function cancelIssueCreationUI() {
    document.getElementById("newIssueContainer").style.visibility = "hidden";
    resetNewIssueFormUI();
}

function cancelSprintCreationUI() {
    document.getElementById("newSprintForm").style.visibility = "hidden";
    document.getElementById("sprintField").value = "";
}


//function select
function showStatusFilterUI() {
    filterStatusContainer.style.visibility = "visible";
}


function hideStatusFilterUI() {
    filterStatusContainer.style.visibility = "hidden";
    filterStatusSelect.selectedIndex = 0;
}

function filterStatusUI() {
    var statusIndex = filterStatusSelect.selectedIndex,
            statusOptions = filterStatusSelect.options,
            selectedStatus = statusOptions[statusIndex].text;

    /* issue columNumbers by fields:
     *  name=1;
     *  type=2;
     *  status=3;
     *  assigned to= 5
     *  created by =6
     *  updated at =7  */

    if (statusIndex > 0) {
        filterIssues(selectedStatus, 3, "statusRowHidden");
        hideStatusFilterUI();
    } else {
        window.alert("Select by which status to filter ");
    }

}

function hideManaginOptions() {
    document.getElementById("myDropdown").style.visibility = "hidden";
}



// CLICKING event handlers
createUserButton.onclick = function () {
    createUserUI();
};

createPrjButton.onclick = function () {
    createProjectUI();
};

addNewSprint.onclick = function () {
    triggerSprintCreationUI();
};
sprintCreateButton.onclick = function () {
    createSprintUI();
};
cancelSprintCreation.onclick = function () {
    cancelSprintCreationUI();
};

showIssueCreate.onclick = function () {
    triggerIssueCreationUI();
};
addNewIssue.onclick = function () {
    createIssueUI();
};
cancelIssueCreation.onclick = function () {
    cancelIssueCreationUI();
};

statusColumFilter.onclick = function () {
    showStatusFilterUI();
};
filterStatusBtn.onclick = function () {
    filterStatusUI();
};
filterCancelBtn.onclick = function () {
    hideStatusFilterUI();
};

hideManageBtn.onclick = function () {
    hideManaginOptions();
};
showIssueUpdate.onclick = function () {
    showIssueUpdateUI();
};

 updateIssueBtn.onclick= function(){updateIssueUI();};


