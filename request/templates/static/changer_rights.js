
fetch("get/roles", {method: "post"})
    .then(data => {return data.json()})
    .then(data => {
        const body = data["roles"]
        const login = data["login"]
        let super_index;
        let markup = ``
        let super_role;
        for (let i = 0; i < body.length; i++){
            if (login == body[i][0]){
                super_index = i
            }
            markup = `
            <tr>
                <td  id="logins${i}">${body[i][0]}</td>
                <td id="td${i}">
                    <input type="checkbox" id="admin" value="admin">
                    <label for="checkbox">Admin</label>
                    <input type="checkbox" id="gamer" value="gamer">
                    <label for="checkbox">Gamer</label>
                    <input type="checkbox" id="super" value="super">
                    <label for="checkbox">Super</label>
                </td>`
                document.getElementById("score-table").insertAdjacentHTML('beforeend',markup)
            }
        for (let i = 0; i < body.length; i++)
        {
            document.getElementById("admin").id = `admin${i}`
            document.getElementById("gamer").id = `gamer${i}`
            document.getElementById("super").id = `super${i}`

            if (Array.isArray(body[i][1])){
                document.getElementById(`admin${i}`).setAttribute("checked","")
                document.getElementById(`gamer${i}`).setAttribute("checked","")
            }
            
            
            if (body[i][1] == "admin"){
                document.getElementById(`admin${i}`).setAttribute("checked","")
            }
            else if (body[i][1] == "gamer") {
                document.getElementById(`gamer${i}`).setAttribute("checked","")
            }
            else if (body[i][1] == "super") {
                super_role = document.getElementById(`super${i}`)
                document.getElementById(`super${i}`).setAttribute("checked","")
            }
            document.getElementById(`super${i}`).addEventListener("change", function(){
                for (let j = 0; j < body.length; j++){
                    if (j != i){
                        if (document.getElementById(`super${j}`).checked){
                            document.getElementById(`super${j}`).checked = false
                        }
                    }
                }
                document.getElementById(`admin${i}`).checked = false
                document.getElementById(`gamer${i}`).checked = false
            }
            )
            document.getElementById(`gamer${i}`).addEventListener("change", function(){
                document.getElementById(`super${i}`).checked = false
            }
            )
            document.getElementById(`admin${i}`).addEventListener("change", function(){
                document.getElementById(`super${i}`).checked = false
            }
            )
        }
        

        document.getElementById("submit-btn").addEventListener("click", function(){
            let formData=new FormData();
            if (document.getElementById(`super${super_index}`).checked == false){
                window.location = "/logout"
            }
            for (let i = 0; i < body.length; i++){
                second_super = document.getElementById(`super${i}`)
                if (second_super.checked && second_super != super_role){
                    super_role.checked = false
                }
                admin_role = document.getElementById(`admin${i}`)
                gamer_role = document.getElementById(`gamer${i}`)
                super_role = document.getElementById(`super${i}`)
                login_td = document.getElementById(`logins${i}`)
                if (admin_role.checked){
                    formData.append(login_td.innerHTML, admin_role.value)
                }
                if (gamer_role.checked){
                    formData.append(login_td.innerHTML, gamer_role.value)
                }
                if (super_role.checked){
                    formData.append(login_td.innerHTML, super_role.value)
                }
                if (!gamer_role.checked && !admin_role.checked && !super_role.checked){
                    formData.append(login_td.innerHTML, "")
                }
            }
            fetch("post/new/roles",
                {
                    body: formData,
                    method: "post"
                })
                return
        })

    })
