let swiper;

function getItinerary(e) {
  e.preventDefault();

  const location = e.target.location.value;
  const startDate = e.target.startdate.value;
  const endDate = e.target.enddate.value;
  const activityType = e.target.activityType.value;

  console.log(location, startDate, endDate, activityType);

  let prompt = `plan a trip itinerary for someone going to ${location} from ${startDate} to ${endDate}. have about 3 or 4 things to do per day.`;

  if (activityType) {
    prompt += ` Focus on ${activityType} activities.`;
  }

  prompt += ` respond ONLY with an array that has JSON objects with the parameters \`date\` \`eventTitle\` \`startTime\` \`endTime\` \`description\``;

  fetch('https://jamsapi.hackclub.dev/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer OQ2U5Y4BD8FFHVN6R7NOOJ12KAG4OITGHLO6U6VI2SJMXPDBODV4C5PIF3UNVR2I'
    },
    body: JSON.stringify({
      'model': 'gpt-3.5-turbo',
      'messages': [{
        'role': 'user',
        'content': prompt
      }]
    })
  }).then(result => result.json()).then(eventsResponse => {
    console.log(eventsResponse);
    const events = JSON.parse(eventsResponse.choices[0].message.content);

    let htmlGenerated = '';

    for (const event of events) {
      htmlGenerated += `
        <div class="swiper-slide">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${event.eventTitle}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${new Date(event.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</h6>
              <p class="card-text">${event.description}</p>
              <p class="card-text"><small class="text-muted">${event.startTime} - ${event.endTime}</small></p>
            </div>
          </div>
        </div>
      `;
    }

    document.getElementById("eventlist").innerHTML = htmlGenerated;

    if (swiper) {
      swiper.destroy();
    }
    swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }
    });
  });
}