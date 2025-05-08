async function getALLBookings() {
    const URL = "https://yrgo-web-services.netlify.app/bookings"

    try {
        let response = await fetch(URL);

        if (!response.ok) {
            if (response.status >= 400 && response.status < 500) {
                console.error(`Klientproblem ${response.status}: ${response.statusText}`);
                throw new Error("The search was incorrect.\n Try something else");
            } else {
                console.error(`Serverproblem ${response.status}: ${response.statusText}`)
                throw new Error("The server is unavailable at the moment.");
            }
        }

        let json = await response.json();
        console.log(json);
        return json;

    } catch (error) {
        console.error(error);
        return error;
    }
}

async function CreateVieu(){
    const list = await getALLBookings();
    for(person of list){
        console.log("Name: " + person.name + "  professions: " + person.professions);
    }
}

CreateVieu();
