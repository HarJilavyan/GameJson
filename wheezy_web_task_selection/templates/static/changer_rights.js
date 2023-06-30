
const tableRowLentgh = document.getElementById("score-table").rows.length

for (let i = 0; i < tableRowLentgh - 1; i++){
  if(document.getElementById(`dropdown-req${i}`) != null){
    const dropdown_req = document.getElementById(`dropdown-req${i}`)
    const dropdown_req_menu = document.getElementById(`dropdown-menu-req${i}`)
    const labels = dropdown_req_menu.querySelectorAll(`label`)

    for(let j = 0; j < labels.length; j++){
      const approveBtn = document.getElementById(`approve${labels[j].id}${i}`)
      const denyBtn = document.getElementById(`deny${labels[j].id}${i}`)
      const inputCheckBox = document.getElementById(`${labels[j].id}${i}`)
      approveBtn.addEventListener("click",function(){
        if(!inputCheckBox.checked){
          inputCheckBox.checked = true;
        }
      })
      denyBtn.addEventListener("click",function(){
        if(inputCheckBox.checked){
          inputCheckBox.checked = false
        }
      })
    }

    dropdown_req.addEventListener("click",function()
    {
      if(dropdown_req_menu.style.display =="none"){
        dropdown_req_menu.style.display = "block"
      }
      else if(dropdown_req_menu.style.display == "block"){
        dropdown_req_menu.style.display = "none"
      }
    })

    document.addEventListener('click', function(event) {
      if (!dropdown_req.contains(event.target)) {
        dropdown_req_menu.style.display = "none"
      }
    })
  }


  if(document.querySelector(`#dropdown${i}`) != null){
  const dropdown = document.querySelector(`#dropdown${i}`);
  const dropdownMenu = dropdown.querySelector(`#dropdown-menu${i}`)


  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) {
      dropdownMenu.style.display = "none"
    }
  })
  dropdown.addEventListener("click", function(){
      if(dropdownMenu.style.display == "none"){
        dropdownMenu.style.display = "block"
      }
      else if(dropdownMenu.style.display == "block"){
        dropdownMenu.style.display = "none"
      }
    })
}
}


document.getElementById("submit-btn").addEventListener("click", function(){
    
  let formData = new FormData()
  let formData1 = new FormData()
  let formData1isEmpty = true;
  for (var j = 0; j < tableRowLentgh; j++) {
    const login = document.getElementById(`logins${j}`)
    const dropdown_req_menu = document.getElementById(`dropdown-menu-req${j}`)
    let labels;
    let req = [];
    if (dropdown_req_menu != null){
      console.log(login)
      labels = dropdown_req_menu.querySelectorAll(`label`)
      for(let i = 0; i < labels.length; i++){
        req.push(labels[i].id)
      }
    }
    if(document.querySelector(`#dropdown${j}`) != null){
      const dropdown = document.querySelector(`#dropdown${j}`);
      const selectedOptions = dropdown.querySelectorAll('input');
      let isAnyOptionSelected = false
      for (let i = 0; i < selectedOptions.length; i++){

        if(selectedOptions[i].checked){
          isAnyOptionSelected = true
          formData.append(login.innerHTML,selectedOptions[i].value)
          if(req.length != 0){
            if(req.includes(selectedOptions[i].value)){
              formData1.append(login.innerHTML,selectedOptions[i].value)
            }
          }
      }
      }
      if (!isAnyOptionSelected){
        formData.append(login.innerHTML, "")
      }

      const formEntries = formData1.entries();
      if (!formEntries.next().done) {
        formData1isEmpty = false;
      }
  }
  }
  
  fetch("post/new/roles",
  {
      body: formData,
      method: "post"
  })
  if(!formData1isEmpty){
  fetch("req/del",
  {
      body: formData1,
      method: "post"
  })}
  location.reload()
})

// class Roles{
//     constructor(role){
//         this.role = role;;
//     }

//     save(){
//       console.log(roles = this.role)
//     }
// }

// for (let i = 0; i < allCheckboxDiv.length; i++){
//     const inputs = allCheckboxDiv[i].querySelectorAll("input")
//     const superRoleIndexInList = inputs.length - 1
//     if(inputs[superRoleIndexInList].checked) {
//         superIndex = i
//         oldSuper = i
//     }
    
//     for (let j = 0; j < inputs.length; j++){
//         const approveBtn = document.getElementById(`approve${inputs[j].value}${i}`)
//         const denyBtn = document.getElementById(`deny${inputs[j].value}${i}`)

