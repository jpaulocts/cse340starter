const form = document.querySelector("#updateAccountForm")
    form.addEventListener("change", function(){
        const updateBtn = document.querySelector("#updateButton")
        updateBtn.removeAttribute("disabled")
    })

    const formPassword = document.querySelector("#updateAccountPassword")
    form.addEventListener("change", function(){
        const updatePswBtn = document.querySelector("#updatePassword")
        updatePswBtn.removeAttribute("disabled")
    })