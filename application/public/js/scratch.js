const name = document.getElementById('username')
const email = document.getElementById('email')
email.setAttribute("type","email")
const password = document.getElementById('password')
const form = document.getElementById('form')
const passConfirm = document.getElementById('passConfirm')
const errorElement = document.getElementById('error')


form.addEventListener('submit', (e) => {
    let messages = []

    //checks if username starts with alphabet
    var usrname= /^[A-Za-z]/;
    if(!name.value.match(usrname)){
        messages.push('Username must start with alphabet.')
    }

    //check username length
    if (name.value.length < 3) {
        messages.push('Username must be 3 or more characters')
    }

    //check password contains a digit
    var passwd=  /^(?=.*[0-9])/;
    if(!password.value.match(passwd)){
        messages.push('Password must contain a digit')
    }

    //check password contains an uppercase
    passwd=  /^(?=.*[A-Z])/;
    if(!password.value.match(passwd)){
            messages.push('Password must contain an upper case letter')
    }

    //check password must contain special characters
    passwd=  /^(?=.*[/*-+!@#$^&*])/;
    if(!password.value.match(passwd)){
        messages.push('Password must contain special characters /*-+!@#$^&*')
    }

    //check password length
    if(password.value.length < 8) {
        messages.push('Password must be 8 or more characters')
    }

    
    //check password if matches
    if(password.value != passConfirm.value) {
        messages.push('Passwords do not match!')
    }

    if(messages.length > 0) {  
        e.preventDefault()
        errorElement.innerText = messages.join('\n ')
    }

    if(messages.length == 0) {
        alert("Form was submitted!")
    }
    
})