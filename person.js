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
            for (const person of data) {
                console.log(person);
            }
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


        // Takes a list of employees and returns a list of dates ranging from the lowest date to highest
        getDates(personInfo) {

            let startDate = 0
            let endDate = 0
            let dateList = []

            let startList = []

            for (const person of personInfo) {
                for (const booking of person.bookings) {
                    startDate = Date.parse(booking.to)
                    if (startDate >= Date.parse(booking.from)) {
                        startList.push(new Date(Date.parse(booking.from)))
                        startDate = startList[0]
                    }
                    if (endDate <= Date.parse(booking.to)) {
                        endDate = new Date(Date.parse(booking.to))
                    }
                }
            }

            let date = new Date(startDate)

            while (date <= endDate) {
                dateList.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
                date.setDate(date.getDate() + 1)
            }
            return dateList
        },
        interval(to, from) {
            to = new Date(to)
            from = new Date(from)
            let dateLength = new Date(to.getTime() - from.getTime()).getDate()
            return dateLength
        },
    },

    

    mounted() {
        this.CreateView();
    },
    template: `
      <div class=persons>
        
        <div>
            <div class="weeks">
                <p>v10</p>
                <br>
            </div>
    
            <div class="dates" v-for="dat of getDates(infos)">
                    <p class="date">{{dat}}</p>
            </div>
            
        </div>
        

        <div v-if="infos.length" v-for="info of infos">
            <div class="person">
                <p>{{ info.name }}</p>
                <p>{{professionsFormatter(info.professions)}}</p>
            </div>

            <div class="bookingTimes" v-for="booking of info.bookings">
                <div v-for="n of interval(booking.to, booking.from)">
                    <p :style="{backgroundColor: getColorForSomeBox(bookingBlock(booking))}">{{bookingBlock(booking)}}</p>
                </div>
            </div>
        </div>
        
        <p v-else>Laddar </p>
      </div>
    `
};

const app = Vue.createApp({});
app.component("person", person);
app.mount("#app");

