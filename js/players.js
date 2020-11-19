var firebaseConfig = {
    apiKey: "AIzaSyB-EEYFZZe4eNJdzQHkttvK7FSNmDKKnN8",
    authDomain: "my-league-app.firebaseapp.com",
    databaseURL: "https://my-league-app.firebaseio.com",
    projectId: "my-league-app",
    storageBucket: "my-league-app.appspot.com",
    messagingSenderId: "978221051084",
    appId: "1:978221051084:web:bfbfc817d28f122e2aa669"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  function loadLeagues() {
    db.collection('leagues').get()
            .then(querySnapshot => {
                querySnapshot.forEach( (doc) => {
                    console.log(`${doc.id}`);
                });
            })
            .catch(err => {
                console.log("Error has occured: " + err);
            });
  }

  //var select = $("#select_team");
  var select = document.getElementById("select_team");

  function loadTeams() {
    db.collection('teams').get()
            .then(querySnapshot => {
                querySnapshot.forEach( (doc) => {
                    console.log(`${doc.id}: ${doc.data().name}`);
                    var dict = doc.data();
                    var option = document.createElement("option");
                    option.text = dict["name"];
                    option.id = dict["id"];
                    select.appendChild(option);
                });

                let selected_team = $('#select_team').val();
                $('#selected_team').val(selected_team);
            })
            .catch(err => {
                console.log("Error has occured: " + err);
            });
  }

  function loadPlayers() {
    var container = document.getElementById("body");
    container.innerHTML = "";
    let teamId = $("#select_team").find(":selected").attr("id");
    let selected_team = $('#select_team').val();
    console.log(`name: ${selected_team}, teamId: ${teamId}`)
    $('#selected_team').text(selected_team);
    db.collection('players').where('teamId', '==', teamId)
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach( (doc) => {
            console.log(`${doc.id}: ${doc.data().name}`);
            createPlayerCards(doc.id, doc.data().name, doc.data().imageUrl);
        });
    })
    .catch(err => {
        console.log("Error has occured: " + err);
    });
  }

  function uploadImageToServer() {
    console.log($("#select_team").val());
    console.log($("#select_team").find(":selected").attr("id"));

    if ($("#select_team").val() == null || $("#select_team").find(":selected").attr("id") == null) {

        return;
    }

    $("#spinner").css("display", "block");
    $("#save_player_btn").prop("disabled", true);
    //if no image file has been selected, prompt the user to select one
    var file = document.getElementById("file").files[0];
    if (file == null) {
        alert('Pls select an image to upload');
        return;
    }
    console.log(`Filename: ${file.name}`);

    let nm = $.trim($('#name').val());
    console.log(`Name: ${nm}`);

    //If name field is empty, prompt the user to enter it.
    if (nm.length == 0) {
        alert('Name field is empty');
        return;
    }

    let id = db.collection("players").doc().id;
    let storageRef = firebase.storage().ref(`playerImages/${id}.jpg`);
    storageRef.put(file)
        .on('state_changed', function(snapshot) {

        }, function(err) {
            $("#spinner").css("display", "none");
            $("# save_player_btn").removeAttr("disabled");
        }, function() {
            storageRef.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                addPlayer(id, downloadURL);
              });
        });
  }

  function addPlayer(id, imageUrl) {
    db.collection("players").doc(id).set({
        id: id,
        name: $("#name").val(),
        teamName: $("#select_team").val(),
        teamId: $("#select_team").find(":selected").attr("id"),
        imageUrl: imageUrl
    })
    .then(function() {
        console.log("Document successfully written!");
        $('#file').text("");
        $('#name').val("");
        $('#image').attr('src', "");
        $("#spinner").css("display", "none");
        $("#save_player_btn").removeAttr("disabled");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
        $("#spinner").css("display", "none");
        $("#save_player_btn").removeAttr("disabled");
    });
  }

  function createPlayerCards(id, name, imageUrl) {
    var container = document.getElementById("body");
    //container.innerHTML = "";
    var cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.classList.add("m-3");
    cardDiv.classList.add("col-sm-3");
    $(cardDiv).height(200);
    $(cardDiv).click(function() {
        console.log(`Card ${id} clicked`)
        $('#addPlayerModal').modal('show');
    });

    
    var img = document.createElement("img");
    img.classList.add("card-img-top");
    img.classList.add("image");
    $(img).attr("src", imageUrl).width("100%").height(150);
    $(img).attr("object-fit", "contain");
    cardDiv.append(img);

    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    var p_name = document.createElement("h6");
    p_name.innerHTML = name;
    p_name.classList.add("card-title");
    p_name.classList.add("text-center");
    cardBody.append(p_name);

    var deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn");
    deleteBtn.classList.add("btn-danger");
    deleteBtn.classList.add("mx-2");
    deleteBtn.innerHTML = "Delete";
    
    deleteBtn.addEventListener("click", function() {
        console.log("Should show delete modal");
        showDeleteModal(id);
    });
    
    var editBtn = document.createElement("button");
    editBtn.classList.add("btn");
    editBtn.classList.add("btn-primary");
    editBtn.innerHTML = "Edit";
    editBtn.setAttribute("data-target", "#addPlayerModal");
    editBtn.setAttribute("data-toggle", "modal");
    editBtn.addEventListener("click", function() {
        loadQuestion(id);
    });
    
    //button_div.append(deleteBtn);
    //button_div.append(editBtn); 
    
    cardDiv.append(cardBody);
    //cardDiv.append(button_div);
    // $(container_div).attr("id", id);
    // console.log("Div id: " + $(container_div).attr("id"));

    if (container) {
        container.append(cardDiv);
    } else {
        console.log('Container is null');
    }
  }

  function loadImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
          $('#image').attr('src', e.target.result);
        }
        
        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
  }

  $(document).ready(function() {
    console.log("Document ready from JQuery");
    loadLeagues();
    loadTeams();
});