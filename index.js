var map = L.map('map').setView([12.9716, 77.5946], 13);
const areaBaseUrl='https://kyupid-api.vercel.app/api/areas';
const userBaseUrl='https://kyupid-api.vercel.app/api/users';
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoidmlra3kyNCIsImEiOiJja3l1NWhwN20xa2xnMnZvM2lwcnh5YjNrIn0.k7fmhs7xrhHlM9lwBqcRWQ'
}).addTo(map);
async function getdata(){
    const responseArea=await fetch(areaBaseUrl);
    const data=await responseArea.json();
    const userResponse=await fetch(userBaseUrl);
    const udata=await userResponse.json();
    console.log(udata.users[0]);
    for(let i=0;i<data.features.length;i++){
    
      let total_users_in_area=0;
      let total_premium_user_in_area=0;
      let total_male_user=0;
      let total_female_user=0;

      for(let j=0;j<udata.users.length;j++){
          if(data.features[i].properties.area_id==udata.users[j].area_id){
              if(udata.users[j].is_pro_user){
                  total_premium_user_in_area++;
              }
              if(udata.users[j].gender==='M'){total_male_user++;}
              if(udata.users[j].gender==='F'){total_female_user++;}
              total_users_in_area++;
          }
      }
      console.log(total_users_in_area);
      console.log(total_premium_user_in_area);
      var circle = L.circle([data.features[i].geometry.coordinates[0][0][1],data.features[i].geometry.coordinates[0][0][0]], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    }).addTo(map);
    
    circle.bindPopup(`
    <p class=" a">Area Id: <strong class="area-id">${data.features[i].properties.area_id}</strong></p>
    <p class="area-name a">Area Name: <strong>${data.features[i].properties.name}</strong></p>
    <p class="pin-code a">Pincode: <strong>${data.features[i].properties.pin_code}</strong></p>
    <p class="pin-code a">Total active user: <strong>${total_users_in_area}</strong></p>
    <p class="pin-code a">Revenue Per Area: <strong>${total_premium_user_in_area}</strong></p>
    <p class="pin-code a">Male/Female: <strong>${total_male_user+'/'+total_female_user}</strong></p>
    `);
    }
}
getdata();
