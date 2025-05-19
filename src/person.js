import { compareAsc, compareDesc, differenceInDays, getDayOfYear } from 'date-fns'
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

            let dateList = []
            let range = []
            let startDate
            let endDate

            for (const person of personInfo) {
                for (const booking of person.bookings) {
                    dateList.push(new Date(booking.from))
                    dateList.push(new Date(booking.to))
                }
            }

            dateList.sort(compareAsc)
            startDate = dateList[0]
            dateList.sort(compareDesc)
            endDate = dateList[0]

            let date = new Date(startDate)

            while (date <= endDate) {
                range.push(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate())
                date.setDate(date.getDate() + 1)
            }

            return range
        },
        intervals(bookings) {
            let bookingLength = {}
            let bookingLengths = []
            let prevTo = bookings[0].from //should be 05-19
            let prevFrom
            let prevActivity
            let prevPercentage
            let prevStatus
            let min
            let max
            let init = true

            for (const booking of bookings) {

                if (prevPercentage === 50) {
                    // Free days
                    if (differenceInDays(booking.from, max) > 1) {
                        bookingLengths.push(
                            {
                                activity: "Other",
                                percentage: 100,
                                status: "Free",
                                // Non inclusive
                                length: getDayOfYear(new Date(booking.from)) - getDayOfYear(new Date(max)) - 1
                            }
                        )
                    }
                    // Overlapping bookings
                    if (differenceInDays(booking.from, max) < 0) {
                        init = false
                        bookingLengths.pop()
                        if (getDayOfYear(new Date(prevFrom)) < getDayOfYear(new Date(booking.from))) {
                            min = prevFrom
                        } else {
                            min = booking.from
                        }
                        if (getDayOfYear(new Date(prevTo)) > getDayOfYear(new Date(booking.to))) {
                            max = prevTo
                        } else {
                            max = booking.to
                        }
                        bookingLength = {
                            activity: booking.activity,
                            percentage: 50,
                            status: booking.status,
                            length: differenceInDays(
                                new Date(max),
                                new Date(min)
                            ) + 1
                        }
                    }
                    // Normal booking
                    else {
                        bookingLength = {
                            activity: booking.activity,
                            percentage: booking.percentage,
                            status: booking.status,
                            length: differenceInDays(
                                new Date(booking.to),
                                new Date(booking.from)
                            ) + 1
                        }
                    }
                } else {
                    // Free days
                    if (differenceInDays(booking.from, prevTo) > 1) {
                        bookingLengths.push(
                            {
                                activity: "Other",
                                percentage: 100,
                                status: "Free",
                                // Non inclusive
                                length: getDayOfYear(new Date(booking.from)) - getDayOfYear(new Date(prevTo)) - 1
                            }
                        )
                    }
                    // Overlapping bookings
                    if (differenceInDays(booking.from, prevTo) < 0) {
                        init = false
                        bookingLengths.pop()
                        if (getDayOfYear(new Date(prevFrom)) < getDayOfYear(new Date(booking.from))) {
                            min = prevFrom
                        } else {
                            min = booking.from
                        }
                        if (getDayOfYear(new Date(prevTo)) > getDayOfYear(new Date(booking.to))) {
                            max = prevTo
                        } else {
                            max = booking.to
                        }
                        bookingLength = {
                            activity: booking.activity,
                            percentage: 50,
                            status: booking.status,
                            length: differenceInDays(
                                new Date(max),
                                new Date(min)
                            ) + 1
                        }
                    }
                    // Normal booking
                    else {
                        bookingLength = {
                            activity: booking.activity,
                            percentage: booking.percentage,
                            status: booking.status,
                            length: differenceInDays(
                                new Date(booking.to),
                                new Date(booking.from)
                            ) + 1
                        }
                    }
                }

                bookingLengths.push(bookingLength)
                prevTo = booking.to
                prevFrom = booking.from
                prevActivity = booking.activity
                prevPercentage = booking.percentage
                prevStatus = booking.status
                if(init) {
                    max = prevTo
                }
            }

            return bookingLengths
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

            <div class="bookingTimes" v-for="booking of intervals(info.bookings)">
                <div v-for="n in booking.length">
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

