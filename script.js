'Use Strict';

////////////////////////////

//storing user state so next time it do not take time
let userstate="";

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
const mylocation = document.querySelector('.mylocation');

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
    if(loc=="")
    {
        rendererror("No result");
        return;
    }

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

const getlocation = function()
{
    return new Promise(function(resolve,reject)
    {
        navigator.geolocation.getCurrentPosition(resolve,reject);
    });
};

const whereami = async function()
{
    try{
        const pos = await getlocation();
        const {latitude : lat ,longitude :long} = pos.coords;
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=a58a271ede59dacda3393054e296a469`)
        const data = await response.json();
        const {state} = data[0];
        userstate=state;
        fetchweather(state);
    }catch(err)
    {
        rendererror(err.message);
        return;
    }
    
};


///////////////////////////////////////////////////////////

mylocation.addEventListener('click',function()
{
    if(userstate=="")
    {
        whereami();
    }
    else
    {
        fetchweather(userstate);
    }
    
});

search.addEventListener('click',function()
{
    const loc = searchbar.value;
    fetchweather(loc);
});
