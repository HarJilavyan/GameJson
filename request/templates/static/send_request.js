function submitRequestForm(){
    let formData = new FormData();
    selected_request = document.getElementById("req-select")
    formData.append("request",selected_request.value)
    fetch("submitrights",
        {
            body: formData,
            method: "post"
        })
    fetch("submitrights",
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