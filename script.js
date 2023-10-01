'use strict';

/////////////////////////////////////////////

//query selector

const search = document.querySelector('.search-icon');
const searchbar = document.querySelector('.search-bar');
const errorval = document.querySelector('.errorval');
const errorwindow = document.querySelector('.errorwindow');
const citysel = document.querySelector('.city');
const tempsel = document.querySelector('.temp');
const humiditysel = document.querySelector('.humidity');
const windsel = document.querySelector('.wind');
const exdetails = document.querySelector('.ex-details');
const wicon = document.querySelector('.w-icon');
const apidata = document.querySelector('.apidata');

/////////////////////////////////////////////

const rendererror = function(msg)
{
    errorval.textContent=msg;

    if(!apidata.classList.contains('hidden'))
    {
        apidata.classList.toggle('hidden');
    }

    if(errorwindow.classList.contains('hidden'))
    {
        errorwindow.classList.toggle('hidden');
    }
    
}

const renderweather = function(data)
{   
    console.log(data);
    let {temp,humidity} = data.main;
    const {speed} = data.wind;
    temp=temp-273.15;
    temp=temp.toFixed(2);
    const {icon} = data.weather[0];
    console.log(icon);

    //inserting value in all parameter of app
    wicon.src=`https://openweathermap.org/img/wn/${icon}@2x.png`;
    tempsel.textContent=`${temp} \xB0C`;
    citysel.textContent=data.name;
    humiditysel.textContent=`${humidity}%`;
    windsel.textContent=`${speed} m/sec`;

    //making unhidden
    if(!errorwindow.classList.contains('hidden'))
    {
        errorwindow.classList.toggle('hidden');
    }

    if(apidata.classList.contains('hidden'))
    {
        apidata.classList.toggle('hidden');
    }
}

const fetchweather = function(loc)
{
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc},IN&appid=a58a271ede59dacda3393054e296a469`)
    .then(response => response.json())
    .then(data => {
        if(data.cod!=200)
        {
            throw new Error(data.message);
        }
        renderweather(data);
    })
    .catch(err => rendererror(err.message));
}

search.addEventListener('click',function()
{
    const loc = searchbar.value;
    fetchweather(loc);
});
