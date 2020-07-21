const usernameInputElement = document.getElementById("username");
console.log(usernameInputElement);

usernameInputElement.addEventListener('keyup', async(e) => {
    const username = e.target.value;
    const url ="https://api.github.com/users/" + username;

    try{
        const response = await fetch(url);
        console.log(response);
        const userData = await response.json();
        console.log(userData);

    const profileElement = document.getElementById("profile");
    
    profileElement.innerHTML = `
        <div>${userData.company}</div>
        <img src ="${userData.avatar_url}">
    `;
    }
    catch (err){
        console.log(err);
    }
    
});