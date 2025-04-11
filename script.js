document.addEventListener("DOMContentLoaded",function(){

    const searchButton=document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer= document.querySelector(".stats-cards");


    function validateUsername(username){
        if(username.trim()===""){
            
            alert("username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username) {
        const url= `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;
            

            const response=await fetch(url);
            if (!response.ok) {
                throw new Error("unable to fetch the User details");
            }
            const parseData=await response.json();
            console.log("Logging data:", parseData);

            displayUserData(parseData);
        }
        catch(error){
            statsContainer.innerHTML=`<p>No data found</p>`;
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(parseData){
        const totalEasyQues = parseData.totalEasy;
        const totalMediumQues = parseData.totalMedium;
        const totalHardQues = parseData.totalHard;

        const solvedTotalEasyQues = parseData.easySolved;
        const solvedTotalMediumQues= parseData.mediumSolved;
        const solvedTotalHardQues= parseData.hardSolved;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues,hardLabel, hardProgressCircle);

        //acceptanceRate contributionPoints ranking



        const cardsData = [
            { label: "Ranking:", value: parseData.ranking },
            { label: "Contribution Points:", value: parseData.contributionPoints },
            { label: "Acceptance Rate:", value: `${parseData.acceptanceRate}%` }
        ];

        cardStatsContainer.innerHTML = cardsData.map(data => 
            `<div class="card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
            </div>`
        ).join("");


    }

    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        console.log("loggin username", username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })

})