//         if(approveBtn != null){
//         approveBtn.addEventListener("click", function(){
//             inputs[j].checked = true
//         })}
//         if(denyBtn != null){
//         denyBtn.addEventListener("click", function(){
//             inputs[j].checked = false
//         })}
//     }

//     document.getElementById("submit-btn").addEventListener("click", function(){})
// }











// console.log(allCheckbox)

// for (let i = 0; i < table.rows.length - 1; i++){
//     // for (let j = 0; j < allCheckbox.length; j++){
//     //     // console.log(allCheckbox[j].id = `${roles[j]}${i}`)
//     // }
//     const adminCheckBox = document.getElementById(`admin${i}`)
//     const gamerCheckBox = document.getElementById(`gamer${i}`)
//     const superCheckBox = document.getElementById(`super${i}`)
    
//     if (document.getElementById(`approve${i}`) != null){
//         const ApproveButton = document.getElementById(`approve${i}`)    
//         ApproveButton.addEventListener("click", function(){
//             if(document.getElementById(`requestedrole${i}`).innerText == "Gamer"){
//                 gamerCheckBox.checked = true
//             }
//             if(document.getElementById(`requestedrole${i}`).innerText == "Admin"){
//                 adminCheckBox.checked = true
//             }
//         })
//     }
//     if (document.getElementById(`deny${i}`) != null){
//         const DenyButton = document.getElementById(`deny${i}`)    
//         DenyButton.addEventListener("click", function(){
//             if(document.getElementById(`requestedrole${i}`).innerText == "Gamer"){
//                 gamerCheckBox.checked = false
//             }
//             if(document.getElementById(`requestedrole${i}`).innerText == "Admin"){
//                 adminCheckBox.checked = false
//             }
//         })
//     }
        

//     if(superCheckBox.checked){
//         superIndex = i
//     }

//     for (let j = 0; j < table.rows.length - 1; j++){
//             const newSuperCheckBox = document.getElementById(`super${j}`)
//             newSuperCheckBox.addEventListener("change", function(){
//                 if(j != i){
//                     superCheckBox.checked = false
//                 }
//                 const inputs = allCheckboxDiv[j].querySelectorAll("input")
//                 for (let k = 0; k < inputs.length; k++){
//                     if(inputs[k].value != "super"){
//                         inputs[k].checked = false
//                     }
//                 }
//             })
//             adminCheckBox.addEventListener("change", function(){
//                 if(adminCheckBox.checked){
//                     superCheckBox.checked = false
//                 }
//             })
//             gamerCheckBox.addEventListener("change", function(){
//                 if(gamerCheckBox.checked){
//                     superCheckBox.checked = false
//                 }
//             })
//         }
//     }

//         document.getElementById("submit-btn").addEventListener("click", function(){
//             if(!document.getElementById(`super${superIndex}`).checked){
//                     window.location = "/logout"
//             }
//             let formData = new FormData()

//             for(let i = 0; i < table.rows.length - 1; i++){
//                 const adminCheckBox = document.getElementById(`admin${i}`)
//                 const gamerCheckBox = document.getElementById(`gamer${i}`)
//                 const superCheckBox = document.getElementById(`super${i}`)
//                 const login_td = document.getElementById(`logins${i}`)
//                 const requestedRoleClass = document.getElementById(`requestedrole${i}`).className
//                 let rolesList = []
//                 let reqList = []


//                 if(document.getElementById(`${requestedRoleClass}${i}`) != null){
//                     if(document.getElementById(`${requestedRoleClass}${i}`).checked){
//                         reqList.push("null")
//                     }
//                 }

//                 if (adminCheckBox.checked){
//                     rolesList.push(adminCheckBox.value)
//                 }
//                 if (gamerCheckBox.checked){
//                     rolesList.push(gamerCheckBox.value)
//                 }
//                 if (superCheckBox.checked){
//                     rolesList.push(superCheckBox.value)
//                 }
//                 if(!superCheckBox.checked && !adminCheckBox.checked && !gamerCheckBox.checked){
//                     rolesList.push("")
//                 }
//                 formData.append(login_td.innerHTML, rolesList)
//                 if(reqList[0] == "null"){
//                     formData.append(login_td.innerHTML, reqList)}



//             }
//             fetch("post/new/roles",
//             {
//                 body: formData,
//                 method: "post"
//             })
//             location.reload()
//             return
//         })


