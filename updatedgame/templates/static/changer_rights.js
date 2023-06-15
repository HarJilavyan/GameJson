
fetch("get/roles", {method: "post"})
    .then(data => {return data.json()})
    .then(data => {
        const body = data["roles"]
        let markup = ``
        for (let i = 0; i < body.length; i++){
            markup = `<tr><td  id="logins">${body[i][0]}</td><td>`
            if (body[i][1] == ""){
                markup +=       `<select name="rights" id="rights" required>
                                    <option value="">Choose Rights</option>
                                    <option value="admin">admin</option>
                                    <option value="gamer">gamer</option>
                                    <option value="super">super</option>
                                </select>
                            </td>`}
            else if (body[i][1] == "admin") {
                markup +=       `<select name="rights" id="rights" required>
                                    <option value="${body[i][1]}">${body[i][1]}</option>
                                    <option value="gamer">gamer</option>
                                    <option value="super">super</option>
                                </select>
                            </td>`
            }
            else if (body[i][1] == "gamer") {
                markup +=       `<select name="rights" id="rights" required>
                                    <option value="${body[i][1]}">${body[i][1]}</option>
                                    <option value="admin">admin</option>
                                    <option value="super">super</option>
                                </select>
                            </td>`
            }
            else if (body[i][1] == "super") {
                markup +=       `<select name="rights" id="rights" required>
                                    <option value="${body[i][1]}">${body[i][1]}</option>
                                    <option value="admin">admin</option>
                                    <option value="gamer">gamer</option>
                                </select>
                            </td>`
            }
            document.getElementById("score-table").insertAdjacentHTML('beforeend',markup)
        }
    })

/* <select name="rights" id="rights" required>
                    <option value="">Choose Rights</option>
                    <option value="admin">Admin</option>
                    <option value="gamer">Gamer</option>
                </select> */

function sumbitForm(){
    let formData=new FormData();
    loginLength = document.querySelectorAll("[id='logins']").length 
    for (let i = 0; i < loginLength; i++){
        formData.append(document.querySelectorAll("[id='logins']")[i].innerHTML, document.querySelectorAll("[id='rights']")[i].value)
    }
    fetch("post/new/roles",
        {
            body: formData,
            method: "post"
        })
}