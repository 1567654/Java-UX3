const person = {
    data() {
        return {
            infos: [],
            newprofession: ""
        };
    },
    methods: {
        async getALLBookings() {
            const URL = "https://yrgo-web-services.netlify.app/bookings";

            try {
                let response = await fetch(URL);

                if (!response.ok) {
                    if (response.status >= 400 && response.status < 500) {
                        console.error(`Klientproblem ${response.status}: ${response.statusText}`);
                        throw new Error("The search was incorrect.\n Try something else");
                    } else {
                        console.error(`Serverproblem ${response.status}: ${response.statusText}`);
                        throw new Error("The server is unavailable at the moment.");
                    }
                }


                return await response.json();

            } catch (error) {
                console.error(error);
                return [];
            }
        },

        async CreateView() {
            const data = await this.getALLBookings();
            console.log(data[0]);
            if (Array.isArray(data)) {
                this.infos = data;
            }
        },

        professionsFormatter(professions) {
            return professions.join("/");
        },

        bookingBlock(booking) {
            const status = booking.status;
            const percentage = booking.percentage;

            let text = "";

            switch (status) {
                case "Booked":
                    //Bokad
                    text += "B ";
                    break;
                case "Preliminary":
                    //Preliminär
                    text += "PB ";
                    break;
                case "Absent":
                    //Frånvarande
                    text += "F";
                    return text;
                default:
                    //Ledig
                    text += "Fri";
                    return text;
            }

            text += percentage;
            return text;
        },

        getColorForSomeBox(text) {
            switch (text) {
                case "B 50":
                    return "#44B1F9"
                case "B 100":
                    return "#FFA20C"
                case "F":
                    return "#8B1313"
                case "PB 100":
                    return "#FFDA0C"
                case "PB 50":
                    return "#7FFFD0"
                default:
                    return "#00E910"
            }
        },

        getDates() {
            const from = document.getElementById('start');
            const to = document.getElementById('end');

            const date = to.value;

            console.log(to);
            console.log(date);
            // for(const date = to.value; ){

            // }

            return ["adjlajd", "kjsbksb", "skhbckscb"]
        }
    },

    mounted() {
        this.CreateView();
    },
    template: `
      <div class=persons>
        
        <div class="weeks">
        
        </div>

        <div class="dates">
            <p class="date">empty</p>
            <p class="date" v-for="date of getDates()">{{date}}</p>
        </div>

        <div v-if="infos.length" v-for="info of infos">
            <div class="person">
                <p>{{ info.name }}</p>
                <p>{{professionsFormatter(info.professions)}}</p>
            </div>

            <div class="bookingTimes" v-for="booking of info.bookings">
                <p :style="{backgroundColor: getColorForSomeBox(bookingBlock(booking))}">{{bookingBlock(booking)}}</p>
            </div>
        </div>
        
        <p v-else>Laddar </p>
      </div>
    `
};

const app = Vue.createApp({});
app.component("person", person);
app.mount("#app");

