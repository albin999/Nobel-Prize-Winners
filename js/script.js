let winners;
let yearList=[];
let categoryList=[];
let loading=document.getElementById("loadingimg");

async function fetchFromApiServer(){
    try{
    const result= await fetch('http://api.nobelprize.org/v1/prize.json');
    console.log(result);
    const resObject = await result.json();
    console.log(resObject.prizes[0].category);
    return resObject.prizes;
    }
    catch(err){
        console.error(err);
    }
}

async function multipleTimesWinners(){
    const multiWinnerTable=document.getElementById("multiplePrizeWinner");
    winners=await fetchFromApiServer();
    const dic={};
    winners.forEach((element)=>{
        if(element.laureates != undefined){
            element.laureates.forEach((winner)=>{
                if(dic[winner.id] === undefined){
                    dic[winner.id]=[1,winner.firstname,winner.surname,element.year,element.category];
                }
                else{
                    console.log(dic[winner.id][0]);
                    dic[winner.id]= [+dic[winner.id][0]+1,dic[winner.id][1],dic[winner.id][2],dic[winner.id][3],dic[winner.id][4],element.year,element.category];
                }
            });
        } 
    });
    console.log(dic);
    loading.style.display = 'none';
    for(let key in dic){
        if((dic[key][0]>1)&&(dic[key][2]!=undefined)){
            console.log(dic[key]);
            multiWinnerTable.innerHTML=multiWinnerTable.innerHTML+
            `<tr>
            <td rowspan="2" class="multidata"><div class="multid">${dic[key][1]}</div></td>
            <td rowspan="2" class="multidata"><div class="multid">${dic[key][2]}</div></td>
            <td class="multidata"><div class="multid">${dic[key][5]}</div></td>
            <td class="multidata"><div class="multid">${dic[key][6]}</div></td>
          </tr>
          <tr>
            <td class="multidata"><div class="multid">${dic[key][3]}</div></td>
            <td class="multidata"><div class="multid">${dic[key][4]}</div></td>
          </tr>`;
        }
    };
    nobelPrizeWinner();
}

function nobelPrizeWinner(){
    const winnerTable =document.getElementById("nobelPrizeWinner");
    let year=0;

    winners.forEach((element)=>{
        if(element.year == year){
            if(!categoryList.includes(element.category)){
                categoryList.push(element.category);
            }
            displayRecord(element,winnerTable);
        }
        else{
            year=element.year;
            yearList.push(year);
            if(!categoryList.includes(element.category)){
                categoryList.push(element.category);
            }
            winnerTable.innerHTML=winnerTable.innerHTML+
            `<tr>
                <th class="yearHead">${element.year}</th>
            </tr>`;
            displayRecord(element,winnerTable);   
        }
    
    });
    yearFilterCreator();
    categoryFilterCreator();

}

function filterSearch(){
    const yearOption=document.getElementById("year");
    const categoryOption=document.getElementById("category");
    let result;
    if(yearOption.value!=='all'){
        result=yearFilter(winners,yearOption);
        if(categoryOption.value!=='all'){
            result=categoryFilter(result,categoryOption);
        }
    }
    else if(categoryOption.value!=='all'){
        result=categoryFilter(winners,categoryOption);
    }
    else{
        result=winners;
    }
    console.log(result);
   displayWinner(result);
}

function yearFilterCreator(){
    const yearFilter=document.getElementById("year");
    yearList.forEach((element)=>{
        yearFilter.innerHTML=yearFilter.innerHTML+`<option value="${element}">${element.toUpperCase()}</option>`
    });
}

function categoryFilterCreator(){
    const categoryFilter=document.getElementById("category");
    categoryList.forEach((element)=>{
        categoryFilter.innerHTML=categoryFilter.innerHTML+`<option value="${element}">${element.toUpperCase()}</option>`
    });
}


function yearFilter(winnerlist,yearOption){
    let result=[];
    winnerlist.forEach((element)=>{
        if(element.year==yearOption.value){
            result.push(element);
        }
    });
    return result;
}

function categoryFilter(winnerlist,categoryOption){
    let result=[];
    winnerlist.forEach((element)=>{
        if(element.category==categoryOption.value){
            result.push(element);
        }
    });
    return result;
}


function displayWinner(winnerlist){
    const winnerTable =document.getElementById("nobelPrizeWinner");
    winnerTable.innerHTML="";
    let year=0;
    winnerlist.forEach((element)=>{
        if(element.year == year){
            displayRecord(element,winnerTable);
        }
        else{
            year=element.year;
            winnerTable.innerHTML=winnerTable.innerHTML+
            `<tr>
                <th class="yearHead">${element.year}</th>
            </tr>` 
            displayRecord(element,winnerTable);
        }
    
    });
}

function displayRecord(element,winnerTable){
    winnerTable.innerHTML=winnerTable.innerHTML+
    `<tr>
        <th class="categoryHead"><div class="categoryData">${element.category.toUpperCase()}</div></th>
    <tr>`;

    if(element.laureates != undefined){
        element.laureates.forEach((winner)=>{
            if(winner.surname != undefined){
                winnerTable.innerHTML=winnerTable.innerHTML+
                `<tr>
                    <td class="dataHead"><div class="data">${winner.firstname} ${winner.surname}</div></td>
                </tr>`;
            }
            else{
                winnerTable.innerHTML=winnerTable.innerHTML+
                `<tr>
                    <td class="dataHead"><div class="data">${winner.firstname}</div></td>
                </tr>`;
            }
        });
    }
    else{
        winnerTable.innerHTML=winnerTable.innerHTML+
        `<tr>
            <td class="dataHead"><div class="data">No Nobel Prize was awarded this year</div></td>
        </tr>`;
    }
}


