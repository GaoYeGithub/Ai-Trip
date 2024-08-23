function getItinerary(e) {
  e.preventDefault();

  console.log(e.target.location.value);

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
        'content': `plan a trip itinerary for someone going to ${e.target.location.value} from ${e.target.startdate.value} to ${e.target.enddate.value}. have about 3 or 4 things to do per day. respond ONLY with an array that has JSON objects with the parameters \`date\` \`eventTitle\` \`startTime\` \`endTime\` \`description\``
      }]
    })
  }).then(result => result.json()).then(eventsResponse => {
    console.log(eventsResponse);
    const events = JSON.parse(eventsResponse.choices[0].message.content);

    let htmlGenerated = '<div class="row">';

    for (const event of events) {
      htmlGenerated += `
        <div class="col-md-4 mb-4">
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

    htmlGenerated += '</div>';

    document.getElementById("eventlist").innerHTML = htmlGenerated;
  });
}