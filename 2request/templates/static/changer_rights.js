
const table = document.getElementById("score-table")
const dataTr = document.getElementById("data-tr")
let superIndex;

for (let i = 0; i < table.rows.length - 1; i++){
    const adminCheckBox = document.getElementById(`admin${i}`)
    const gamerCheckBox = document.getElementById(`gamer${i}`)
    const superCheckBox = document.getElementById(`super${i}`)
    
    if (document.getElementById(`approve${i}`) != null){
        const ApproveButton = document.getElementById(`approve${i}`)    
        ApproveButton.addEventListener("click", function(){
            if(document.getElementById(`requestedrole${i}`).innerText == "Gamer"){
                gamerCheckBox.checked = true
            }
            if(document.getElementById(`requestedrole${i}`).innerText == "Admin"){
                adminCheckBox.checked = true
            }
        })
    }
    if (document.getElementById(`deny${i}`) != null){
        const DenyButton = document.getElementById(`deny${i}`)    
        DenyButton.addEventListener("click", function(){
            if(document.getElementById(`requestedrole${i}`).innerText == "Gamer"){
                gamerCheckBox.checked = false
            }
            if(document.getElementById(`requestedrole${i}`).innerText == "Admin"){
                adminCheckBox.checked = false
            }
        })
    }
        

    if(superCheckBox.checked){
        superIndex = i
    }

    for (let j = 0; j < table.rows.length - 1; j++){
            const newSuperCheckBox = document.getElementById(`super${j}`)
            const newAdminCheckBox = document.getElementById(`admin${j}`)
            const newGamerCheckBox = document.getElementById(`gamer${j}`)
            newSuperCheckBox.addEventListener("change", function(){
                if(j != i){
                    superCheckBox.checked = false
                }
                newAdminCheckBox.checked = false
                newGamerCheckBox.checked = false
            })
            adminCheckBox.addEventListener("change", function(){
                if(adminCheckBox.checked){
                    superCheckBox.checked = false
                }
            })
            gamerCheckBox.addEventListener("change", function(){
                if(gamerCheckBox.checked){
                    superCheckBox.checked = false
                }
            })
        }
    }

        document.getElementById("submit-btn").addEventListener("click", function(){
            if(!document.getElementById(`super${superIndex}`).checked){
                    window.location = "/logout"
            }
            let formData = new FormData()

            for(let i = 0; i < table.rows.length - 1; i++){
                const adminCheckBox = document.getElementById(`admin${i}`)
                const gamerCheckBox = document.getElementById(`gamer${i}`)
                const superCheckBox = document.getElementById(`super${i}`)
                const login_td = document.getElementById(`logins${i}`)
                const requestedRoleClass = document.getElementById(`requestedrole${i}`).className
                let rolesList = []
                let reqList = []


                if(document.getElementById(`${requestedRoleClass}${i}`) != null){
                    if(document.getElementById(`${requestedRoleClass}${i}`).checked){
                        reqList.push("null")
                    }
                }

                if (adminCheckBox.checked){
                    rolesList.push(adminCheckBox.value)
                }
                if (gamerCheckBox.checked){
                    rolesList.push(gamerCheckBox.value)
                }
                if (superCheckBox.checked){
                    rolesList.push(superCheckBox.value)
                }
                if(!superCheckBox.checked && !adminCheckBox.checked && !gamerCheckBox.checked){
                    rolesList.push("")
                }
                formData.append(login_td.innerHTML, rolesList)
                if(reqList[0] == "null"){
                    formData.append(login_td.innerHTML, reqList)}



            }
            fetch("post/new/roles",
            {
                body: formData,
                method: "post"
            })
            location.reload()
            return
        })




// fetch("get/roles", {method: "post"})
//     .then(data => {return data.json()})
//     .then(data => {
//         const body = data["roles"]
//         const login = data["login"]
//         let super_index;
//         let markup = ``
//         let super_role;
//         for (let i = 0; i < body.length; i++){
//             if (login == body[i][0]){
//                 super_index = i
//             }
//             markup = `
//             <tr>
//                 <td  id="logins${i}">${body[i][0]}</td>
//                 <td id="td${i}">
//                     <input type="checkbox" id="admin" value="admin">
//                     <label for="checkbox">Admin</label>
//                     <input type="checkbox" id="gamer" value="gamer">
//                     <label for="checkbox">Gamer</label>
//                     <input type="checkbox" id="super" value="super">
//                     <label for="checkbox">Super</label>
//                 </td>`
//                 document.getElementById("score-table").insertAdjacentHTML('beforeend',markup)
//             }

// for (let i = 0; i < table.rows.length - 1; i++){
//             if (body[i][1] == "admin"){
//                 document.getElementById(`admin${i}`).setAttribute("checked","")
//             }
//             else if (body[i][1] == "gamer") {
//                 document.getElementById(`gamer${i}`).setAttribute("checked","")
//             }
//             else if (body[i][1] == "super") {
//                 super_role = document.getElementById(`super${i}`)
//                 document.getElementById(`super${i}`).setAttribute("checked","")
//             }
//             document.getElementById(`super${i}`).addEventListener("change", function(){
//                 for (let j = 0; j < body.length; j++){
//                     if (j != i){
//                         if (document.getElementById(`super${j}`).checked){
//                             document.getElementById(`super${j}`).checked = false
//                         }
//                     }
//                 }
//                 document.getElementById(`admin${i}`).checked = false
//                 document.getElementById(`gamer${i}`).checked = false
//             }
//             )
//             document.getElementById(`gamer${i}`).addEventListener("change", function(){
//                 document.getElementById(`super${i}`).checked = false
//             }
//             )
//             document.getElementById(`admin${i}`).addEventListener("change", function(){
//                 document.getElementById(`super${i}`).checked = false
//             }
//             )
//         }
        
//         document.getElementById("submit-btn").addEventListener("click", function(){
//             let formData=new FormData();
//             if (document.getElementById(`super${super_index}`).checked == false){
//                 window.location = "/logout"
//             }
//             for (let i = 0; i < body.length; i++){
//                 second_super = document.getElementById(`super${i}`)
//                 if (second_super.checked && second_super != super_role){
//                     super_role.checked = false
//                 }
//                 admin_role = document.getElementById(`admin${i}`)
//                 gamer_role = document.getElementById(`gamer${i}`)
//                 super_role = document.getElementById(`super${i}`)
//                 login_td = document.getElementById(`logins${i}`)
//                 if (admin_role.checked){
//                     formData.append(login_td.innerHTML, admin_role.value)
//                 }
//                 if (gamer_role.checked){
//                     formData.append(login_td.innerHTML, gamer_role.value)
//                 }
//                 if (super_role.checked){
//                     formData.append(login_td.innerHTML, super_role.value)
//                 }
//                 if (!gamer_role.checked && !admin_role.checked && !super_role.checked){
//                     formData.append(login_td.innerHTML, "")
//                 }
//             }
//             fetch("post/new/roles",
//                 {
//                     body: formData,
//                     method: "post"
//                 })
//                 return
//         })

    // })
