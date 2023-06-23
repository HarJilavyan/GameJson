function submitRequestForm(){
    let formData = new FormData();
    let adminChecked = document.getElementById("admin")
    let gamerChecked = document.getElementById("gamer")
    if(adminChecked.checked){
        formData.append("request","admin")
    }
    if(gamerChecked.checked){
        formData.append("request","gamer")
    }
    fetch("submitrequests",
        {
            body: formData,
            method: "post"
        })
    fetch("submitrequests",
    {
        body: formData,
        method: "post"
    }).then((data) => {return data.json()}).then((data) => {
        if (data["status"] == "fail"){
            alert(data["message"])
        }
        else if(data["status"] == "ok"){
            alert(data["message"])
        }
    })
}